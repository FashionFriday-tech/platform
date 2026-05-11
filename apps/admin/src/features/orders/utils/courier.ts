export type CourierService = 'Delhivery' | 'DTDC' | 'Blue Dart' | 'India Post' | 'Amazon Shipping';

export const COURIER_SERVICES: CourierService[] = [
  'Delhivery',
  'DTDC',
  'Blue Dart',
  'India Post',
  'Amazon Shipping',
];

export function getTrackingUrl(
  courier: string | undefined,
  trackingId: string | undefined,
): string {
  if (!trackingId) {
    return '#';
  }

  // Routing all requests through a universal aggregator (ParcelsApp).
  // It automatically detects the courier (Delhivery, DTDC, BlueDart, IndiaPost, Amazon)
  // and fetches the real-time exact results directly from their internal APIs.
  return `https://parcelsapp.com/en/tracking/${trackingId}`;
}
