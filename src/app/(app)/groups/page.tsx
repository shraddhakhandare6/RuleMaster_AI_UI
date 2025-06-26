import { GroupsClient } from "@/components/groups/groups-client";
import { mockGroups, mockUsers } from "@/lib/data";

export default async function GroupsPage() {
  // In a real app, you'd fetch this data.
  const groups = mockGroups;
  const users = mockUsers;

  return (
    <div className="space-y-6">
      <GroupsClient initialGroups={groups} allUsers={users} />
    </div>
  );
}
