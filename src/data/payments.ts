import {
    CreditCard,
    Smartphone,
    Banknote,
    ShieldCheck,
    AlertCircle,
    RefreshCw,
    Zap,
    LucideIcon
} from "lucide-react";

export interface PaymentSection {
    id: string;
    title: string;
    icon: LucideIcon;
    description: string;
    details: string[];
}

export const paymentData: PaymentSection[] = [
    {
        id: "methods",
        title: "Accepted Gateways",
        icon: CreditCard,
        description: "Secure, encrypted processing via PCI-DSS compliant partners.",
        details: [
            "UPI: GPay, PhonePe, Paytm (Instant)",
            "Cards: Visa, Mastercard, AMEX",
            "Net Banking: 50+ Indian Banks"
        ]
    },
    {
        id: "cod-security",
        title: "COD Service Fee",
        icon: Banknote,
        description: "Logistics risk mitigation for Cash on Delivery orders.",
        details: [
            "₹200 Non-refundable service charge",
            "Charged for cash handling & insurance",
            "Must be paid in advance via UPI/Card"
        ]
    },
    {
        id: "failure-protocol",
        title: "Transaction Failures",
        icon: AlertCircle,
        description: "Standard procedure for debited but failed payments.",
        details: [
            "Auto-refund initiated within 24 hours",
            "Credits reflect in 5-7 business days",
            "Avoid duplicate attempts within 10 mins"
        ]
    },
    {
        id: "settlements",
        title: "Refund Settlement",
        icon: RefreshCw,
        description: "How balance is returned to the user.",
        details: [
            "Preferred: Instant Wallet Credit (100%)",
            "Original Source: 7-10 Days processing",
            "COD Fees: Explicitly non-refundable"
        ]
    }
];