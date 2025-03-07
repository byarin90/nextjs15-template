"use client"

import { useForm } from "react-hook-form"
import { useTodoStore } from "@/stores/todo-store"

interface TodoFormData {
    title: string
    description: string
}

const TodoForm = () => {
    const addTodo = useTodoStore((state) => state.addTodo)
    const todos = useTodoStore((state) => state.todos)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TodoFormData>()

    const onSubmit = (data: TodoFormData) => {
        const newTodo = {
            id: todos.length + 1,
            title: data.title,
            description: data.description,
            authorId: "Yarin Bukai", // Default author ID
            createdAt: new Date(),
            done: false,
        }
        addTodo(newTodo)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
            <div>
                <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Todo title"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground dark:bg-secondary dark:text-secondary-foreground"
                />
                {errors.title && (
                    <span className="text-red-500 text-sm">{errors.title.message}</span>
                )}
            </div>
            <div>
                <textarea
                    {...register("description", { required: "Description is required" })}
                    placeholder="Todo description"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground dark:bg-secondary dark:text-secondary-foreground"
                />
                {errors.description && (
                    <span className="text-red-500 text-sm">
                        {errors.description.message}
                    </span>
                )}
            </div>
            <button
                type="submit"
                className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors"
            >
                Add Todo
            </button>
        </form>
    )
}

export default TodoForm
