"use client"
import React, { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { useRouter } from 'next/navigation';
import { Users } from '@/config/schema';
import { db } from '@/config/db';

function BuyCredits() {
  const creditsOption = [
    { credits: 5, amount: 0.99 },
    { credits: 10, amount: 1.99 },
    { credits: 25, amount: 3.99 },
    { credits: 50, amount: 6.99 }
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowPayPal(false);
  };

  const handleBuyClick = () => {
    if (selectedOption) {
      setShowPayPal(true);
    }
  };

  const onPaymentSuccess = async () => {
    try {
      const result = await db
        .update(Users)
        .set({
          credits: userDetail?.credits + selectedOption?.credits
        })
        .where(Users.id.eq(userDetail?.id)) // make sure to filter which user!
        .returning();

      if (result) {
        setUserDetail((prev) => ({
          ...prev,
          credits: prev.credits + selectedOption.credits
        }));
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("❌ Error updating user credits:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-6">Buy Credits</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {creditsOption.map((option, index) => {
          const isSelected = selectedOption?.credits === option.credits;
          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`relative flex flex-col items-center justify-center px-6 py-4 border-2 rounded-xl shadow-md w-36 transition-all duration-300 cursor-pointer
                ${isSelected ? 'bg-purple-600 text-white border-purple-700' : 'bg-white text-gray-800 hover:border-purple-400'}
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
              <span className="text-xl font-bold">{option.credits} Credits</span>
              <span className="text-sm mt-1">${option.amount}</span>
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <>
          <div className="mt-8 text-center text-green-600 font-medium text-lg">
            ✅ You selected <strong>{selectedOption.credits} credits</strong> for <strong>${selectedOption.amount}</strong>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={handleBuyClick} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-md">
              Buy Now
            </Button>
          </div>
        </>
      )}

      {showPayPal && (
        <div className="mt-10 flex justify-center">
          <PayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: selectedOption.amount.toFixed(2),
                    currency_code: 'USD'
                  }
                }]
              });
            }}
            onApprove={async (data, actions) => {
              try {
                const details = await actions.order.capture();
                console.log("✅ Payment successful:", details);
                await onPaymentSuccess();
              } catch (err) {
                console.error("❌ Payment approval error:", err);
              }
            }}
            onError={(err) => {
              console.error("❌ PayPal error:", err);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default BuyCredits;
