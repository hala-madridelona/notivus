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

interface Store {
  currentNote: Note | null;
  groups: Group[];
  updateGroups: (groups: Group[]) => any;
  updateCurrentNote: (notePayload: Note) => any;
  updateCurrentNoteContent: (noteContent: any) => any;
  updateCurrentNoteTitle: (noteTitle: any) => any;
  hasUserSelection: boolean;
  updateUserSelection: (nextState: boolean) => any;
}

const useNoteStore = create<Store>((set) => ({
  currentNote: null,
  groups: [],
  updateGroups: (groups: Group[]) =>
    set((state) => ({
      ...state,
      groups: groups,
    })),
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
