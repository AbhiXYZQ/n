'use client';

import { toast } from 'sonner';

export const useRazorpay = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = async ({ amount, feature, userId, userName, userEmail, onSuccess }) => {
    try {
      // 0. Ensure SDK is loaded
      if (typeof window.Razorpay === 'undefined') {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error('Failed to load Razorpay SDK. Please check your internet connection or disable ad-blockers.');
          return;
        }
      }

      // 1. Create Order
      const orderRes = await fetch('/api/payment/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, feature }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        toast.error(orderData.message || 'Failed to initialize payment');
        return;
      }

      // 2. Open Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key for frontend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Nainix Marketplace',
        description: `Purchase for ${feature}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await fetch('/api/payment/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              feature,
              amount
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Payment successful! Your features are now active.');
            if (onSuccess) {
              await onSuccess(verifyData);
            } else {
              window.location.reload();
            }
          } else {
            toast.error(verifyData.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#3b82f6', // Primary Blue
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('[Razorpay Hook Error]:', error);
      if (typeof window.Razorpay === 'undefined') {
        toast.error('Razorpay SDK failed to load. Please refresh the page.');
      } else if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        toast.error('Razorpay API Key is missing. Please check your .env file.');
      } else {
        toast.error(`Payment Error: ${error.message || 'Something went wrong'}`);
      }
    }
  };

  return { processPayment };
};
