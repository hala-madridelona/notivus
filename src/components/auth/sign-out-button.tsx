'use client';

import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { signOutAction } from '@/actions/auth-actions';
import clsx from 'clsx';

interface SignOutProps {
  className?: string;
  isIconOnly?: boolean;
}

export function SignOut({ className, isIconOnly }: SignOutProps = {}) {
  return (
    <Button
      onClick={() => signOutAction()}
      variant="ghost"
      size={isIconOnly ? 'icon' : 'default'}
      className={clsx(
        `${isIconOnly ? 'w-full aspect-square' : 'w-full'} hover:bg-cyan-50 hover:text-cyan-600 mb-2 cursor-pointer`,
        className
      )}
    >
      <LogOut className={`h-5 w-5 ${!isIconOnly && 'mr-2'}`} />
      {!isIconOnly && 'Sign Out'}
    </Button>
  );
}
