import { CampaignsFeature } from '../../features/campaigns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaigns | Fashion Friday Admin',
  description: 'Manage storefront campaigns and hero banners',
};

export default function CampaignsPage() {
  return <CampaignsFeature />;
}
