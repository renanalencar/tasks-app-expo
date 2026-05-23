import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Dispatch, SetStateAction } from 'react';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from '../utils/handle-api';


function makeDispatch<T>(
  get: () => T,
  setter: (value: T) => void,
): Dispatch<SetStateAction<T>> {
  return (action: SetStateAction<T>) => {
    if (typeof action === 'function') {
      setter((action as (prev: T) => T)(get()));
    } else {
      setter(action);
    }
  };
}

interface TaskState {
  tasks: TaskItem[];
  loading: boolean;
  fetchTasks: () => void;
  addTask: (text: string, completed: boolean, dueDate: string | null, onSuccess: () => void) => void;
  updateTask: (id: string, text: string, completed: boolean, dueDate: string | null, onSuccess: () => void) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,

      fetchTasks: () => {
        set({ loading: true });
        const setTasks   = makeDispatch<TaskItem[]>(() => get().tasks,   (tasks)   => set({ tasks }));
        const setLoading = makeDispatch<boolean>   (() => get().loading, (loading) => set({ loading }));
        getAllTasks(setTasks, setLoading);
      },

      addTask: (text, completed, dueDate, onSuccess) => {
        const setTasks = makeDispatch<TaskItem[]>(() => get().tasks, (tasks) => set({ tasks }));
        addTask(text, completed, dueDate, setTasks, onSuccess);
      },

      updateTask: (id, text, completed, dueDate, onSuccess) => {
        const setTasks = makeDispatch<TaskItem[]>(() => get().tasks, (tasks) => set({ tasks }));
        updateTask(id, text, completed, dueDate, setTasks, onSuccess);
      },

      deleteTask: (id) => {
        const setTasks = makeDispatch<TaskItem[]>(() => get().tasks, (tasks) => set({ tasks }));
        deleteTask(id, setTasks);
      },

      deleteAllTasks: () => {
        set({ tasks: [] });
      },
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);