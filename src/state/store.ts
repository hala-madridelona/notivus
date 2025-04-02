/* eslint-disable */
// @ts-nocheck

import { create } from 'zustand';

interface Note {
  id: string;
  title: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

interface Store {
  currentNote: Note | null;
  updateCurrentNote: (notePayload: Note) => any;
  updateCurrentNoteContent: (noteContent: any) => any;
  updateCurrentNoteTitle: (noteTitle: any) => any;
  hasUserSelection: boolean;
  updateUserSelection: (nextState: boolean) => any;
}

const useNoteStore = create<Store>((set) => ({
  currentNote: null,
  updateCurrentNote: (notePayload: Note) =>
    set((state) => ({
      ...state,
      currentNote: notePayload,
    })),
  updateCurrentNoteContent: (noteContent: any) =>
    set((state) => {
      state['currentNote']['content'] = noteContent;
      return {
        ...state,
      };
    }),
  updateCurrentNoteTitle: (noteTitle: any) =>
    set((state) => {
      state['currentNote']['title'] = noteTitle;
      return {
        ...state,
      };
    }),
  hasUserSelection: false,
  updateUserSelection: (flag: boolean) =>
    set((state) => ({
      ...state,
      hasUserSelection: flag,
    })),
}));

export default useNoteStore;
