'use client';

import { fetchAllNotes, updateNote } from '@/server/business/note';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { Session } from '@auth/core/types';

export const ListNotes = ({ session }: { session: Session }) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ['fetchNotes'],
    queryFn: () => fetchAllNotes({ userId: session?.user?.id as string }),
    enabled: !!session?.user?.id,
  });

  const mutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['fetchNotes'] });
    },
  });

  const handleUpdate = (noteId: string) => {
    mutation.mutate({
      noteId,
      field: 'content',
      value: Math.random().toString(36).substr(2, 10),
    });
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
          <div className="flex gap-2" key={`Note-${noteRecord.id}`}>
            <span>
              <strong>Id:</strong> {noteRecord.id}
            </span>
            <span>
              <strong>Title:</strong> {noteRecord.title}
            </span>
            <span>
              <strong>Content:</strong>
              {noteRecord.content}
            </span>
            <button onClick={() => handleUpdate(noteRecord.id)}>Update Note</button>
          </div>
        );
      })}
    </div>
  );
};
