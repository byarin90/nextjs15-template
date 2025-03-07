"use client"

import { useTodoStore } from "@/stores/todo-store"
import TodoForm from "./TodoForm"

const Todos = () => {
    const todos = useTodoStore((state) => state.todos)
    const deleteTodo = useTodoStore((state) => state.deleteTodo)
    const updateTodo = useTodoStore((state) => state.updateTodo)

    const toggleTodo = (todo: typeof todos[0]) => {
        updateTodo(todo.id, { ...todo, done: !todo.done })
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-foreground">My Todos</h1>
            <TodoForm />
            <div className="space-y-4">
                {todos.map((todo) => (
                    <div 
                        className={`p-4 rounded shadow-lg border transition-colors ${
                            todo.done 
                                ? 'bg-muted border-muted dark:bg-muted dark:border-muted' 
                                : 'bg-background border-border dark:bg-background dark:border-border'
                        }`} 
                        key={todo.id}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={todo.done}
                                    onChange={() => toggleTodo(todo)}
                                    className="h-5 w-5 rounded border-gray-300"
                                />
                                <div>
                                    <h2 className={`text-lg font-semibold ${
                                        todo.done ? 'line-through text-muted-foreground' : 'text-foreground'
                                    }`}>
                                        {todo.title}
                                    </h2>
                                    <p className={`text-sm ${
                                        todo.done ? 'text-muted-foreground' : 'text-foreground'
                                    }`}>
                                        {todo.description}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-destructive hover:text-destructive/90 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Todos