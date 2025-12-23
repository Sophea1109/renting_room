import UserManagement from '@/components/UserManagement';

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900 text-black">Users</h2>
      <div>
        <UserManagement />
      </div>
    </div>
  );
}
