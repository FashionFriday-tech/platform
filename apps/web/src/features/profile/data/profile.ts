import {
  GiftIcon,
  HandshakeIcon,
  LogOutIcon,
  MapPinIcon,
  PackageIcon,
  SettingsIcon,
  ShareIcon,
  UserIcon,
  WalletIcon,
  WishlistIcon,
} from '@ff/ui';

export interface QuickLinkItem {
  label: string;
  description: string;
  href?: string;
  icon: any;
  action?: string;
  requiresAuth?: boolean;
}

export const quickLinks: QuickLinkItem[] = [
  {
    label: 'Profile',
    description: 'Update your personal details',
    href: '/account/profile',
    icon: UserIcon,
    requiresAuth: true,
  },
  {
    label: 'Orders',
    description: 'Track and manage your purchases',
    icon: PackageIcon,
    href: '/account/orders',
    requiresAuth: true,
  },
  {
    label: 'Wishlist',
    description: 'Save items for later access',
    icon: WishlistIcon,
    href: '/account/wishlist',
    requiresAuth: false,
  },
  {
    label: 'Addresses',
    description: 'Manage shipping details',
    icon: MapPinIcon,
    href: '/account/addresses',
    requiresAuth: true,
  },
  {
    label: 'Gift Cards',
    description: 'View and redeem your gift cards',
    icon: GiftIcon,
    href: '/gift-cards',
    requiresAuth: true,
  },
  {
    label: 'Wallet',
    description: 'Check refund status and history',
    icon: WalletIcon,
    href: '/account/wallet',
    requiresAuth: true,
  },
  {
    label: 'Referrals',
    description: 'Invite friends and earn rewards',
    icon: ShareIcon,
    href: '/account/referrals',
    requiresAuth: true,
  },
  {
    label: 'Legal & Help',
    description: 'Access legal information and get help',
    icon: HandshakeIcon,
    href: '/help',
    requiresAuth: false,
  },
  {
    label: 'Settings',
    description: 'Manage your account settings',
    icon: SettingsIcon,
    href: '/account/settings',
    requiresAuth: false,
  },
  {
    label: 'Logout',
    description: 'Sign out of your account',
    icon: LogOutIcon,
    action: 'logout',
    requiresAuth: true,
  },
];

export const userData = {
  name: 'Ajmal',
  loyaltyPoints: 2000,
  pointsToNextTier: 5000,
  tierName: 'FF Silver',
};
