import { type Order } from './types';

export const orders: Order[] = [
  {
    id: '#7812657',
    status: 'shipping',
    statusLabel: 'On Delivery',
    date: '28 May 2024',
    origin: 'FF House',
    destination: "Emir's House, Indonesia",
    totalPrice: 7890000,
    items: [
      {
        id: '1',
        name: 'Nike Air Max SYSTM',
        price: 1459000,
        size: '24',
        quantity: 1,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/46ce62c0-c7ea-4184-831c-c31899257e9b/W+NIKE+AIR+MAX+MOTO+2K.png',
      },
      {
        id: '2',
        name: 'Nike Air Rift',
        price: 1909000,
        size: '24',
        quantity: 1,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/128904c9-6281-4d00-8ff0-ed791031c0bd/W+NIKE+AIR+MAX+MOTO+2K.png',
      },
    ],
  },
  {
    id: '#7890981',
    status: 'shipping',
    statusLabel: 'On Delivery',
    date: '9 Jul 2024',
    origin: 'FF House',
    destination: "Darla's Home, Indonesia",
    totalPrice: 2900000,
    items: [
      {
        id: '3',
        name: 'Nike Gamma Force',
        price: 1399000,
        size: '24',
        quantity: 1,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/128904c9-6281-4d00-8ff0-ed791031c0bd/W+NIKE+AIR+MAX+MOTO+2K.png',
      },
      {
        id: '4',
        name: 'Nike Cortez',
        price: 1299000,
        size: '24',
        quantity: 1,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/46ce62c0-c7ea-4184-831c-c31899257e9b/W+NIKE+AIR+MAX+MOTO+2K.png',
      },
    ],
  },
  {
    id: '#7890332',
    status: 'shipping',
    statusLabel: 'On Delivery',
    date: '9 Jul 2024',
    origin: 'FF House',
    destination: "Darla's Home, Indonesia",
    totalPrice: 2900000,
    items: [
      {
        id: '3',
        name: 'Nike Gamma Force',
        price: 1399000,
        size: '24',
        quantity: 1,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fc86b60b-1be1-4db2-9ca0-901b1889ba45/W+NIKE+AIR+MAX+MOTO+2K.png',
      },
      {
        id: '4',
        name: 'Nike Cortez',
        price: 1299000,
        size: '24',
        quantity: 1,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/46ce62c0-c7ea-4184-831c-c31899257e9b/W+NIKE+AIR+MAX+MOTO+2K.png',
      },
    ],
  },
  {
    id: '#1234567',
    status: 'arrived',
    statusLabel: 'Delivered',
    date: '15 Jan 2024',
    origin: 'FF House',
    destination: "Emir's House, Indonesia",
    totalPrice: 1200000,
    items: [],
  },
];
