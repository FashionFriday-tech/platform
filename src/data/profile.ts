import {
    User,
    Package,
    Heart,
    MapPin,
    RefreshCcw,
    Gift,
    Star,
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
        label: "Refunds", 
        description: "Check refund status and history", 
        icon: RefreshCcw, 
        href: "/profile/refunds" 
    },
    { 
        label: "Gift Cards", 
        description: "View and redeem your gift cards", 
        icon: Gift, 
        href: "/profile/gift-cards" 
    },
    { 
        label: "Rate & Review", 
        description: "Share feedback on your purchases", 
        href: "/profile/reviews", 
        icon: Star 
    },
    { 
        label: "Referrals", 
        description: "Invite friends and earn rewards", 
        icon: Share2, 
        href: "/profile/referrals" 
    },
];


export const userData = {
    name: "Ajmal",
    loyaltyPoints: 2000,
    pointsToNextTier: 5000,
    tierName: "FF Silver",
};