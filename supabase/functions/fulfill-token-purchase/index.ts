import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { stripe, corsHeaders } from "../shared/stripe-client.ts";
import { createSupabaseClient } from "../shared/supabase-client.ts";

// TOKEN_AMOUNTS maps Stripe Price IDs to the number of tokens.
// Ensure these Price IDs match exactly with your Stripe product prices.
const TOKEN_AMOUNTS: Record<string, number> = {
  "price_1ROxiBEEqiDDPmsdDTesTTtq": 10,  // 10 Tokens for $0.99
  "price_1ROxs9EEqiDDPmsdZuQxtkY9": 60,  // 60 Tokens for $4.99
  "price_1ROxvXEEqiDDPmsdi64iXrwK": 150, // 150 Tokens for $10.00
  // Add other Price IDs if they can also be fulfilled via this legacy path,
  // though ideally all fulfillment will move to the webhook.
};

interface FulfillRequest {
  sessionId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json() as FulfillRequest;
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Missing sessionId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const supabaseService = createSupabaseClient(true); // Use service role

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ error: "Payment not successful" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = session.client_reference_id;
    if (!userId) {
        return new Response(JSON.stringify({ error: "User ID not found in session" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let tokensToAdd = 0;
    let purchasedItemDescription = "Tokens";

    if (session.line_items && session.line_items.data.length > 0) {
        for (const item of session.line_items.data) {
            if (item.price?.id && TOKEN_AMOUNTS[item.price.id]) {
                 tokensToAdd += TOKEN_AMOUNTS[item.price.id] * (item.quantity || 1);
                 purchasedItemDescription = `${TOKEN_AMOUNTS[item.price.id]} Tokens`; // More specific
            }
        }
    }

    if (tokensToAdd === 0) {
      console.warn("No tokens to add for session (legacy fulfillment):", sessionId, "Line items:", session.line_items?.data);
      // Check if it was handled by webhook metadata instead
      if (session.metadata?.product_type === 'tokens' && session.metadata?.price_id && TOKEN_AMOUNTS[session.metadata.price_id as string]) {
         // This indicates a potential race condition or that webhook should be sole fulfiller.
         // For now, this function is a fallback.
         console.log("Session metadata indicates tokens, but line items didn't match TOKEN_AMOUNTS in legacy fulfiller.");
      }
      return new Response(JSON.stringify({ error: "Could not determine tokens to add from purchase (legacy fulfillment)." }), {
        status: 400, // Or perhaps a different status if it's expected webhook handled it
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: wallet, error: walletError } = await supabaseService
      .from("token_wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    let currentBalance = 0;
    if (walletError && walletError.code !== 'PGRST116') { 
      throw walletError;
    }
    if (wallet) {
      currentBalance = wallet.balance;
    }
    
    const newBalance = currentBalance + tokensToAdd;

    const { error: updateError } = await supabaseService
      .from("token_wallets")
      .upsert({ user_id: userId, balance: newBalance, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

    if (updateError) throw updateError;

    const { error: transactionError } = await supabaseService
      .from("token_transactions")
      .insert({
        user_id: userId,
        amount: tokensToAdd,
        transaction_type: "purchase",
        stripe_checkout_session_id: sessionId,
        description: `Purchased ${purchasedItemDescription} (via legacy fulfillment).`,
      });

    if (transactionError) throw transactionError;

    return new Response(JSON.stringify({ success: true, tokensAdded: tokensToAdd, newBalance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Legacy Fulfill purchase error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
