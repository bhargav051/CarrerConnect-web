import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
    const [isPremiumUser, setIsPremiumUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify Premium Status
    const verifyPremiumUser = async () => {
        try {
            const res = await axios.get(BASE_URL + "/payment/verify", {
                withCredentials: true,
            });
            setIsPremiumUser(res.data.isPremiumUser);
        } catch (err) {
            console.error("Verification failed", err);
            setIsPremiumUser(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        verifyPremiumUser();
    }, []);

    const handlePaymentSuccess = async () => {
        setTimeout(async () => {
            await verifyPremiumUser();
        }, 4000); // wait 4 seconds for webhook to update DB
    };

    const handleBuyClick = async (planName) => {
        const order = await axios.post(
            BASE_URL + "/payment/create",
            { plan: planName },
            { withCredentials: true }
        );

        const { keyId, amount, currency, orderId } = order.data;
        const { firstName, lastName, email } = order.data.notes;

        const options = {
            key: keyId,
            amount,
            currency,
            name: "Career Connect",
            description: "Upgrade to Premium",
            order_id: orderId,
            prefill: {
                name: `${firstName} ${lastName}`,
                email,
            },
            handler: handlePaymentSuccess,
            theme: { color: "#F37254" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const plans = [
        {
            name: "Prime",
            duration: "3 Months",
            price: "₹999",
            highlight: true,
            features: [
                "Unlimited Likes",
                "Chat With Anyone",
                "Blue Verified Tick",
                "Priority Boost",
                "2 Spotlights / Month",
            ],
        },
        {
            name: "Boost",
            duration: "2 Months",
            price: "₹499",
            highlight: false,
            features: [
                "100 Likes / Day",
                "Chat With Anyone",
                "Blue Verified Tick",
                "1 Free Spotlight",
            ],
        },
    ];

    // ------------------------
    // 🔥 FINAL UI RENDER LOGIC
    // ------------------------

    if (loading) {
        return <div className="p-10 text-center">Checking Premium Status...</div>;
    }

    if (isPremiumUser === true) {
        return (
            <div className="min-h-screen bg-base-200 py-12 px-5 flex justify-center">
                <div className="w-full max-w-5xl text-center">
                    <h2 className="text-3xl font-bold">🎉 You are already a Premium User!</h2>
                    <p className="mt-3 text-lg text-base-content/70">
                        Enjoy your unlimited features.
                    </p>
                </div>
            </div>
        );
    }

    // NON-PREMIUM → Show Plans
    return (
        <div className="min-h-screen bg-base-200 py-12 px-5 flex justify-center">
            <div className="w-full max-w-5xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
                        Upgrade Your Experience
                    </h1>
                    <p className="text-base-content/70 mt-3 text-lg">
                        More visibility. More matches. More control.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`card border shadow-xl rounded-2xl ${
                                plan.highlight
                                    ? "bg-primary text-primary-content scale-[1.03]"
                                    : "bg-base-100"
                            }`}
                        >
                            <div className="card-body">
                                <h2 className="card-title text-3xl font-bold">{plan.name}</h2>
                                <p className="opacity-80 text-lg">{plan.duration}</p>
                                <div className="mt-5 mb-7">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                </div>

                                <ul className="space-y-3 text-lg">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <span className="text-success text-xl">✔</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8">
                                    <button
                                        className={`btn w-full btn-lg ${
                                            plan.highlight ? "btn-neutral" : "btn-primary"
                                        }`}
                                        onClick={() => handleBuyClick(plan.name)}
                                    >
                                        Get {plan.name}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Premium;
