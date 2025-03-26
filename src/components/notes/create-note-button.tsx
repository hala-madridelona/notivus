'use client';

import { createNote } from '@/server/business/note';
import { Session } from '@auth/core/types';

export const CreateNewNote = async ({ session }: { session: Session }) => {
  const createNewNoteHandler = async () => {
    if (!session?.user?.id) {
      return;
    }
    try {
      await createNote({
        userId: session?.user?.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={createNewNoteHandler}
      className="outline-2 outline-blue-900 px-2 py-1 rounded-lg bg-amber-400"
    >
      Create a Note
    </button>
  );
};
