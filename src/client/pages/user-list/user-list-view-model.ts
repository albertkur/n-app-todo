import { PageViewModel, template, route, components, DialogService } from "@nivinjoseph/n-app";
import "./user-list-view.scss";
import { Routes } from "../routes";
import { UserTableRowViewModel } from "./components/user-table-row/user-table-row-view-model";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { ErrorMessage } from "../../models/error-message";
import { User } from "../../../sdk/proxies/user/user";


@template(require("./user-list-view.html"))
@route(Routes.userList)
@inject("UserService", "NavigationService", "DialogService")
@components(UserTableRowViewModel)
export class UserListViewModel extends PageViewModel
{
    private readonly _userService: UserService;
    private readonly _dialogService: DialogService;


    private _users: Array<User> = new Array<User>();
    private _searchKey: string = "";


    public get filterUsers(): Array<User> // filter users with search key
    {
        let users = this._users;

        if (this._searchKey.isNotEmptyOrWhiteSpace())
        {
            users = users
                .where((t) => `${t.firstName}${t.lastName}`.toLocaleLowerCase().contains(this._searchKey.toLowerCase()));
        }


        return users.where(user => !user.isDeleted);
    }
    public get searchKey(): string { return this._searchKey; } // get search key
    public set searchKey(value: string) { this._searchKey = value; } // set search key


    public constructor(userService: UserService, dialogService: DialogService)
    {
        super();

        given(userService, "userService").ensureHasValue().ensureIsObject();
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();


        this._userService = userService;
        this._dialogService = dialogService;
    }

    protected override onEnter(): void
    {
        super.onEnter();

        this._loadUsers().catch(e => console.log(e));
    }


    // load users data from
    private async _loadUsers(): Promise<void>
    {
        this._users = new Array<User>();
        try
        {
            this._userService.fetchAll()
                .then(t => this._users = t)
                .catch(e => console.error(e));
        }
        catch (e)
        {
            console.error(e);
            this._dialogService.showErrorMessage(ErrorMessage.generic);
            return;
        }
    }
}