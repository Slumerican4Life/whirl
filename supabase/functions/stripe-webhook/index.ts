import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { stripe, corsHeaders } from "../shared/stripe-client.ts"; // Uses STRIPE_SECRET_KEY
import { createSupabaseClient } from "../shared/supabase-client.ts";
import Stripe from "https://esm.sh/stripe@14.21.0"; // Import Stripe for type

// Define product details based on Price IDs for easy lookup in the webhook
// This mapping helps the webhook understand what was purchased.
const productMappings: Record<string, any> = {
  // Tokens
  "price_1ROxiBEEqiDDPmsdDTesTTtq": { type: "tokens", tokens: 10, description: "10 Tokens" },
  "price_1ROxs9EEqiDDPmsdZuQxtkY9": { type: "tokens", tokens: 60, description: "60 Tokens" },
  "price_1ROxvXEEqiDDPmsdi64iXrwK": { type: "tokens", tokens: 150, description: "150 Tokens" },
  // Tips
  "price_1ROz7BEEqiDDPmsdiQwGNxeS": { type: "tip", amount_cents: 100, description: "$1.00 Tip" },
  "price_1ROzDvEEqiDDPmsdoWqJR2sv": { type: "tip", amount_cents: 300, description: "$3.00 Tip" },
  "price_1ROzIIEEqiDDPmsdz5oqZvlh": { type: "tip", amount_cents: 500, description: "$5.00 Tip" },
  // Avatar
  "price_1ROyT0EEqiDDPmsd4IcxdPuT": { type: "avatar_direct_upload", description: "Avatar Direct Upload" },
  // Subscriptions
  "price_1ROy0pEEqiDDPmsd0ypbXsfx": { type: "subscription", tier: "standard", description: "Standard Subscription" },
  "price_1ROy49EEqiDDPmsdufe3Hfc7": { type: "subscription", tier: "premium", description: "Premium Subscription" },
};


