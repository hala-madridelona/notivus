'use server';

import { auth } from '@/auth';
import { SignIn } from './sign-in-button';
import { CreateNewNote } from '../notes/create-note-button';
import { ListNotes } from '../notes/list-notes';
import { Editor } from '../editor/editor';
import { GroupManagement } from '../group/group-management';
import { ListGroups } from '../group/list-groups';
import { UserProfile } from '../profile/user-profile';
import Image from 'next/image';

export default async function User() {
  const session = await auth();

  if (!session?.user)
    return (
      <div className="flex flex-col">
        <SignIn />
      </div>
    );

  return (
    <div className="flex h-screen">
      <UserProfile session={session} />

      <div className="flex flex-col flex-1 h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <Image src="/notivus-logo.svg" width={120} height={40} alt="Notivus Logo" priority />
          </div>
          <div className="flex gap-2">
            <CreateNewNote session={session} />
            <GroupManagement session={session} />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            <div className="w-64 border-r p-4 overflow-y-auto">
              <ListNotes session={session} />
            </div>
            <div className="flex-1 p-4">
              <Editor />
            </div>
            <div className="w-80 border-l p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-600 font-heading">My Groups</h2>
              </div>
              <ListGroups session={session} />
            </div>
          </div>
        </div>
      </div>
      <ListGroups session={session} />
    </div>
  );
}
