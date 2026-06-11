import React from 'react';

import { ActivityLogView } from '../../features/activity';

export const metadata = {
  title: 'Activity Log | Fashion Friday',
};

export default function ActivityPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <ActivityLogView />
    </div>
  );
}
