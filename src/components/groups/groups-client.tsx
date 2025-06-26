
"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GroupCard } from "./group-card"
import { GroupEditor } from "./group-editor"
import { AddUserDialog } from "./add-user-dialog"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import type { Group, User, GroupUser } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"

type GroupsClientProps = {
  initialGroups: Group[];
  allUsers: User[];
};

export function GroupsClient({ initialGroups, allUsers }: GroupsClientProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  
  // State for group editor
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Partial<Group> | undefined>(undefined);

  // State for add user dialog
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedGroupIdForUser, setSelectedGroupIdForUser] = useState<string | null>(null);

  // State for confirmation dialogs
  const [isRemoveUserConfirmOpen, setIsRemoveUserConfirmOpen] = useState(false);
  const [isDeleteGroupConfirmOpen, setIsDeleteGroupConfirmOpen] = useState(false);

  // State for items to be deleted
  const [userToRemove, setUserToRemove] = useState<{groupId: string, userId: string} | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);


  // Group CRUD handlers
  const handleCreateNewGroup = () => {
    setSelectedGroup({});
    setIsEditorOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsEditorOpen(true);
  };
  
  const handleSaveGroup = (data: Omit<Group, 'id' | 'users'> & { id?: string }) => {
    if (data.id) {
      // Update existing group
      setGroups(groups.map(g => 
        g.id === data.id ? { ...g, ...data } : g
      ));
      toast({ title: t.groups.groupUpdated, description: t.groups.groupUpdatedDesc(data.name) });
    } else {
      // Create new group
      const newGroup: Group = {
        ...data,
        id: `group-${Date.now()}`,
        users: [],
      };
      setGroups([newGroup, ...groups]);
      toast({ title: t.groups.groupCreated, description: t.groups.groupCreatedDesc(data.name) });
    }
  };

  const openDeleteGroupConfirm = (group: Group) => {
    setGroupToDelete(group);
    setIsDeleteGroupConfirmOpen(true);
  };
  
  const handleDeleteGroup = () => {
    if (!groupToDelete) return;
    setGroups(groups.filter(g => g.id !== groupToDelete.id));
    toast({ variant: "destructive", title: t.groups.groupDeleted, description: t.groups.groupDeletedDesc(groupToDelete.name) });
    setGroupToDelete(null);
  };


  // User in Group handlers
  const handleOpenAddUserDialog = (groupId: string) => {
    setSelectedGroupIdForUser(groupId);
    setIsAddUserDialogOpen(true);
  };

  const handleAddUserToGroup = (newUser: Omit<GroupUser, 'name' | 'email'>) => {
    if (!selectedGroupIdForUser) return;

    const userToAdd = allUsers.find(u => u.id === newUser.id);
    if (!userToAdd) {
      toast({ variant: "destructive", title: "Error", description: "User not found." });
      return;
    }
    
    const groupUser: GroupUser = {
      id: userToAdd.id,
      name: userToAdd.name,
      email: userToAdd.email,
      role: newUser.role,
    };

    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === selectedGroupIdForUser
          ? { ...group, users: [...group.users, groupUser] }
          : group
      )
    );
    toast({ title: t.groups.userAdded, description: t.groups.userAddedDesc(userToAdd.name) });
  };
  
  const openRemoveUserConfirm = (groupId: string, userId: string) => {
    setUserToRemove({ groupId, userId });
    setIsRemoveUserConfirmOpen(true);
  };
  
  const handleRemoveUserFromGroup = () => {
    if (!userToRemove) return;
    const { groupId, userId } = userToRemove;

    let userName = "";
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId) {
          const user = group.users.find(u => u.id === userId);
          userName = user?.name || "The user";
          return { ...group, users: group.users.filter(u => u.id !== userId) };
        }
        return group;
      })
    );
    toast({ variant: "destructive", title: t.groups.userRemoved, description: t.groups.userRemovedDesc(userName) });
    setUserToRemove(null);
  }

  const groupForUserDialog = groups.find(g => g.id === selectedGroupIdForUser);

  return (
    <>
       <PageHeader title={t.groups.title}>
        <Button onClick={handleCreateNewGroup}>
          <Plus className="mr-2 h-4 w-4" />
          {t.groups.addGroup}
        </Button>
      </PageHeader>
      <div className="space-y-4">
        {groups.map(group => (
          <GroupCard 
            key={group.id} 
            group={group} 
            onAddUser={handleOpenAddUserDialog}
            onRemoveUser={openRemoveUserConfirm}
            onEdit={handleEditGroup}
            onDelete={openDeleteGroupConfirm}
          />
        ))}
      </div>

      {groupForUserDialog && (
        <AddUserDialog
          isOpen={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
          onSave={handleAddUserToGroup}
          allUsers={allUsers}
          groupUsers={groupForUserDialog.users}
        />
      )}
      
      <GroupEditor
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onSave={handleSaveGroup}
        group={selectedGroup}
      />

      <ConfirmationDialog
        isOpen={isRemoveUserConfirmOpen}
        onOpenChange={setIsRemoveUserConfirmOpen}
        onConfirm={handleRemoveUserFromGroup}
        title={t.shared.areYouSure}
        description={t.groups.removeUserConfirmation}
      />

      <ConfirmationDialog
        isOpen={isDeleteGroupConfirmOpen}
        onOpenChange={setIsDeleteGroupConfirmOpen}
        onConfirm={handleDeleteGroup}
        title={t.shared.areYouSure}
        description={t.groups.deleteGroupConfirmation(groupToDelete?.name || '')}
      />
    </>
  );
}
