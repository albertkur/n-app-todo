import { TodoService } from "./todo-service";
import { given } from "@nivinjoseph/n-defensive";
import { MockTodoProxy } from "../../proxies/todo/mock-todo-proxy";
import { Todo } from "../../proxies/todo/todo";


export class MockTodoService implements TodoService
{
    private readonly _todos: Array<MockTodoProxy>;
    private _counter: number;


    public constructor()
    {
        const todos = new Array<MockTodoProxy>();
        const count = 10;

        for (let i = 0; i < count; i++)
            todos.push(new MockTodoProxy("id" + i, "title" + i, "description" + i, null));

        this._todos = todos;
        this._counter = count;
    }


    public getTodos(): Promise<ReadonlyArray<Todo>>
    {
        return Promise.resolve(this._todos.where(t => !t.isDeleted));
    }

    public getTodo(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        return Promise.resolve(this._todos.find(t => t.id === id && !t.isDeleted) as Todo);
    }

    public createTodo(title: string, description: string | null, assignedTo: string | null): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        given(assignedTo, "assignedTo").ensureIsString();

        const todo = new MockTodoProxy("id" + this._counter++, title.trim(), description, assignedTo);
        this._todos.push(todo);
        return Promise.resolve(todo);
    }
}