'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { Button } from '../ui/button';
import { Users } from 'lucide-react';
import { DrawerDialogDemo } from '../overlays/modal';
import { CreateGroupForm } from '../forms/create-group';

export const GroupManagement = ({ session }: { session: Session }) => {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsGroupModalOpen(true)}
        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white"
      >
        <Users className="h-4 w-4" />
        Create Group
      </Button>

      <DrawerDialogDemo
        title="Create New Group"
        description="Create a new group to collaborate with others"
        open={isGroupModalOpen}
        setOpen={setIsGroupModalOpen}
      >
        <CreateGroupForm session={session} toggleParentModal={setIsGroupModalOpen} />
      </DrawerDialogDemo>
    </>
  );
};
