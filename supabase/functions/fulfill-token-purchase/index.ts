
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { stripe, corsHeaders } from "../shared/stripe-client.ts";
import { createSupabaseClient } from "../shared/supabase-client.ts";

// Define token amounts for each price ID (replace with your actual Price IDs)
const TOKEN_AMOUNTS: Record<string, number> = {
  "price_YOUR_1_DOLLAR_PRICE_ID": 10,  // Example: 10 tokens for $1
  "price_YOUR_5_DOLLAR_PRICE_ID": 60,  // Example: 60 tokens for $5
  "price_YOUR_10_DOLLAR_PRICE_ID": 150, // Example: 150 tokens for $10
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

    // Calculate total tokens purchased
    let tokensToAdd = 0;
    if (session.line_items && session.line_items.data.length > 0) {
        for (const item of session.line_items.data) {
            if (item.price?.id && TOKEN_AMOUNTS[item.price.id]) {
                 tokensToAdd += TOKEN_AMOUNTS[item.price.id] * (item.quantity || 1);
            }
        }
    }

    if (tokensToAdd === 0) {
      console.warn("No tokens to add for session:", sessionId, "Line items:", session.line_items?.data);
      return new Response(JSON.stringify({ error: "Could not determine tokens to add from purchase." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update token_wallets
    const { data: wallet, error: walletError } = await supabaseService
      .from("token_wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    let currentBalance = 0;
    if (walletError && walletError.code !== 'PGRST116') { // PGRST116: single row not found
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

    // Log transaction
    const { error: transactionError } = await supabaseService
      .from("token_transactions")
      .insert({
        user_id: userId,
        amount: tokensToAdd,
        transaction_type: "purchase",
        stripe_checkout_session_id: sessionId,
        description: `Purchased ${tokensToAdd} tokens.`,
      });

    if (transactionError) throw transactionError;

    return new Response(JSON.stringify({ success: true, tokensAdded: tokensToAdd, newBalance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Fulfill purchase error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
