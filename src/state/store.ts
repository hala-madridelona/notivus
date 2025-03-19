import { create } from 'zustand';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Store {
  notes: Note[];
}

const useStore = create<Store>(() => ({
  notes: [],
}));

export default useStore;
