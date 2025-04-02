'use client';

import { deleteNote, fetchAllNotes } from '@/server/business/note';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import { Session } from '@auth/core/types';
import useNoteStore from '@/state/store';
import clsx from 'clsx';
import { Button } from '../ui/button';

export const ListNotes = ({ session }: { session: Session }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['fetchNotes'],
    queryFn: () => fetchAllNotes({ userId: session?.user?.id as string }),
    enabled: !!session?.user?.id,
  });
  const queryClient = useQueryClient();

  const currentNote = useNoteStore((state) => state.currentNote);
  const updateCurrentNote = useNoteStore((state) => state.updateCurrentNote);
  const updateUserSelection = useNoteStore((state) => state.updateUserSelection);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNoteSelect = (note: any) => {
    updateCurrentNote(note);
    updateUserSelection(false);
  };

  const handleNoteDelete = async (noteId: string) => {
    await deleteNote({
      noteId,
      userId: session.user?.id as string,
    });
    queryClient.invalidateQueries({ queryKey: ['fetchNotes'] });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <span>Something is wrong</span>;
  }

  return (
    <div>
      {data?.map((noteRecord) => {
        return (
          <div
            onClick={() => handleNoteSelect(noteRecord)}
            className={clsx(
              {
                'bg-amber-600': noteRecord.id === currentNote?.id,
              },
              'flex gap-2 cursor-pointer hover:bg-amber-600 hover:text-white'
            )}
            key={`Note-${noteRecord.id}`}
          >
            <span>
              <strong>Id:</strong> {noteRecord.id}
            </span>
            <span>
              <strong>Title:</strong>{' '}
              {noteRecord.id === currentNote?.id ? currentNote?.title : noteRecord.title}
            </span>
            <Button size="icon" onClick={() => handleNoteDelete(noteRecord.id)}>
              <Trash2 />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
