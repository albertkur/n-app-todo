import { PageViewModel, template, route, components } from "@nivinjoseph/n-app";
import "./users-view.scss";
import { Routes } from "../routes";
import { UserModalFormViewModel } from "./components/user-modal-form/user-modal-form-view-model";
import { User } from "../../../sdk/models/user";
import { Uuid } from "@nivinjoseph/n-util";


@template(require("./users-view.html"))
@route(Routes.users)
@components(UserModalFormViewModel)
export class UsersViewModel extends PageViewModel
{
    private readonly _users: Array<User> = new Array<User>();
    private _isModalDisplay: boolean = false;

    public get isModalDisplay(): boolean { return this._isModalDisplay; }
    public get getUsers(): Array<User> { return this._users; }

    public constructor()
    {
        super();
        this._users.push({
            id: Uuid.create(),
            firstName: "Hello",
            lastName: "User 1",
        },
            {
                id: Uuid.create(),
                firstName: "Hello",
                lastName: "User 2",
            },
            {
                id: Uuid.create(),
                firstName: "Hello",
                lastName: "User 3",
            });

        console.log(this._users);


    }


    public addUser(): void
    {
        this._isModalDisplay = true;
        console.log("add new user", this._isModalDisplay);
    }

    public async closeModal(text: string): Promise<void>
    {
        console.log("close modal", text);
        this._isModalDisplay = false;
    }

}