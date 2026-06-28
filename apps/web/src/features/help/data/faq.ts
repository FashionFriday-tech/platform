export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Shipping' | 'Orders' | 'Returns' | 'Sizing' | 'Partnerships';
  href?: string;
  linkText?: string;
}
