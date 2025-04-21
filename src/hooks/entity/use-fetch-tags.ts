'use client';

import { fetchAllTagsWithoutGroup } from '@/server/lib/tag';
import { useQuery } from '@tanstack/react-query';

export const useFetchTags = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tags', userId],
    enabled: !!userId,
    queryFn: () => fetchAllTagsWithoutGroup({ userId }),
  });

  return {
    tags: isLoading || error ? [] : data,
    isLoading,
    error,
  };
};
