import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { PrismaModule } from './database/prisma.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { CustomersModule } from './modules/customers/customers.module';
import { FaqModule } from './modules/faq/faq.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ProductRequestsModule } from './modules/product-requests/product-requests.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UploadModule } from './modules/upload/upload.module';
import { WhatsAppReviewsModule } from './modules/whatsapp-reviews/whatsapp-reviews.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AddressesModule,
    BrandsModule,
    CollectionsModule,
    ProductsModule,
    CategoriesModule,
    UploadModule,
    ReviewsModule,
    CampaignsModule,
    WhatsAppReviewsModule,
    ProductRequestsModule,
    FeedbackModule,
    CustomersModule,
    FaqModule,
    WishlistModule,
    CartModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
