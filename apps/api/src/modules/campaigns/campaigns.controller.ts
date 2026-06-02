import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CampaignsService } from './campaigns.service';

@Controller()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // Public endpoint for storefront
  @Get('campaigns')
  async getActiveCampaigns() {
    return this.campaignsService.getActiveCampaigns();
  }

  // Admin endpoint: List all campaigns
  @Get('admin/campaigns')
  async getAllCampaigns() {
    return this.campaignsService.getAllCampaigns();
  }

  // Admin endpoint: Create campaign
  @Post('admin/campaigns')
  async createCampaign(
    @Body()
    body: {
      title: string;
      mediaUrl: string;
      mediaType?: string;
      linkUrl: string;
      placement: string;
      isActive?: boolean;
    },
  ) {
    return this.campaignsService.createCampaign(body);
  }

  // Admin endpoint: Update campaign
  @Put('admin/campaigns/:id')
  async updateCampaign(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      mediaUrl?: string;
      mediaType?: string;
      linkUrl?: string;
      placement?: string;
      isActive?: boolean;
    },
  ) {
    return this.campaignsService.updateCampaign(id, body);
  }

  // Admin endpoint: Delete campaign
  @Delete('admin/campaigns/:id')
  async deleteCampaign(@Param('id') id: string) {
    return this.campaignsService.deleteCampaign(id);
  }
}
