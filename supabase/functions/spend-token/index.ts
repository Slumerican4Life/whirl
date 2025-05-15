
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createSupabaseClient } from "../shared/supabase-client.ts";
import { corsHeaders } from "../shared/stripe-client.ts"; // Using corsHeaders from stripe-client for consistency

interface SpendTokenRequest {
  userId: string;
  amount: number; // Number of tokens to spend
  type: 'vote' | 'boost';
  description: string;
  relatedVideoId?: string;
  relatedBattleId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { 
      userId, 
      amount, 
      type, 
      description,
      relatedVideoId,
      relatedBattleId 
    } = await req.json() as SpendTokenRequest;

    if (!userId || !amount || !type || !description) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // This function should be called after client-side auth check,
    // but we double-check user exists and token balance with service role for security.
    const supabaseService = createSupabaseClient(true);

    // Verify user
    const { data: userExists, error: userCheckError } = await supabaseService
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (userCheckError || !userExists) {
      return new Response(JSON.stringify({ error: "User not found or authentication issue." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check balance and update wallet
    const { data: wallet, error: walletError } = await supabaseService
      .from("token_wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return new Response(JSON.stringify({ error: "Token wallet not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (wallet.balance < amount) {
      return new Response(JSON.stringify({ error: "Insufficient token balance." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newBalance = wallet.balance - amount;
    const { error: updateError } = await supabaseService
      .from("token_wallets")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // Log transaction
    const { error: transactionError } = await supabaseService
      .from("token_transactions")
      .insert({
        user_id: userId,
        amount: -amount, // Negative for spending
        transaction_type: type,
        description: description,
        related_video_id: relatedVideoId,
        related_battle_id: relatedBattleId,
      });

    if (transactionError) throw transactionError;

    return new Response(JSON.stringify({ success: true, newBalance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Spend token error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
