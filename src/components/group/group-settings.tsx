'use client';

import { createTag, fetchTagsForAGroup } from '@/server/lib/tag';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Session } from 'next-auth';

interface Group {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string | null;
}

interface GroupSettingsProps {
  group: Group | null;
  session: Session;
}

export const GroupSettings = ({ group, session }: GroupSettingsProps) => {
  const queryClient = useQueryClient();
  const { data: tags, isLoading } = useQuery({
    queryKey: ['fetchTagsForAGroup'],
    queryFn: () =>
      fetchTagsForAGroup({
        groupId: group?.id as string,
      }),
    enabled: !!group?.id && !!session.user?.id,
  });

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchTagsForAGroup'] });
    },
  });

  const [newTagName, setNewTagName] = useState('');
  const [isNewTagInputOpen, setIsNewTagInputOpen] = useState(false);

  const handleNewTagSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await createTagMutation.mutateAsync({
        name: newTagName,
        groupId: group?.id as string,
        userId: session.user?.id as string,
      });
      setIsNewTagInputOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Description</h3>
        <p className="text-sm text-gray-700 mt-1">
          {group?.description || 'No description provided'}
        </p>
      </div>
      <div>
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">Tags</h3>

          {isNewTagInputOpen ? (
            <span
              className="self-center rounded-lg p-0.5 bg-red-800 text-white cursor-pointer"
              onClick={() => {
                setNewTagName('');
                setIsNewTagInputOpen(false);
              }}
            >
              <X className="w-4 h-4" />
            </span>
          ) : (
            <span
              className="self-center rounded-lg p-0.5 bg-secondary text-white cursor-pointer"
              onClick={() => {
                setNewTagName('');
                setIsNewTagInputOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
            </span>
          )}
        </div>

        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}

        <div className="mt-2 flex flex-wrap gap-2">
          {isNewTagInputOpen && (
            <Input
              type="text"
              className="text-black rounded-sm w-full"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={handleNewTagSubmit}
            />
          )}
          {!isLoading &&
            tags &&
            tags.length > 0 &&
            tags?.map((tag) => (
              <span className="bg-secondary text-white p-1.5 rounded-lg" key={tag.id}>
                {tag.name}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};
