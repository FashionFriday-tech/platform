import { PaymentMethod } from '@ff/database';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const orderShippingAddressSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, 'Recipient name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  altPhoneNumber: z.string().optional().nullable(),
  building: z.string().optional().nullable(),
  street: z.string().min(1, 'Street/Area is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().min(1, 'Pincode is required'),
  landmark: z.string().optional().nullable(),
  label: z.string().optional(),
});

const createOrderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  addressId: z.string().optional(),
  shippingAddress: orderShippingAddressSchema.optional(),
});

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
