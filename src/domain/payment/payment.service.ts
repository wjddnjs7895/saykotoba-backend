import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { GooglePaymentService } from '@/integrations/google/services/google-payment.service';
import { ApplePaymentService } from '@/integrations/apple/services/apple-payment.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly googlePaymentService: GooglePaymentService,
    private readonly applePaymentService: ApplePaymentService,
  ) {}

  async verifyPurchase(
    userId: number,
    receipt: string,
    platform: 'GOOGLE' | 'APPLE',
  ) {
    if (platform === 'GOOGLE') {
      return await this.googlePaymentService.verifyPurchase(userId, receipt);
    } else if (platform === 'APPLE') {
      return await this.applePaymentService.verifyPurchase(userId, receipt);
    }
  }
}
