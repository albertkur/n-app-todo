import { PageViewModel, template, route, components } from "@nivinjoseph/n-app";
import "./users-view.scss";
import { Routes } from "../routes";
import { UserModalFormViewModel } from "./components/user-modal-form/user-modal-form-view-model";
import { User } from "../../../sdk/models/user";
import { Uuid } from "@nivinjoseph/n-util";
import { UserTableRowViewModel } from "./components/user-table-row/user-table-row-view-model";


@template(require("./users-view.html"))
@route(Routes.users)
@components(UserModalFormViewModel, UserTableRowViewModel)
export class UsersViewModel extends PageViewModel
{
    private readonly _users: Array<User> = new Array<User>();
    private _isModalDisplay: boolean = false;
    private _searchKey: string = "";

    public get isModalDisplay(): boolean { return this._isModalDisplay; }
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
    public get searchKey():string { return this._searchKey; }
    public set searchKey(value: string) { this._searchKey = value; }
    
    public constructor()
    {
        super();
        // init set mock data
        this._users.push({
            id: Uuid.create(),
            firstName: "John",
            lastName: "Doe",
        },
            {
                id: Uuid.create(),
                firstName: "Jane",
                lastName: "Doe",
            },
            {
                id: Uuid.create(),
                firstName: "Pea",
                lastName: "Nut",
            });

    }


    // add user
    public addUser(user: User): void
    {
        this._users.push(user);
        this._isModalDisplay = false;
    }

    // open user modal form
    public openModal(): void
    {
        // display the user modal form
        this._isModalDisplay = true;
    }
    
    // close user modal form
    public closeModal(): void
    {
        // close the user modal form
        this._isModalDisplay = false;
    }
    
    
    // manage user
    public manageUser(): void
    {
        alert("manage user");
    }
    
    // manage user
    public deleteUser(user: User): void
    {
        const existingUserIndex = this._users.findIndex(t => t.id === user.id);
        this._users.splice(existingUserIndex, 1);
    }

}