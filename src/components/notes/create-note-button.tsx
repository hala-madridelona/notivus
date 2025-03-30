'use client';

import { createNote } from '@/server/business/note';
import useNoteStore from '@/state/store';
import { Session } from '@auth/core/types';
import { PlusSquare } from 'lucide-react';
import { Button } from '../ui/button';

export const CreateNewNote = ({ session }: { session: Session }) => {
  const updateCurrentNote = useNoteStore((state) => state.updateCurrentNote);
  const updateUserSelection = useNoteStore((state) => state.updateUserSelection);
  const createNewNoteHandler = async () => {
    if (!session?.user?.id) {
      return;
    }
    try {
      const newNote = await createNote({
        userId: session?.user?.id,
      });
      if (!newNote) {
        throw new Error('Note metdata not passed from db');
      }
      const { id, title, createdAt, updatedAt } = newNote;
      updateCurrentNote({
        id,
        title: title || '',
        content: {},
        createdAt,
        updatedAt,
      });
      updateUserSelection(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button className="w-fit" onClick={createNewNoteHandler}>
      <PlusSquare />
      New Note
    </Button>
  );
};
