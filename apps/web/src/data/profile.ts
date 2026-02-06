import {
    UserIcon,
    PackageIcon,
    MapPinIcon,
    WalletIcon,
    GiftIcon,
    HandshakeIcon,
    ShareIcon,
    SettingsIcon,
    WishlistIcon,
} from "@ff/ui";


export const quickLinks = [
    {
        label: "Profile",
        description: "Update your personal details",
        href: "/account/profile",
        icon: UserIcon
    },
    {
        label: "Orders",
        description: "Track and manage your purchases",
        icon: PackageIcon,
        href: "/account/orders"
    },
    {
        label: "Wishlist",
        description: "Save items for later access",
        icon: WishlistIcon,
        href: "/account/wishlist"
    },
    {
        label: "Addresses",
        description: "Manage shipping details",
        icon: MapPinIcon,
        href: "/account/addresses"
    },

    {
        label: "Gift Cards",
        description: "View and redeem your gift cards",
        icon: GiftIcon,
        href: "/gift-cards"
    },

    {
        label: "Wallet",
        description: "Check refund status and history",
        icon: WalletIcon,
        href: "/account/wallet"
    },

    {
        label: "Referrals",
        description: "Invite friends and earn rewards",
        icon: ShareIcon,
        href: "/account/referrals"
    },

    {
        label: "Legal & Help",
        description: "Access legal information and get help",
        icon: HandshakeIcon,
        href: "/help",
    },

    {
        label: "Settings",
        description: "Manage your account settings",
        icon: SettingsIcon,
        href: "/account/settings",
    },
];


export const userData = {
    name: "Ajmal",
    loyaltyPoints: 2000,
    pointsToNextTier: 5000,
    tierName: "FF Silver",
};