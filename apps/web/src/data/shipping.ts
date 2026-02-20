import {
  AlertCircleIcon,
  CameraIcon,
  ClockIcon,
  CreditCardIcon,
  type IconComponent,
  MapPinIcon,
  PackageIcon,
  RefreshCcwIcon,
  TruckIcon,
} from '@ff/ui';

export interface ShippingSection {
  id: string;
  title: string;
  icon: IconComponent;
  description: string;
  details: string[];
}

export const shippingData: ShippingSection[] = [
  {
    id: 'processing',
    title: 'Order Processing',
    icon: ClockIcon,
    description: 'The time it takes to prepare your order for dispatch.',
    details: [
      '24–48 hours standard processing time',
      'Orders before 12:00 PM ship same-day',
      'Prepaid orders receive priority handling',
    ],
  },
  {
    id: 'timelines',
    title: 'Delivery Timelines',
    icon: TruckIcon,
    description: 'Transit times provided by our tier-1 courier partners.',
    details: [
      'Metros: 2–4 Business Days',
      'Non-Metros: 5–7 Business Days',
      'Remote Areas: Up to 10 Business Days',
    ],
  },
  {
    id: 'methods',
    title: 'Shipping Methods',
    icon: CreditCardIcon,
    description: 'How your payment choice affects logistics.',
    details: [
      'Prepaid: Free shipping over ₹1,999',
      'COD: ₹200 Non-refundable security deposit',
      'Express: Available for select Metro pin-codes',
    ],
  },
  {
    id: 'tracking',
    title: 'Live Tracking',
    icon: MapPinIcon,
    description: "Stay updated on your package's movement in real-time.",
    details: [
      'ID generated within 24 hours of order',
      'Links sent via Email and WhatsApp',
      'Tracking activates 12h after dispatch',
    ],
  },
  {
    id: 'exceptions',
    title: 'Delivery Exceptions',
    icon: AlertCircleIcon,
    description: 'External factors that may shift your delivery date.',
    details: [
      'Weather delays or courier strikes',
      'Peak season volume (e.g., Diwali/Black Friday)',
      'Incorrect address responsibility lies with user',
    ],
  },
  {
    id: 'rto',
    title: 'Failed Delivery (RTO)',
    icon: RefreshCcwIcon,
    description: 'What happens when a package cannot be delivered.',
    details: [
      '3 Delivery attempts before return',
      'RTO packages require new shipping fee to re-send',
      'Address corrections must be made within 12h',
    ],
  },
  {
    id: 'protection',
    title: 'Transit Protection',
    icon: CameraIcon,
    description: 'Mandatory protocols for a secure delivery experience.',
    details: [
      'Uncut 360° unboxing video required',
      'Report damages within 24h of delivery',
      'Sealed package must be shown in video',
    ],
  },
];