serve(async (req: Request) => {
  // IMPORTANT: Set STRIPE_WEBHOOK_SECRET in your Supabase Edge Function secrets
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set.");
    return new Response("Webhook secret not configured.", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("No stripe-signature header value.");
    return new Response("No stripe-signature header value.", { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined, // tolerance
      Stripe.createSubtleCryptoProvider() // For Deno environment
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabaseService = createSupabaseClient(true); // Use service role client

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout session completed: ${session.id}`, session.metadata);

      const userId = session.client_reference_id;
      if (!userId) {
        console.error("Webhook Error: User ID (client_reference_id) not found in session.", session);
        return new Response("User ID not found in session.", { status: 400 });
      }

      const productMetadata = session.metadata || {}; // Metadata set during checkout creation
      const priceIdFromMetadata = productMetadata.price_id as string;
      
      // Fallback to line items if price_id not in metadata (though it should be)
      let primaryPriceId = priceIdFromMetadata;
      if (!primaryPriceId && session.line_items && session.line_items.data.length > 0) {
        primaryPriceId = session.line_items.data[0].price?.id;
      }
      
      if (!primaryPriceId) {
        console.error("Webhook Error: Could not determine Price ID from session metadata or line items.", session);
        return new Response("Could not determine Price ID.", { status: 400 });
      }

      const productInfo = productMappings[primaryPriceId];

      if (!productInfo) {
        console.warn(`Webhook: No product mapping found for Price ID: ${primaryPriceId}. Session ID: ${session.id}`);
        // Potentially a Price ID not yet mapped, or not meant for this webhook.
        return new Response("Product mapping not found.", { status: 200 }); // Acknowledge, but don't process.
      }
      
      console.log(`Processing purchase for user ${userId}, product type ${productInfo.type}, price ID ${primaryPriceId}`);

      try {
        if (productInfo.type === "tokens") {
          const tokensToAdd = productInfo.tokens;
          const { data: wallet, error: walletError } = await supabaseService
            .from("token_wallets")
            .select("balance")
            .eq("user_id", userId)
            .single();
          if (walletError && walletError.code !== 'PGRST116') throw walletError;
          
          const currentBalance = wallet?.balance ?? 0;
          const newBalance = currentBalance + tokensToAdd;

          await supabaseService
            .from("token_wallets")
            .upsert({ user_id: userId, balance: newBalance, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
          
          await supabaseService.from("token_transactions").insert({
            user_id: userId,
            amount: tokensToAdd,
            transaction_type: "purchase",
            stripe_checkout_session_id: session.id,
            description: `Purchased ${productInfo.description} via webhook.`,
          });
          console.log(`Tokens credited for user ${userId}. New balance: ${newBalance}`);
        } else if (productInfo.type === "tip") {
          // Assuming tip_target_user_id is in productMetadata
          const tipTargetUserId = productMetadata.tip_target_user_id as string;
          // Record in tip_jar table
          await supabaseService.from("tip_jar").insert({
            from_user_id: userId,
            to_user_id: tipTargetUserId || null, // Handle if target is not specified
            amount_cents: productInfo.amount_cents,
            // tier might be determined by amount or a specific tier passed in metadata
            tier: productInfo.description, // Example, refine this
            stripe_charge_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
          });
          console.log(`Tip recorded from user ${userId} to ${tipTargetUserId || 'platform'}.`);
          // Stripe Connect logic for transferring funds would go here if applicable.
        } else if (productInfo.type === "subscription") {
          const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
          if (!stripeSubscriptionId) {
            console.error("Subscription ID missing from checkout session for subscription product.", session);
            return new Response("Subscription ID missing.", { status:400 });
          }
          const subscriptionDetails = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          
          await supabaseService.from("user_subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
            stripe_subscription_id: stripeSubscriptionId,
            tier: productInfo.tier,
            status: subscriptionDetails.status, // 'active', 'trialing', etc.
            current_period_start: new Date(subscriptionDetails.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionDetails.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' }); // Assuming one active sub per user for now
           console.log(`Subscription ${productInfo.tier} processed for user ${userId}.`);
        } else if (productInfo.type === "avatar_direct_upload") {
          // Logic for avatar direct upload, e.g., flag user profile
          // This might require a specific field on 'profiles' or 'avatar_customizations'
          console.log(`Avatar direct upload processed for user ${userId}.`);
           await supabaseService.from("avatar_customizations").upsert(
            { user_id: userId, avatar_url: `paid_unlock_${new Date().getTime()}`, updated_at: new Date().toISOString() }, // Placeholder URL, actual upload is separate
            { onConflict: 'user_id' }
          );
        }
        // Add more handlers for other product types (avatar items, boosts)
      } catch (dbError) {
        console.error(`Webhook: Database update error for session ${session.id}:`, dbError);
        return new Response(`Webhook database error: ${dbError.message}`, { status: 500 });
      }
      break;
    
    // Handle other event types like 'invoice.payment_succeeded' for subscriptions after first payment,
    // or 'customer.subscription.updated/deleted' for managing subscription status.
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_create') {
        const stripeSubscriptionId = invoice.subscription as string;
        const customerId = invoice.customer as string;

        // Find user by stripe_customer_id
        const { data: subUser, error: subUserError } = await supabaseService
          .from("user_subscriptions")
          .select("user_id, tier")
          .eq("stripe_customer_id", customerId)
          .eq("stripe_subscription_id", stripeSubscriptionId)
          .single();

        if (subUserError || !subUser) {
          console.warn(`Webhook: User not found for subscription renewal. Stripe Customer: ${customerId}, Sub ID: ${stripeSubscriptionId}`);
          break;
        }
        
        const subscriptionDetails = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        await supabaseService.from("user_subscriptions").update({
            status: subscriptionDetails.status,
            current_period_start: new Date(subscriptionDetails.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionDetails.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", subUser.user_id)
          .eq("stripe_subscription_id", stripeSubscriptionId);
        console.log(`Subscription ${stripeSubscriptionId} for user ${subUser.user_id} updated by invoice.payment_succeeded.`);
      }
      break;
      
    // ... other event handlers (e.g., customer.subscription.updated/deleted)

    default:
      console.log(`Webhook: Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
