import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  premium: 'price_1TIHwyRdxuZjTm6DLyETIvNW',
  plane:   'price_1TII5KRdxuZjTm6DttuGM7af',
  bundle:  'price_1TII7ORdxuZjTm6DmmGxOCpG',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan } = req.body;

  if (!plan || !PRICES[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const appUrl = process.env.APP_URL || 'https://awtygames.com';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: PRICES[plan],
          quantity: 1,
        },
      ],
      success_url: `${appUrl}?payment=success&plan=${plan}`,
      cancel_url: `${appUrl}?payment=cancelled`,
      allow_promotion_codes: true,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
}
