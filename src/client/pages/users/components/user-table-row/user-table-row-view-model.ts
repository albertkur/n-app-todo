import { ComponentViewModel, template, element, bind, events } from "@nivinjoseph/n-app";
import { User } from "../../../../../sdk/models/user";

@template(require("./user-table-row-view.html"))
@element("user-table-row")
@events("manageUser", "deleteUser")
@bind({ "selectableUser": "object" })
export class UserTableRowViewModel extends ComponentViewModel 
{
    private get _user(): User { return this.getBound("selectableUser"); }


    public get user(): User { return this._user; }


    public manageUser(): void
    {
        this.emit("manageUser", this.user);
    }

    public deleteUser(): void
    {
        this.emit("deleteUser", this.user);
    }
}