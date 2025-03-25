import { auth } from '@/auth';
import { SignIn } from './sign-in-button';
import UserAvatar from './user-avatar';
import { SignOut } from './sign-out-button';
import { MobileVerificationForm } from '../forms/mobile-verification';

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
    </div>
  );
}
