import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="mx-auto max-w-2xl px-4 py-6 rounded-t-2xl bg-card">
        <ProfileHeader />
        <ProfileTabs />
      </div>
    </main>
  );
}
