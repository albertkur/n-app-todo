import { ComponentViewModel, template, element, bind, NavigationService, DialogService } from "@nivinjoseph/n-app";
import { User } from "../../../../../sdk/proxies/user/user";
import { given } from "@nivinjoseph/n-defensive";
import { Routes } from "../../../routes";
import { inject } from "@nivinjoseph/n-ject";
import { ErrorMessage } from "../../../../models/error-message";

@template(require("./user-table-row-view.html"))
@element("user-table-row")
@bind({ "selectableUser": "object" })
@inject("NavigationService", "DialogService")
export class UserTableRowViewModel extends ComponentViewModel 
{
    private readonly _navigationService: NavigationService;
    private readonly _dialogService: DialogService;

    private get _user(): User { return this.getBound("selectableUser"); };

    public get user(): User { return this._user; };

    public constructor(navigationService: NavigationService, dialogService: DialogService)
    {
        super();

        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();

        this._navigationService = navigationService;
        this._dialogService = dialogService;
    }


    public manageUser(): void
    {
        this._navigationService.navigate(Routes.manageUser, { id: this.user.id });
    }

    public deleteUser(): void
    {
        try
        {
            this.user.delete();
            this._dialogService.showSuccessMessage("Delete user successfully")
        } catch (error)
        {
            console.log("Something went wrong", error)
            this._dialogService.showErrorMessage(ErrorMessage.generic)
        }
    }
}