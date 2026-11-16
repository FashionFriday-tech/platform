import { OrderStatus, PaymentMethod, PaymentStatus } from '@ff/database';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const orderItemUpdateSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  image: z.string().optional().default(''),
  size: z.string().optional().default(''),
  color: z.string().optional().default(''),
  price: z.number().nonnegative('Price must be greater than or equal to 0'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  sellerId: z.string().optional().nullable(),
});

export const shippingAddressUpdateSchema = z.object({
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  altPhoneNumber: z.string().optional().nullable(),
  street: z.string().optional(),
  building: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  city: z.string().optional(),
  district: z.string().optional().nullable(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export const customerUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  altPhone: z.string().optional().nullable(),
});

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  totalAmount: z.number().optional(),
  discountAmount: z.number().optional(),
  shippingFees: z.number().optional(),
  finalAmount: z.number().optional(),
  trackingNumber: z.string().optional().nullable(),
  courierPartner: z.string().optional().nullable(),
  sellerId: z.string().optional().nullable(),
  shippingAddress: shippingAddressUpdateSchema.passthrough().optional(),
  customer: customerUpdateSchema.optional(),
  items: z.array(orderItemUpdateSchema).optional(),
});

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
