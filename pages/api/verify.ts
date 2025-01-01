import type { NextApiRequest, NextApiResponse } from 'next';

const PAYSTACK_SECRET_KEY = "sk_live_1f989bb4583225682fbea8c586d81281ef51e9b6";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { reference } = req.query;
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}