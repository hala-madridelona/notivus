'use server';

import { auth } from '@/auth';
import { SignIn } from './sign-in-button';
import UserAvatar from './user-avatar';
import { SignOut } from './sign-out-button';
import { MobileVerificationForm } from '../forms/mobile-verification';
import { CreateNewNote } from '../notes/create-note-button';
import { ListNotes } from '../notes/list-notes';
import { Editor } from '../editor/editor';
import { CreateGroupForm } from '../forms/create-group';
import { ListGroups } from '../groups/list-groups';

export default async function User() {
  const session = await auth();

  if (!session?.user)
    return (
      <div className="flex flex-col gap-4">
        <SignIn />
        <MobileVerificationForm />
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <UserAvatar />
      <SignOut />

      <div className="flex flex-row gap-4">
        <div className="flex flex-col">
          <CreateNewNote session={session} />
          <ListNotes session={session} />
        </div>
        <Editor />
      </div>

      <div className="w-[300px]">
        <CreateGroupForm session={session} />
      </div>
      <ListGroups session={session} />
    </div>
  );
}
