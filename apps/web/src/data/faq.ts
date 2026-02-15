export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Shipping' | 'Orders' | 'Returns' | 'Sizing' | 'Partnerships';
  href?: string;
  linkText?: string;
}

export const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Shipping',
    question: 'How long does the dispatch take?',
    answer:
      'Most drops are dispatched within 24–48 hours. Express shipping typically arrives in 3–5 business days depending on your coordinate.',
    href: '/shipping',
    linkText: 'View shipping timelines',
  },
  {
    id: '2',
    category: 'Sizing',
    question: 'How do I know the fit of a specific drop?',
    answer:
      'We use an Architectural Fit scale. Check the Fit Details section on the product page for exact measurements and model references.',
    href: '/help/size-guide',
    linkText: 'size guide',
  },
  {
    id: '3',
    category: 'Returns',
    question: 'What is the return window?',
    answer:
      'We offer a 7-day inspection period. Items must be in original Archive Condition with all security tags intact.',
    href: '/returns',
    linkText: 'Read return policy',
  },
  {
    id: '4',
    category: 'Partnerships',
    question: 'How can I sell my brand on Fashion Friday?',
    answer:
      'Apply through our Contact page under the Seller Application node. Our curation team reviews all brand blueprints within 7 days.',
    href: '/contact',
    linkText: 'Apply as a seller',
  },
  {
    id: '6',
    category: 'Orders',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer:
      'Yes. COD is available on select drops. A small confirmation fee may apply to reduce failed deliveries.',
    href: '/payment-options',
    linkText: 'View payment options',
  },
  {
    id: '9',
    category: 'Sizing',
    question: 'What if the size I ordered doesn’t fit?',
    answer: 'If eligible, you can request a size exchange within the inspection window.',
    href: '/size-guide',
    linkText: 'Check exchange eligibility',
  },
  {
    id: '10',
    category: 'Orders',
    question: 'How can I track my order?',
    answer: 'Once dispatched, tracking details are sent via SMS and email.',
    href: '/account/orders',
    linkText: 'Track my order',
  },
  {
    id: '17',
    category: 'Orders',
    question: 'Why is there a ₹200 advance for COD orders?',
    answer:
      'The ₹200 advance helps us confirm serious orders and cover logistics costs in case of refused deliveries.',
    href: '/payment-options',
    linkText: 'Why COD requires advance',
  },
  {
    id: '22',
    category: 'Shipping',
    question: 'How do I know Fashion Friday is trustworthy?',
    answer:
      'We’ve fulfilled thousands of orders across India with verified sellers and transparent policies.',
    href: '/about',
    linkText: 'Learn about Fashion Friday',
  },
  {
    id: '23',
    category: 'Returns',
    question: 'What if I receive a damaged or defective product?',
    answer: 'If an item arrives damaged, contact us within 24 hours with unboxing proof.',
    href: '/returns',
    linkText: 'Report a damaged item',
  },
  {
    id: '24',
    category: 'Sizing',
    question: "How do I ensure I'm choosing the correct size?",
    answer:
      'Standard sizing is a baseline, but anatomy is unique. Use our Fit Architect protocol: measure your foot in CM from heel to toe for the most objective result.',
    href: '/help/size-guide',
    linkText: 'Open Fit Architect',
  },
  {
    id: '25',
    category: 'Sizing',
    question: 'How do I Mesure my size manual?',
    answer:
      'Place your heel against a wall on a sheet of paper. Mark the tip of your longest toe and measure the distance in CM.',
    href: '/help/size-guide#manual-size-mesure',
    linkText: 'Mesure my foot',
  },
  {
    id: '26',
    category: 'Sizing',
    question: 'Why do sizes vary between different brands?',
    answer:
      "Manufacturers use different 'lasts' (foot molds) and materials. While our chart provides global standards, always refer to the specific brand variance notes for a precision fit.",
    href: '/help/size-guide#variance-note',
    linkText: 'Check Size Variance',
  },
];
