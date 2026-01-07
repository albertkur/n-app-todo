import { Todo } from "../../proxies/todo/todo";


export interface TodoService
{
    getTodos(): Promise<ReadonlyArray<Todo>>;
    getTodo(id: string): Promise<Todo>;
    createTodo(title: string, description: string, assignedTo?: string): Promise<Todo>;
}