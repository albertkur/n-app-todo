import { ComponentViewModel, template, element, bind, NavigationService, DialogService } from "@nivinjoseph/n-app";
import "./todo-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { Routes } from "../../pages/routes";
import { Todo } from "../../../sdk/proxies/todo/todo";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { User } from "../../../sdk/proxies/user/user";
import { ErrorMessage } from "../../models/error-message";

@template(require("./todo-view.html"))
@element("todo") // Name of the element. This is what you put as the html tag inside other page/component's template
@bind({ "todo": "object" })  // The name of the properties that this component take (binds) using v-bind. example: `v-bind:value="todo"` 
@inject("NavigationService", "UserService", "DialogService") // dependency
export class TodoViewModel extends ComponentViewModel
{
    private readonly _navigationService: NavigationService;
    private readonly _userService: UserService;
    private readonly _dialogService: DialogService;

    private _users: Array<User>;


    public get todoValue(): Todo { return this.getBound<Todo>("todo"); } // getting the bound value in the VM.
    public get users(): Array<User> { return this._users; }

    // public get assignedTo(): string | null { return this._assignedTo; }

    public constructor(navigationService: NavigationService, userService: UserService, dialogService: DialogService)
    {
        super();

        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        given(userService, "userService").ensureHasValue().ensureIsObject();
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();

        this._navigationService = navigationService;
        this._userService = userService;
        this._dialogService = dialogService;

        this._users = [];
    }


    public async completeTodo(): Promise<void> // public function can be accessed from the template and can be bound to buttons
    {
        try
        {
            await this.todoValue.complete();
        }
        catch (e)
        {
            console.log(e);
        }
    }

    public editTodo(): void
    {
        this._navigationService.navigate(Routes.manageTodo, { id: this.todoValue.id }); // navigating to a different page and, passing a path param to the route. 
    }

    public async deleteTodo(): Promise<void>
    {
        try
        {
            await this.todoValue.delete();
        }
        catch (e)
        {
            console.log(e);
        }
    }

    public async handleAssignedTo(event: { target: { value: any; }; }): Promise<void>
    {
        try
        {
            if (event.target.value == "unAssigns")
            {
                await this.todoValue.unAssigns();
            }
            else
            {
                await this.todoValue.assignsTo(event.target.value);
            }
        }
        catch (error)
        {
            console.log(error);
            this._dialogService.showErrorMessage(ErrorMessage.generic);
        }
    }

    /**
     *  Life cycle methods for components are same as pages, but no onEnter and onLeave.
     */

    protected override onCreate(): void
    {
        super.onCreate();
        console.log("onCreate component");
    }

    protected override async onMount(e: HTMLElement): Promise<void>
    {
        super.onMount(e);
        this._users = await this._userService.fetchAll();
    }

    protected override onDestroy(): void
    {
        super.onDestroy();
        console.log("onDestroy component");
    }
}