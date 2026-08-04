import { TeamManagementView } from '@/features/team';

export const metadata = {
  title: 'Team Management - Fashion Friday',
};

export default function TeamPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <TeamManagementView />
    </div>
  );
}
