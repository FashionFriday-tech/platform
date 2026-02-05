import {
    UserCheck,
    Box,
    Info,
    Camera,
    CreditCard,
    ShieldCheck,
    Truck,
    RefreshCw,
    Gavel,
    LucideIcon
} from "lucide-react";

export interface TermItem {
    id: string;
    title: string;
    desc: string;
    icon: LucideIcon;
    content: string;
}

export const termsData: TermItem[] = [
    {
        id: "01",
        title: "Acceptance & Eligibility",
        desc: "System Access Protocol",
        icon: UserCheck,
        content: "By accessing this platform, social checkouts, or WhatsApp orders, you agree to these terms. You must be 18+ or have guardian consent. All provided information must be accurate."
    },
    {
        id: "02",
        title: "Product Representation",
        desc: "Visual & Sizing Advisory",
        icon: Box,
        content: "Images are for reference only. Minor color/texture variances exist due to lighting. Size guides are advisory. Accessories in photography are not included."
    },
    {
        id: "03",
        title: "Quality Tier Disclosure",
        desc: "Manufacturing Classification",
        icon: Info,
        content: "Quality grades (OG, Surplus, UA, etc.) are internal classifications. These are non-retail grades and are not brand-authorized. You acknowledge the tier selected."
    },
    {
        id: "04",
        title: "The Unboxing Mandate",
        desc: "Mandatory Verification",
        icon: Camera,
        content: "Strict Requirement: Continuous, uncut 360° unboxing video starting from the sealed package is mandatory for any claim. No video = No return/replacement."
    },
    {
        id: "05",
        title: "Pricing & Payment",
        desc: "Transaction Protocols",
        icon: CreditCard,
        content: "Prices change without notice. Failed payments cancel orders. We use secure third-party gateways. Taxes and shipping are finalized at checkout."
    },
    {
        id: "06",
        title: "COD Security Protocol",
        desc: "Non-Refundable Deposit",
        icon: ShieldCheck,
        content: "All COD orders require a ₹200 non-refundable security deposit. This covers courier charges and is NOT deductible from the product value."
    },
    {
        id: "07",
        title: "Shipping & Logistics",
        desc: "Transit Liability",
        icon: Truck,
        content: "Delivery times are estimates, not guarantees. Delays due to weather or courier strikes are beyond our liability. Address accuracy is your responsibility."
    },
    {
        id: "08",
        title: "Returns & Responsibility",
        desc: "Exchange Protocols",
        icon: RefreshCw,
        content: "Report issues within 24 hours. Wrong product sent? We pay. Wrong size ordered? You pay all shipping & processing. Items must be unused with tags."
    },
    {
        id: "09",
        title: "Order Cancellation",
        desc: "System Rights",
        icon: Gavel,
        content: "Confirmation is not acceptance. We reserve the right to cancel orders due to stock errors, pricing glitches, or fraud detection flags."
    }
];