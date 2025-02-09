import { create } from 'zustand'

export interface Todo {
    id: number
    title: string
    description: string
    authorId: string
    createdAt: Date
    done: boolean
}

export interface TodosStore {
    todos: Todo[]
    addTodo: (todo: Todo) => void
    updateTodo: (id: number, todo: Todo) => void
    deleteTodo: (id: number) => void
}

const getInitialTodos = (): Todo[] => {
    if (typeof window === 'undefined') return []
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
}

export const useTodoStore = create<TodosStore>((set) => ({
    todos: getInitialTodos(),
    addTodo: (todo) => {
        set((state) => {
            const newTodos = [...state.todos, todo]
            localStorage.setItem('todos', JSON.stringify(newTodos))
            return { todos: newTodos }
        })
    },
    updateTodo: (id, todo) => {
        set((state) => {
            const newTodos = state.todos.map((t) => (t.id === id ? todo : t))
            localStorage.setItem('todos', JSON.stringify(newTodos))
            return { todos: newTodos }
        })
    },
    deleteTodo: (id) => {
        set((state) => {
            const newTodos = state.todos.filter((t) => t.id !== id)
            localStorage.setItem('todos', JSON.stringify(newTodos))
            return { todos: newTodos }
        })
    }
}))