import { auth } from '@/auth';
import { SignIn } from './sign-in-button';
import UserAvatar from './user-avatar';
import { SignOut } from './sign-out-button';

export default async function User() {
  const session = await auth();

  if (!session?.user) return <SignIn />;

  return (
    <div>
      <UserAvatar />
      <SignOut />
    </div>
  );
}
