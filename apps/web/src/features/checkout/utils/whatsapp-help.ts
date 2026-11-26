import { type CartItem } from '@/features/cart';

export type CheckoutStep = 'cart' | 'review' | 'payment';

const DEFAULT_WHATSAPP_SUPPORT_NUMBER = '917558969093';

export function getWhatsAppSupportNumber(): string {
  const configured = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER;
  if (!configured) {
    return DEFAULT_WHATSAPP_SUPPORT_NUMBER;
  }
  const digits = configured.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits || DEFAULT_WHATSAPP_SUPPORT_NUMBER;
}

export interface BuildCheckoutWhatsAppUrlParams {
  step: CheckoutStep;
  items?: CartItem[];
  totalAmount?: number;
  paymentMethod?: 'prepay' | 'cod';
  errorMessage?: string | null;
}

const STEP_LABELS: Record<CheckoutStep, string> = {
  cart: 'Shopping Bag',
  review: 'Order Review & Address',
  payment: 'Payment',
};

/**
 * Builds a pre-filled wa.me link with non-sensitive checkout context
 * (step, item titles/sizes, total, and optional payment error) so support can help quickly.
 */
export function buildCheckoutWhatsAppUrl({
  step,
  items = [],
  totalAmount,
  paymentMethod,
  errorMessage,
}: BuildCheckoutWhatsAppUrlParams): string {
  const supportNumber = getWhatsAppSupportNumber();

  const itemSummary = items
    .slice(0, 3)
    .map((item) => {
      const name = item.product?.name || 'Item';
      const size = item.size ? ` (Size: ${item.size})` : '';
      const qty = item.quantity && item.quantity > 1 ? ` x${item.quantity}` : '';
      return `${name}${size}${qty}`;
    })
    .join(', ');

  const extraCount = items.length > 3 ? ` +${items.length - 3} more` : '';

  const lines: string[] = [
    `Hi Fashion Friday Team, I need help during checkout (${STEP_LABELS[step]}).`,
  ];

  if (itemSummary) {
    lines.push(`Items: ${itemSummary}${extraCount}`);
  }

  if (typeof totalAmount === 'number' && totalAmount > 0) {
    lines.push(`Order Total: ₹${totalAmount.toLocaleString('en-IN')}`);
  }

  if (step === 'payment' && paymentMethod) {
    lines.push(
      `Payment Option: ${paymentMethod === 'cod' ? 'Cash on Delivery (₹200 Advance)' : 'UPI / Online Payment'}`,
    );
  }

  if (errorMessage) {
    lines.push(`Issue faced: ${errorMessage}`);
  }

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${supportNumber}?text=${encoded}`;
}
