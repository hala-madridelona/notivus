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
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(0).max(200),
});

export const CreateGroupForm = ({
  session,
  toggleParentModal,
}: {
  session: Session;
  toggleParentModal: (open: boolean) => void;
}) => {
  const userId = session?.user?.id as string;
  const queryClient = useQueryClient();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'New Group',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsActionLoading(true);
      await createGroupSafe({
        userId,
        name: values.name,
        description: values.description,
      });
      queryClient.invalidateQueries({ queryKey: ['fetchGroups'] });
      toggleParentModal(false);
    } catch (error) {
      console.error('SWW => ', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cyan-600">Group Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Give your group a nice name!"
                  className="focus:ring-cyan-500 focus:border-cyan-500 w-full"
                  {...field}
                />
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
              <FormLabel className="text-cyan-600">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description!"
                  className="focus:ring-cyan-500 focus:border-cyan-500"
                  {...field}
                />
              </FormControl>
              <FormDescription>What is this group for?</FormDescription>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
            disabled={isActionLoading}
          >
            Create Group
          </Button>
        </div>
      </form>
    </Form>
  );
};
