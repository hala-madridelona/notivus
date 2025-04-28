'use client';

import { Session } from 'next-auth';
import Image from 'next/image';

export default function UserAvatar({ session }: { session: Session }) {
  if (!session?.user) return null;

  return (
    <div>
      {session.user.image && (
        <Image
          src={session.user.image}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
        />
      )}
    </div>
  );
}
