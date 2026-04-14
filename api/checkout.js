export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan } = req.body;

  const PRICES = {
    premium: 'price_1TIHwyRdxuZjTm6DLyETIvNW',
    plane:   'price_1TII5KRdxuZjTm6DttuGM7af',
    bundle:  'price_1TII7ORdxuZjTm6DmmGxOCpG',
  };

  if (!plan || !PRICES[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const appUrl = process.env.APP_URL || 'https://awtygames.com';
  const secretKey = process.env.STRIPE_SECRET_KEY;

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        mode: 'subscription',
        'line_items[0][price]': PRICES[plan],
        'line_items[0][quantity]': '1',
        success_url: `${appUrl}?payment=success&plan=${plan}`,
        cancel_url: `${appUrl}?payment=cancelled`,
        allow_promotion_codes: 'true',
      }),
    });

    const session = await response.json();

    if (session.error) {
      console.error('Stripe error:', session.error);
      return res.status(500).json({ error: session.error.message });
    }

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
}
