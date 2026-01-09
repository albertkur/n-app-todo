import { PageViewModel, template, route, components, NavigationService, DialogService } from "@nivinjoseph/n-app";
import "./user-list-view.scss";
import { Routes } from "../routes";
import { User } from "../../../sdk/models/user";
import { UserTableRowViewModel } from "./components/user-table-row/user-table-row-view-model";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { ErrorMessage } from "../../models/error-message";


@template(require("./user-list-view.html"))
@route(Routes.userList)
@inject("UserService", "NavigationService", "DialogService")
@components(UserTableRowViewModel)
export class UserListViewModel extends PageViewModel
{
    private readonly _userService: UserService;
    private readonly _navigationService: NavigationService;
    private readonly _dialogService: DialogService;


    private _users: Array<User> = new Array<User>();
    private _searchKey: string = "";


    public get getUsers(): Array<User> { return this._users; }
    public get filterUsers(): Array<User> // filter users with search key
    {
        let users = this._users;

        if (this._searchKey.isNotEmptyOrWhiteSpace())
        {
            users = users.where((t) => `${t.firstName}${t.lastName}`.toLocaleLowerCase().contains(this._searchKey.toLowerCase()));
        }

        return users;
    }
    public get searchKey(): string { return this._searchKey; } // get search key
    public set searchKey(value: string) { this._searchKey = value; } // set search key


    public constructor(userService: UserService, navigationService: NavigationService, dialogService: DialogService)
    {
        super();
        // local service
        given(userService, "userService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();


        this._userService = userService;
        this._navigationService = navigationService;
        this._dialogService = dialogService;
    }



    public async manageUser(user: User): Promise<void> // manage user
    {
        given(user, "user").ensureHasValue().ensureIsObject().ensure(t => t.id != null && this._users.some(p => p.id == t.id));

        this._navigationService.navigate(Routes.manageUser, { id: user.id });
    }


    public async deleteUser(user: User): Promise<void> // delete user
    {
        given(user, "user").ensureHasValue().ensureIsObject().ensure(t => t.id != null && this._users.some(p => p.id == t.id));

        if (!confirm(`Are you sure you want to delete the user: ${user.firstName} ${user.lastName}`))
            return;

        this._dialogService.showLoadingScreen();
        try 
        {
            await this._userService.delete(user.id!);
            this._dialogService.showSuccessMessage("Delete user successfully");
        }
        catch (error)
        {
            console.log("DELETE USER: something went wrong");
            this._dialogService.showErrorMessage(ErrorMessage.generic);
        }
        finally
        {
            await this._loadUsers();
            this._dialogService.hideLoadingScreen();
        }
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

        this._dialogService.showLoadingScreen();

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
            this._dialogService.showErrorMessage(ErrorMessage.generic);
            return;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }
}