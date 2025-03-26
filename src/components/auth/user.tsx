'use server';

import { auth } from '@/auth';
import { SignIn } from './sign-in-button';
import UserAvatar from './user-avatar';
import { SignOut } from './sign-out-button';
import { MobileVerificationForm } from '../forms/mobile-verification';
import { CreateNewNote } from '../notes/create-note-button';
import { ListNotes } from '../notes/list-notes';

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
    <div>
      <UserAvatar />
      <SignOut />
      <CreateNewNote session={session} />
      <ListNotes session={session} />
    </div>
  );
}
