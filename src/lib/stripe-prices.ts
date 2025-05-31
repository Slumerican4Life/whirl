
// Live Stripe price IDs for Whirl-Win monetization
export const STRIPE_PRICES = {
  // Token packs
  TOKENS_50: 'price_1RKttAEEqiDDPmsdSMYqK77m',    // $5.00 for 50 tokens
  TOKENS_100: 'price_1RKttSEEqiDDPmsdOrAq5UsD',   // $7.50 for 100 tokens
  TOKENS_150: 'price_1RKttmEEqiDDPmsdpZqNsqvT',   // $10.00 for 150 tokens

  // Avatar upgrades
  AVATAR_UPLOAD: 'price_1RKtvkEEqiDDPmsdUKHKHdld', // $1.49 for custom avatar upload

  // Tip tiers
  TIP_SMALL: 'price_1RKtwJEEqiDDPmsd7KTQDpJ4',    // $1.00 tip
  TIP_MEDIUM: 'price_1RKtwuEEqiDDPmsd8RmqyATf',   // $2.00 tip
  TIP_LARGE: 'price_1RKtxAEEqiDDPmsdWBlUtxZw',    // $5.00 tip
} as const

export const TOKEN_PACKAGES = [
  { 
    priceId: STRIPE_PRICES.TOKENS_50, 
    tokens: 50, 
    price: '$5.00', 
    popular: false 
  },
  { 
    priceId: STRIPE_PRICES.TOKENS_100, 
    tokens: 100, 
    price: '$7.50', 
    popular: true 
  },
  { 
    priceId: STRIPE_PRICES.TOKENS_150, 
    tokens: 150, 
    price: '$10.00', 
    popular: false 
  },
]

export const TIP_OPTIONS = [
  { 
    priceId: STRIPE_PRICES.TIP_SMALL, 
    amount: '$1.00', 
    icon: '☕️',
    description: 'Coffee' 
  },
  { 
    priceId: STRIPE_PRICES.TIP_MEDIUM, 
    amount: '$2.00', 
    icon: '🍕',
    description: 'Slice' 
  },
  { 
    priceId: STRIPE_PRICES.TIP_LARGE, 
    amount: '$5.00', 
    icon: '🎉',
    description: 'Party' 
  },
]
