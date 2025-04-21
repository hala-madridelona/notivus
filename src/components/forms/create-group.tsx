'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Session } from 'next-auth';
import { createGroupSafe } from '@/server/lib/group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useFetchTags } from '@/hooks/entity/use-fetch-tags';
import { createOrAddTagForGroup } from '@/server/lib/tag';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(0).max(200),
  tagName: z.string().min(2).max(50),
});

export const CreateGroupForm = ({ session }: { session: Session }) => {
  const userId = session?.user?.id as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'New Group',
      description: '',
    },
  });

  const { tags: existingTags } = useFetchTags(session?.user?.id as string);
  console.log('ET => ', existingTags);
  const queryClient = useQueryClient();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const group = await createGroupSafe({
        userId,
        name: values.name,
        description: values.description,
      });
      await createOrAddTagForGroup({
        userId,
        groupId: group.id,
        name: values.tagName,
      });
      queryClient.invalidateQueries({
        queryKey: ['fetchGroups'],
      });
    } catch (error) {
      console.error('SWW => ', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Give your group a nice name!" {...field} />
              </FormControl>
              <FormDescription>
                This is your group name and will show up on your dashboard
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Textarea placeholder="Add a description!" {...field} />
              </FormControl>
              <FormDescription>What is this group for?</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Add a new tag" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Create Group</Button>
      </form>
    </Form>
  );
};
