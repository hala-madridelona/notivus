'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '@/server/lib/group';
import { fetchNotesInGroup } from '@/server/lib/note-group-link';
import clsx from 'clsx';
import { DrawerDialogDemo } from '../overlays/modal';
import { GroupSettings } from './group-settings';
import useNoteStore from '@/state/store';

interface Group {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string | null;
  noteCount: number;
}

export const ListGroups = ({ session }: { session: Session }) => {
  const updateGroups = useNoteStore((state) => state.updateGroups);
  const groups = useNoteStore((state) => state.groups);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const {
    data: groupsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fetchGroups'],
    queryFn: () => fetchGroups({ userId: session?.user?.id as string }),
    enabled: !!session?.user?.id,
  });

  const { data: groupNotes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['fetchNotesInGroup', expandedGroupId],
    queryFn: () => fetchNotesInGroup({ groupId: expandedGroupId as string }),
    enabled: !!expandedGroupId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  useEffect(() => {
    if (!groupsData || groupsData.length === 0) {
      return;
    }
    updateGroups(groupsData as Group[]);
  }, [groupsData, updateGroups]);

  if (isLoading) {
    return <div className="p-4">Loading groups...</div>;
  }

  return (
    <div className="space-y-2">
      {groups?.map((group: Group) => {
        const isExpanded = expandedGroupId === group.id;
        return (
          <div key={group.id} className="border rounded-lg overflow-hidden">
            <div
              className={clsx(
                'flex items-center justify-between p-3 cursor-pointer',
                'hover:bg-cyan-50 transition-colors duration-200'
              )}
              onClick={() => toggleGroup(group.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-row gap-2">
                  <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
                  <span className="text-xs bg-secondary text-white rounded-full px-2 pt-0.5">
                    {group.noteCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Created {group.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <button
                  className="p-1 hover:bg-cyan-100 rounded-full transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroup(group);
                    setIsGroupSettingsOpen(true);
                  }}
                >
                  <Settings className="h-4 w-4 text-cyan-600" />
                </button>
                <button
                  className="p-1 hover:bg-cyan-100 rounded-full transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(group.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-cyan-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-cyan-600" />
                  )}
                </button>
              </div>
            </div>
            {isExpanded && (
              <div className="p-3 bg-cyan-50 border-t transition-all duration-500 ease-in-out transform origin-top">
                {isLoadingNotes ? (
                  <div className="flex items-center space-x-2 animate-pulse">
                    <div
                      className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                    <span className="text-sm text-gray-500">Loading notes...</span>
                  </div>
                ) : (
                  <div className="space-y-2 animate-[fadeIn_1s_ease-in-out]">
                    {groupNotes?.map((note) => (
                      <div
                        key={note.noteId}
                        className="cursor-pointer text-sm text-gray-700 transform transition-all duration-300 hover:translate-x-1 hover:text-cyan-600"
                      >
                        {note.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {error && <div className="p-4 text-red-500">Error loading groups</div>}
      <DrawerDialogDemo
        title={`Manage ${selectedGroup?.name}`}
        description="Organise notes in this group via tags"
        open={isGroupSettingsOpen}
        setOpen={setIsGroupSettingsOpen}
      >
        <GroupSettings group={selectedGroup} session={session} />
      </DrawerDialogDemo>
    </div>
  );
};
