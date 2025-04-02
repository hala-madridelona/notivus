'use client';

import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';

import 'quill/dist/quill.bubble.css';
import { debounceMyFun } from '@/utils/client/debounce';
import useNoteStore from '@/state/store';
import { updateNote, updateNoteTimestamp } from '@/server/business/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Delta } from 'quill';

const extractTitleFromDelta = (delta: Delta) => {
  let title = '';
  delta['ops'].forEach((operation) => {
    if (operation.insert != null && typeof operation.insert === 'string') {
      const index = operation.insert.indexOf('\n', 0);
      if (index != -1) {
        title = title + operation.insert.substring(0, index);
      } else {
        title = operation.insert;
      }
    }
  });
  return title;
};

export const Editor = () => {
  const { quill, quillRef } = useQuill({
    theme: 'bubble',
  });
  const currentNote = useNoteStore((state) => state.currentNote);
  const hasUserSelecton = useNoteStore((state) => state.hasUserSelection);
  const updateUserSelection = useNoteStore((state) => state.updateUserSelection);
  const updateCurrentNoteContent = useNoteStore((state) => state.updateCurrentNoteContent);
  const updateCurrentNoteTitle = useNoteStore((state) => state.updateCurrentNoteTitle);
  const queryClient = useQueryClient();

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['fetchNotes'] });
    },
  });

  const updateNoteTimestampMutation = useMutation({
    mutationFn: updateNoteTimestamp,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['fetchNotes'] });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNoteContent = (noteId: string, content: any, successCallback?: any) => {
    updateNoteMutation.mutate(
      {
        noteId,
        field: 'content',
        value: content,
      },
      { ...(successCallback && { onSuccess: successCallback }) }
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNoteTitleUpdate = (noteId: string, title: string, successCallback?: any) => {
    updateNoteMutation.mutate(
      {
        noteId,
        field: 'title',
        value: title,
      },
      { ...(successCallback && { onSuccess: successCallback }) }
    );
  };

  const handleNoteTimestampUpdate = (noteId: string) => {
    updateNoteTimestampMutation.mutate({
      noteId,
    });
  };

  const debouncedContentUpdater = debounceMyFun(
    (noteId: string, content: string, successCallback?: () => void) => {
      if (!currentNote) {
        return;
      }
      handleNoteContent(noteId, content, successCallback);
    },
    500
  );

  const debouncedTitleUpdater = debounceMyFun(
    (noteId: string, title: string, successCallback?: () => void) => {
      if (!currentNote) {
        return;
      }
      handleNoteTitleUpdate(noteId, title, successCallback);
    },
    1000
  );

  useEffect(() => {}, [currentNote, quill]);

  // useEffect(() => {
  //   console.log('CURRENT NOTE GOT UPDATED');
  // }, [currentNote])

  useEffect(() => {
    if (!currentNote || !quill) {
      return;
    }

    if (
      currentNote?.content &&
      typeof currentNote?.content === 'object' &&
      !Array.isArray(currentNote?.content) &&
      Object.keys(currentNote?.content)
    ) {
      if (currentNote?.content?.['ops']) {
        quill?.setContents(currentNote?.content, 'silent');
      } else {
        quill?.setContents([], 'silent');
      }
    } else {
      quill?.setContents([], 'silent');
    }

    // const editorChangeHandler = (event) => {
    //     // console.log('EDITOR CHANGE EVENT WAS FIRED => ', event);
    // }

    const selectionChangeEvent = () => {
      if (!hasUserSelecton) {
        handleNoteTimestampUpdate(currentNote?.id);
        updateUserSelection(true);
      }
    };

    const textChangeEvent = () => {
      // console.log('TEXT CHANGE EVENT WAS FIRED => ', event);
      const currentContent = quill?.getContents();
      const contentInJson = JSON.parse(JSON.stringify(currentContent));

      const oldTitle = extractTitleFromDelta(currentNote?.content);
      const newTitle = extractTitleFromDelta(contentInJson);

      if (newTitle !== oldTitle) {
        debouncedTitleUpdater(currentNote?.id, newTitle, () => {
          updateCurrentNoteTitle(newTitle);
        });
      }

      debouncedContentUpdater(currentNote?.id, contentInJson, () => {
        updateCurrentNoteContent(contentInJson);
      });
    };

    // quill?.on('editor-change', editorChangeHandler);
    quill?.on('selection-change', selectionChangeEvent);
    quill?.on('text-change', textChangeEvent);

    return () => {
      // quill?.off('editor-change', editorChangeHandler);
      quill?.off('selection-change', selectionChangeEvent);
      quill?.off('text-change', textChangeEvent);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, currentNote]);

  if (!currentNote) {
    return null;
  }

  return (
    <div className="h-100 w-200 m-4 border border-zinc-400 rounded-sm">
      <div ref={quillRef}></div>
    </div>
  );
};
