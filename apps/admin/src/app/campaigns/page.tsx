import { type Metadata } from 'next';

import { CampaignsFeature } from '../../features/campaigns';

export const metadata: Metadata = {
  title: 'Campaigns | Fashion Friday Admin',
  description: 'Manage storefront campaigns and hero banners',
};

export default function CampaignsPage() {
  return <CampaignsFeature />;
}
