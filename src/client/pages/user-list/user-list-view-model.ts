import { PageViewModel, template, route, components } from "@nivinjoseph/n-app";
import "./user-list-view.scss";
import { Routes } from "../routes";
import { User } from "../../../sdk/models/user";
import { UserTableRowViewModel } from "./components/user-table-row/user-table-row-view-model";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";


@template(require("./user-list-view.html"))
@route(Routes.userList)
@inject("UserService")
@components(UserTableRowViewModel)
export class UserListViewModel extends PageViewModel
{
    private readonly _userService: UserService;


    private _users: Array<User> = new Array<User>();
    private _searchKey: string = "";

    public get getUsers(): Array<User> { return this._users; }

    // filter users with search key
    public get filterUsers(): Array<User>
    {
        let users = this._users;

        if (this._searchKey.isNotEmptyOrWhiteSpace())
        {
            users = users.where((t) => `${t.firstName}${t.lastName}`.toLocaleLowerCase().contains(this._searchKey.toLowerCase()));
        }

        return users;
    }

    // handle search key
    public get searchKey(): string { return this._searchKey; }
    public set searchKey(value: string) { this._searchKey = value; }

    public constructor(userService: UserService)
    {
        super();
        // local service
        given(userService, "userService").ensureHasValue().ensureIsObject();
        this._userService = userService;
    }


    // manage user
    public async manageUser(user: User): Promise<void>
    {
        console.log("manage user", user);
    }

    // delete user
    public async deleteUser(user: User): Promise<void>
    {
        given(user, "user").ensureHasValue().ensureIsObject().ensure(t => t.id != null && this._users.some(p => p.id == t.id));

        if (!confirm(`Are you sure you want to delete the user: ${user.firstName} ${user.lastName}`))
            return;
        try 
        {
            await this._userService.delete(user.id!);
        }
        catch (error)
        {
            console.log("DELETE USER: something went wrong");
        }
        finally
        {
            await this._loadUsers();
        }
    }

    protected override onEnter(): void
    {
        super.onEnter();

        this._loadUsers().catch(e => console.log(e));
    }


    private async _loadUsers(): Promise<void>
    {
        this._users = new Array<User>();

        try
        {
            const users = await this._userService.fetchAll();
            this._users = users.map(t => ({
                ...t
            }));
        }
        catch (e)
        {
            console.error(e);
            return;
        }
    }
}