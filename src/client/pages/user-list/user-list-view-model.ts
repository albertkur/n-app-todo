import { PageViewModel, template, route, components, DialogService } from "@nivinjoseph/n-app";
import "./user-list-view.scss";
import { Routes } from "../routes";
import { UserTableRowViewModel } from "./components/user-table-row/user-table-row-view-model";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { ErrorMessage } from "../../models/error-message";
import { User } from "../../../sdk/proxies/user/user";
import { TodoService } from "../../../sdk/services/todo-service/todo-service";


@template(require("./user-list-view.html"))
@route(Routes.userList)
@inject("UserService", "DialogService", "TodoService")
@components(UserTableRowViewModel)
export class UserListViewModel extends PageViewModel
{
    private readonly _userService: UserService;
    private readonly _dialogService: DialogService;
    private readonly _todoService: TodoService;


    private _users: Array<User> = new Array<User>();
    private _searchKey: string = "";


    public get filterUsers(): Array<User> // filter users with search key
    {
        let users = this._users;

        if (this._searchKey.isNotEmptyOrWhiteSpace())
        {
            users = users
                .where((t) => `${t.firstName}${t.lastName}`.toLocaleLowerCase()
                    .contains(this._searchKey.toLowerCase()));
        }

        return users;
    }
    public get searchKey(): string { return this._searchKey; } // get search key
    public set searchKey(value: string) { this._searchKey = value; } // set search key


    public constructor(userService: UserService, dialogService: DialogService, todoService: TodoService)
    {
        super();

        given(userService, "userService").ensureHasValue().ensureIsObject();
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();
        given(todoService, "todoService").ensureHasValue().ensureIsObject();


        this._userService = userService;
        this._dialogService = dialogService;
        this._todoService = todoService;
    }


    public async handleDeleteUser(user: User): Promise<void>
    {
        if (!confirm(`Are you sure you want to delete the user: ${user.firstName} ${user.lastName}`))
            return;

        this._dialogService.showLoadingScreen();
        try 
        {
            const todos = await this._todoService.getTodos();

            const isAssigned = todos.some(t => t.assignedTo == user.id); // return true when user is assigned any todo

            if (isAssigned)
            {
                alert("This user is assigned in todo");
            }
            else
            {
                await user.delete();
            }
        }
        catch (error)
        {
            console.log(error);
            this._dialogService.showErrorMessage(ErrorMessage.generic);
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }

        await this._loadUsers();
    }


    protected override onEnter(): void
    {
        super.onEnter();

        this._loadUsers().catch(e => console.log(e));
    }


    // load users data from
    private async _loadUsers(): Promise<void>
    {
        try
        {
            this._users = await this._userService.fetchAll();
        }
        catch (e)
        {
            console.error(e);
            this._dialogService.showErrorMessage(ErrorMessage.generic);
            return;
        }
    }
}