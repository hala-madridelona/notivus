'use client';

import { createNote, updateNote } from '@/server/lib/note';
import useNoteStore from '@/state/store';
import { Session } from '@auth/core/types';
import { PlusSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const CreateNewNote = ({ session }: { session: Session }) => {
  const updateCurrentNote = useNoteStore((state) => state.updateCurrentNote);
  const updateUserSelection = useNoteStore((state) => state.updateUserSelection);
  const queryClient = useQueryClient();
  const createNoteMutataion = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchNotes'] });
    },
  });
  const createNewNoteHandler = async () => {
    if (!session?.user?.id) {
      return;
    }
    try {
      const newNote = await createNoteMutataion.mutateAsync({
        userId: session?.user?.id,
      });

      if (!newNote) {
        throw new Error('Note metdata not passed from db');
      }

      const content = {
        ops: [
          {
            insert: 'New Note',
            attributes: { bold: true, size: 'large' },
          },
          {
            insert: '\n\n',
          },
        ],
      };

      await updateNote({
        noteId: newNote?.id,
        field: 'content',
        value: JSON.parse(JSON.stringify(content)),
      });

      const { id, title, createdAt, updatedAt } = newNote;
      updateCurrentNote({
        id,
        title: title || '',
        content,
        createdAt,
        updatedAt,
      });
      updateUserSelection(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white"
      onClick={createNewNoteHandler}
    >
      <PlusSquare className="h-4 w-4" />
      New Note
    </Button>
  );
};
