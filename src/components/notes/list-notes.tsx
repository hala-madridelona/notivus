'use client';

import { deleteNote, fetchAllNotes } from '@/server/lib/note';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import { Session } from '@auth/core/types';
import useNoteStore, { Note } from '@/state/store';
import clsx from 'clsx';
import { Button } from '../ui/button';
import { useEffect, useRef } from 'react';

export const ListNotes = ({ session }: { session: Session }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['fetchNotes'],
    queryFn: () => fetchAllNotes({ userId: session?.user?.id as string }),
    enabled: !!session?.user?.id,
  });
  const queryClient = useQueryClient();

  const updateNotes = useNoteStore((state) => state.updateNotes);
  const currentNote = useNoteStore((state) => state.currentNote);
  const updateCurrentNoteId = useNoteStore((state) => state.updateCurrentNoteId);
  const updateUserSelection = useNoteStore((state) => state.updateUserSelection);
  const currentNoteRef = useRef(currentNote);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNoteSelect = (note: any) => {
    updateCurrentNoteId(note.id);
    updateUserSelection(false);
    history.pushState(null, '', `#${note.id}`);
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    // Transform notes array into record
    const noteMap = data.reduce((acc: Record<string, Note>, current: Note) => {
      if (!acc[current.id]) {
        acc[current.id] = current;
      } else {
        acc[current.id] = current;
      }
      return acc;
    }, {});

    updateNotes(noteMap);
  }, [data, updateNotes]);

  useEffect(() => {
    currentNoteRef.current = currentNote;
  }, [currentNote]);

  // Url Hash Handler to select current note
  useEffect(() => {
    if (!data) return;

    const handler = () => {
      const noteId = window.location.hash.slice(1);
      if (!noteId) return;

      const note = data.find((item) => item.id === noteId);
      if (!note) {
        history.replaceState(null, '', window.location.href.split('#')[0]);
        return;
      }

      if (currentNoteRef.current?.id === note.id) return;

      updateCurrentNoteId(note?.id);
      updateUserSelection(false);
    };

    handler();

    window.addEventListener('hashchange', handler);

    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }, [data, updateCurrentNoteId, updateUserSelection]);

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
    <div className="space-y-2">
      {data?.map((noteRecord) => {
        return (
          <div
            onClick={() => handleNoteSelect(noteRecord)}
            className={clsx(
              {
                'bg-cyan-50 border-cyan-500': noteRecord.id === currentNote?.id,
              },
              'flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors duration-200'
            )}
            key={`Note-${noteRecord.id}`}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {noteRecord.id === currentNote?.id ? currentNote?.title : noteRecord.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {new Date(noteRecord.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-cyan-50 hover:text-cyan-600"
              onClick={(e) => {
                e.stopPropagation();
                handleNoteDelete(noteRecord.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
