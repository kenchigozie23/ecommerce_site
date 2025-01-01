// pages/api/payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const PAYSTACK_SECRET_KEY = "sk_live_1f989bb4583225682fbea8c586d81281ef51e9b6";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const body = req.body;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: body.email,
          amount: parseInt(body.Volume, 10) * 100,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify`,
          metadata: {
            custom_fields: [
              {
                receiver: body.Receiver,
                package_type: body.Package_Type,
                reference: body.Reference,
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.message || "Payment initialization failed"
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Payment Initialization Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
}