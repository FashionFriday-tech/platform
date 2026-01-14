import {
    User,
    Package,
    Heart,
    MapPin,
    Wallet,
    Gift,
    HeartHandshake,
    Share2,
    Settings,
} from "lucide-react";


export const quickLinks = [
    {
        label: "Profile",
        description: "Update your personal details",
        href: "/account/profile",
        icon: User
    },
    {
        label: "Orders",
        description: "Track and manage your purchases",
        icon: Package,
        href: "/account/orders"
    },
    {
        label: "Wishlist",
        description: "Save items for later access",
        icon: Heart,
        href: "/account/wishlist"
    },
    {
        label: "Addresses",
        description: "Manage shipping details",
        icon: MapPin,
        href: "/account/addresses"
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
        href: "/account/refunds"
    },

    {
        label: "Referrals",
        description: "Invite friends and earn rewards",
        icon: Share2,
        href: "/account/profile/referrals"
    },

    {
        label: "Legal & Help",
        description: "Access legal information and get help",
        icon: HeartHandshake,
        href: "/help",
    },

    {
        label: "Settings",
        description: "Manage your account settings",
        icon: Settings,
        href: "/account/settings",
    },
];


export const userData = {
    name: "Ajmal",
    loyaltyPoints: 2000,
    pointsToNextTier: 5000,
    tierName: "FF Silver",
};