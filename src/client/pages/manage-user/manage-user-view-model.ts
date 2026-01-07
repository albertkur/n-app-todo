import { template, PageViewModel, route, NavigationService } from "@nivinjoseph/n-app";
import "./manage-user-view.scss";
import { User } from "../../../sdk/models/user";
import { Routes } from "../routes";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";


@template(require("./manage-user-view.html"))
@route(Routes.manageUser)
@inject("UserService", "NavigationService")
export class ManageUserViewModel extends PageViewModel
{
    private readonly _userService: UserService;
    private readonly _navigationService: NavigationService;


    private readonly _user: User | null = null;
    private _isNew: boolean;

    public get user(): User | null { return this._user; }
    public get isNew(): boolean { return this._isNew; }

    public constructor(userService: UserService, navigationService: NavigationService)
    {
        super();
        given(userService, "userService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        
        this._userService = userService;
        this._navigationService = navigationService;

        // init user data
        this._user = {
            firstName: "",
            lastName: ""
        };
        this._isNew = true;
    }
    
    public async submit(): Promise<void>
    {
        await this.addUser(this.user as User);
    }

    // add user
    public async addUser(user: User): Promise<void>
    {
        given(user, "user").ensureHasValue().ensureIsObject();

        try 
        {
            await this._userService.addUser(user);
        }
        catch (error)
        {
            console.log("ADD USER: something went wrong");
        }

        this._navigationService.navigate(Routes.userList);
    }


    // update user
    public async updateUser(user: User): Promise<void>
    {
        given(user, "user").ensureHasValue().ensureIsObject();

        try 
        {
            await this._userService.update(user);
        }
        catch (error)
        {
            console.log("ADD USER: something went wrong");
        }

        this._navigationService.navigate(Routes.userList);
    }
    
    // cancel
    public cancel(): void
    {
        this._navigationService.navigate(Routes.userList);
    }

    protected override onEnter(): void
    {
        this._isNew = true;
    }
}