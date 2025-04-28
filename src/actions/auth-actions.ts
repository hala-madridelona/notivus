'use server';

import { signIn, signOut } from '@/auth';

export async function signOutAction() {
  await signOut();
}

export async function signInWithGoogleAction() {
  await signIn('google');
}

export async function signInWithGithubAction() {
  await signIn('github');
}
