import { ComponentViewModel, template, element, bind, NavigationService, events } from "@nivinjoseph/n-app";
import { User } from "../../../../../sdk/proxies/user/user";
import { given } from "@nivinjoseph/n-defensive";
import { Routes } from "../../../routes";
import { inject } from "@nivinjoseph/n-ject";

@template(require("./user-table-row-view.html"))
@element("user-table-row")
@bind({ "selectableUser": "object" })
@inject("NavigationService")
@events("handleDeleteUser")
export class UserTableRowViewModel extends ComponentViewModel 
{
    private readonly _navigationService: NavigationService;


    public get user(): User { return this.getBound("selectableUser"); }
    

    public constructor(navigationService: NavigationService)
    {
        super();

        
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        this._navigationService = navigationService;
    }


    public manageUser(): void
    {
        this._navigationService.navigate(Routes.manageUser, { id: this.user.id });
    }

    public handleDeleteUser(): void
    {
        this.emit("handleDeleteUser", this.user);
    }
}