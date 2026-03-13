/* eslint-disable */
// @ts-nocheck

import { NoteModel } from '@/server/database/models/notes';
import { create } from 'zustand';

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

export interface Note extends Omit<NoteModel, 'status' | 'userId' | 'content'> {
  content: any;
}

interface Store {
  notes: Record<string, Note>;
  updateNotes: (payload: Record<string, Note>) => any;
  addNewNote: (payload: Note) => any;
  currentNote: Note | null;
  currentNoteId: string | null;
  groups: Group[];
  updateGroups: (groups: Group[]) => any;
  updateCurrentNoteId: (noteId: string) => any;
  updateCurrentNoteContent: (noteContent: any) => any;
  updateCurrentNoteTitle: (noteTitle: any) => any;
  hasUserSelection: boolean;
  updateUserSelection: (nextState: boolean) => any;
}

const useNoteStore = create<Store>((set) => ({
  notes: null,
  currentNote: null,
  currentNoteId: null,
  groups: [],
  updateNotes: (newState: Record<string, Note>) =>
    set((state) => ({
      ...state,
      notes: newState,
    })),
  addNewNote: (newNote: Note) =>
    set((state) => ({
      ...state,
      notes: {
        ...state.notes,
        [newNote.id]: newNote,
      },
    })),
  updateGroups: (groups: Group[]) =>
    set((state) => ({
      ...state,
      groups: groups,
    })),
  updateCurrentNoteId: (currentNoteId: string) =>
    set((state) => ({
      ...state,
      currentNoteId,
      currentNote: state.notes?.[currentNoteId],
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
