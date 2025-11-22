import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
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

    const handleBuyClick = async (planName) => {
        const order = await axios.post(BASE_URL + "/payment/create",
            {
                plan: planName,
            },
            {
                withCredentials: true,
            });

        const {keyId, amount, currency, orderId} = order.data;
        const {firstName, lastName, email} = order.data.notes;
        // Open Razorpay Checkout
        const options = {
            key: keyId, // Replace with your Razorpay key_id
            amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: currency,
            name: 'Career Connect',
            description: 'Connect with software professionals worldwide',
            order_id: orderId, // This is the order_id created in the backend
            prefill: {
                name: `${firstName} ${lastName}`,
                email: email,
            },
            theme: {
                color: '#F37254'
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    return (
        <div className="min-h-screen bg-base-200 py-12 px-5 flex justify-center">
            <div className="w-full max-w-5xl">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
                        Upgrade Your Experience
                    </h1>
                    <p className="text-base-content/70 mt-3 text-lg">
                        More visibility. More matches. More control.
                    </p>
                </div>

                {/* Plan Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`card border shadow-xl rounded-2xl ${plan.highlight
                                ? "bg-primary text-primary-content scale-[1.03]"
                                : "bg-base-100"
                                }`}
                        >
                            <div className="card-body">

                                {/* Title */}
                                <h2 className="card-title text-3xl font-bold">
                                    {plan.name}
                                </h2>
                                <p className="opacity-80 text-lg">{plan.duration}</p>

                                {/* Price */}
                                <div className="mt-5 mb-7">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 text-lg">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <span className="text-success text-xl">✔</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Button */}
                                <div className="mt-8">
                                    <button
                                        className={`btn w-full btn-lg ${plan.highlight
                                            ? "btn-neutral"
                                            : "btn-primary"
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

                {/* Bottom Note */}
                <p className="text-center text-base-content/60 text-sm mt-12">
                    * Upgrading boosts your visibility and increases your chances of matching.
                </p>
            </div>
        </div>
    );
};

export default Premium;
