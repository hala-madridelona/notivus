'use client';

import { deleteGroupSafe, fetchGroupsSafe } from '@/server/lib/group';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2, Trash2 } from 'lucide-react';
import { Session } from 'next-auth';
import { Button } from '../ui/button';

export const ListGroups = ({ session }: { session: Session }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['fetchGroups'],
    queryFn: () => fetchGroupsSafe({ userId: session?.user?.id as string }),
    enabled: !!session?.user?.id,
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroupSafe,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchGroups'],
      });
    },
  });

  const handleGroupRecord = async (groupId: string) => {
    try {
      await deleteGroupMutation.mutateAsync({ userId: session?.user?.id as string, groupId });
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  if (isLoading) {
    return <Loader2 />;
  }

  if (error) {
    return <span>Something went wrong fetching groups</span>;
  }

  return (
    <div>
      {data?.map((groupRecord) => {
        return (
          <div
            className={clsx('flex gap-2 cursor-pointer hover:bg-amber-600 hover:text-white')}
            key={`Group-${groupRecord.id}`}
          >
            <span>
              <strong>Id:</strong> {groupRecord.id}
            </span>
            <span>
              <strong>Name:</strong> {groupRecord.name}
            </span>
            <Button size="icon" onClick={() => handleGroupRecord(groupRecord.id)}>
              <Trash2 />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
