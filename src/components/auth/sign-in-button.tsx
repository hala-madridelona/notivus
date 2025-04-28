'use client';

import { Button } from '../ui/button';
import { signInWithGoogleAction, signInWithGithubAction } from '@/actions/auth-actions';
import { Github } from 'lucide-react';
import Image from 'next/image';

export function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-cyan-500 to-cyan-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Image
            src="/notivus-logo.svg"
            width={180}
            height={60}
            alt="Notivus Logo"
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Welcome</h1>
          <p className="mt-2 text-gray-600 font-body">Sign in to continue to your account</p>
        </div>

        <div className="space-y-4">
          <form action={signInWithGoogleAction} className="w-full">
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-6 border-2 hover:bg-gray-50 font-body cursor-pointer"
            >
              <Image src="/google-g-logo.svg" width={24} height={24} alt="Google G logo" priority />
              <span>Sign in with Google</span>
            </Button>
          </form>

          <form action={signInWithGithubAction} className="w-full">
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-6 border-2 hover:bg-gray-50 font-body cursor-pointer"
            >
              <Github className="h-5 w-5" />
              <span>Sign in with GitHub</span>
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8 font-body">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
