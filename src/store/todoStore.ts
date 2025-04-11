import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

export const useTodoStore = create<TodoStore>()(
  devtools((set) => ({
    todos: [],
    fetchTodos: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5");
      set({ todos: res.data });
    },
    addTodo: (title) =>
      set((state) => ({
        todos: [
          ...state.todos,
          { id: Date.now(), title, completed: false },
        ],
      })),
    toggleTodo: (id) =>
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      })),
    deleteTodo: (id) =>
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      })),
  }))
)