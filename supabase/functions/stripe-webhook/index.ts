
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new (await import('https://esm.sh/stripe@13.11.0')).default(
  Deno.env.get('STRIPE_SECRET_KEY') ?? '',
  { apiVersion: '2023-10-16' }
)

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Updated price mappings with your live price IDs
const PRICE_MAPPINGS = {
  // Token packs
  'price_1RKttAEEqiDDPmsdSMYqK77m': { type: 'tokens', amount: 50, cost: 500 }, // $5.00
  'price_1RKttSEEqiDDPmsdOrAq5UsD': { type: 'tokens', amount: 100, cost: 750 }, // $7.50
  'price_1RKttmEEqiDDPmsdpZqNsqvT': { type: 'tokens', amount: 150, cost: 1000 }, // $10.00
  
  // Avatar upgrade
  'price_1RKtvkEEqiDDPmsdUKHKHdld': { type: 'avatar_upload', tokens: 10, cost: 149 }, // $1.49
  
  // Tips (with 90/10 split)
  'price_1RKtwJEEqiDDPmsd7KTQDpJ4': { type: 'tip', amount: 100, creator_amount: 90 }, // $1.00
  'price_1RKtwuEEqiDDPmsd8RmqyATf': { type: 'tip', amount: 200, creator_amount: 180 }, // $2.00
  'price_1RKtxAEEqiDDPmsdWBlUtxZw': { type: 'tip', amount: 500, creator_amount: 450 }, // $5.00
}

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const priceId = session.line_items?.data[0]?.price?.id || session.metadata?.price_id
        const userId = session.metadata?.user_id
        const recipientId = session.metadata?.recipient_id
        
        if (!userId || !priceId) {
          console.error('Missing required metadata')
          break
        }

        const priceConfig = PRICE_MAPPINGS[priceId]
        if (!priceConfig) {
          console.error('Unknown price ID:', priceId)
          break
        }

        // Handle different purchase types
        switch (priceConfig.type) {
          case 'tokens': {
            // Add tokens to user's wallet
            const { data: wallet } = await supabaseClient
              .from('token_wallets')
              .select('balance')
              .eq('user_id', userId)
              .single()

            const newBalance = (wallet?.balance || 0) + priceConfig.amount

            await supabaseClient
              .from('token_wallets')
              .upsert({
                user_id: userId,
                balance: newBalance
              })

            // Record transaction
            await supabaseClient
              .from('token_transactions')
              .insert({
                user_id: userId,
                amount: priceConfig.amount,
                transaction_type: 'purchase',
                stripe_checkout_session_id: session.id,
                description: `Purchased ${priceConfig.amount} tokens`
              })
            break
          }

          case 'avatar_upload': {
            // Deduct tokens and enable avatar upload
            await supabaseClient
              .from('token_wallets')
              .update({ 
                balance: supabaseClient.rpc('decrement_balance', { 
                  user_id: userId, 
                  amount: priceConfig.tokens 
                })
              })
              .eq('user_id', userId)

            // Record transaction
            await supabaseClient
              .from('token_transactions')
              .insert({
                user_id: userId,
                amount: -priceConfig.tokens,
                transaction_type: 'avatar_customization',
                stripe_checkout_session_id: session.id,
                description: 'Avatar upload upgrade'
              })
            break
          }

          case 'tip': {
            if (!recipientId) {
              console.error('Missing recipient_id for tip')
              break
            }

            // Get recipient's Stripe account
            const { data: recipient } = await supabaseClient
              .from('profiles')
              .select('stripe_connect_id, is_stripe_connected')
              .eq('id', recipientId)
              .single()

            // Record tip in database
            await supabaseClient
              .from('tip_jar')
              .insert({
                from_user_id: userId,
                to_user_id: recipientId,
                amount_cents: priceConfig.amount,
                tier: priceConfig.amount === 100 ? 'small' : 
                      priceConfig.amount === 200 ? 'medium' : 'large',
                stripe_charge_id: session.payment_intent
              })

            // If recipient has Stripe Connect, transfer 90%
            if (recipient?.is_stripe_connected && recipient?.stripe_connect_id) {
              try {
                await stripe.transfers.create({
                  amount: priceConfig.creator_amount,
                  currency: 'usd',
                  destination: recipient.stripe_connect_id,
                  metadata: {
                    tip_session_id: session.id,
                    from_user: userId,
                    to_user: recipientId
                  }
                })

                // Record creator transaction
                await supabaseClient
                  .from('token_transactions')
                  .insert({
                    user_id: recipientId,
                    amount: priceConfig.creator_amount,
                    transaction_type: 'tip_received',
                    stripe_checkout_session_id: session.id,
                    description: `Tip received: $${priceConfig.creator_amount / 100}`
                  })
              } catch (transferError) {
                console.error('Failed to transfer to creator:', transferError)
              }
            }
            break
          }
        }
        break
      }

      case 'account.updated': {
        // Handle Stripe Connect account updates
        const account = event.data.object
        
        if (account.charges_enabled && account.payouts_enabled) {
          await supabaseClient
            .from('profiles')
            .update({ is_stripe_connected: true })
            .eq('stripe_connect_id', account.id)
        }
        break
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 500 })
  }
})
