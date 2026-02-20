import { FileCheckIcon, type IconComponent, ShieldAlertIcon, TruckIcon, WalletIcon } from '@ff/ui';

export interface PolicySection {
  id: string;
  title: string;
  icon: IconComponent;
  description: string;
  points: string[];
}

export const returnsData: PolicySection[] = [
  {
    id: 'eligibility',
    title: 'Return Eligibility',
    icon: FileCheckIcon,
    description: 'Standard criteria for a successful return request.',
    points: [
      'Window: 48-72 hours from the delivery timestamp',
      'Condition: Unused, unwashed, with all original tags attached',
      'Exclusions: Innerwear, clearance sales, and custom orders are final sale',
    ],
  },
  {
    id: 'refund-wallet',
    title: 'Wallet-First Refunds',
    icon: WalletIcon,
    description: 'Our streamlined settlement process via Store Credits.',
    points: [
      '100% of the product value is credited to your Architect Wallet',
      'Credits never expire and can be used on any future purchase',
      'Direct bank/source refunds are not available under our protocol',
    ],
  },
  {
    id: 'cod-protocol',
    title: 'COD Fee Policy',
    icon: ShieldAlertIcon,
    description: 'Transparency regarding Cash on Delivery logistics.',
    points: [
      'The COD fee is a non-refundable service charge for courier handling',
      'This fee is paid in advance to secure the slot and prevent RTOs',
      'It is separate from the product price and is never refundable',
    ],
  },
  {
    id: 'logistics-cost',
    title: 'Shipping Responsibility',
    icon: TruckIcon,
    description: 'Clarity on who bears the transit costs.',
    points: [
      'Customer Side: Shipping costs are deducted for cancellations/RTOs',
      'Our Side: We cover all costs for manufacturing defects or wrong items',
      'Exchanges: Flat processing fee applies for size-related swaps',
    ],
  },
];
