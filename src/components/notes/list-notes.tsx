'use client';

import { fetchAllNotes } from '@/server/business/note';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { Session } from '@auth/core/types';
import useNoteStore from '@/state/store';
import clsx from 'clsx';

export const ListNotes = ({ session }: { session: Session }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['fetchNotes'],
    queryFn: () => fetchAllNotes({ userId: session?.user?.id as string }),
    enabled: !!session?.user?.id,
  });
  const currentNote = useNoteStore((state) => state.currentNote);
  const updateCurrentNote = useNoteStore((state) => state.updateCurrentNote);
  const updateUserSelection = useNoteStore((state) => state.updateUserSelection);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNoteSelect = (note: any) => {
    updateCurrentNote(note);
    updateUserSelection(false);
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
              <strong>Title:</strong> {noteRecord.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};
