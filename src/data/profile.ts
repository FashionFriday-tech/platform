import {
    User,
    Package,
    Heart,
    MapPin,
    Wallet,
    Gift,
    HeartHandshake,
    Share2,
} from "lucide-react";


export const quickLinks = [
    {
        label: "Profile",
        description: "Update your personal details",
        href: "/profile/edit",
        icon: User
    },
    {
        label: "Orders",
        description: "Track and manage your purchases",
        icon: Package,
        href: "/orders"
    },
    {
        label: "Wishlist",
        description: "Save items for later access",
        icon: Heart,
        href: "/wishlist"
    },
    {
        label: "Addresses",
        description: "Manage shipping details",
        icon: MapPin,
        href: "/profile/addresses"
    },

    {
        label: "Gift Cards",
        description: "View and redeem your gift cards",
        icon: Gift,
        href: "/gift-cards"
    },

    {
        label: "Wallet",
        description: "Check refund status and history",
        icon: Wallet,
        href: "/profile/refunds"
    },

    {
        label: "Referrals",
        description: "Invite friends and earn rewards",
        icon: Share2,
        href: "/profile/referrals"
    },

    {
        label: "Legal & Help",
        description: "Access legal information and get help",
        icon: HeartHandshake,
        href: "/legal-help",
    },
];


export const userData = {
    name: "Ajmal",
    loyaltyPoints: 2000,
    pointsToNextTier: 5000,
    tierName: "FF Silver",
};