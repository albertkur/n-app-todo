import { ComponentViewModel, template, element, events } from "@nivinjoseph/n-app";
import "./user-modal-form-view.scss";
import { User } from "../../../../../sdk/models/user";


@template(require("./user-modal-form-view.html"))
@element("user-modal-form")
    @events("submit", "closeModal")
    // @inject("")
export class UserModalFormViewModel extends ComponentViewModel
{
    // private readonly _userManagementService;
    private readonly _user: User | null = null;

    public get user(): User | null { return this._user; }

    public constructor(id?: string)
    {
        super();
        if (id == null || id.isEmptyOrWhiteSpace())
        {
            this._user = {
                firstName: "",
                lastName: ""
            };
        }

    }

    public submit(): void
    {
        console.log("Submit the form!", this.user);
    }

    public closeModal(): void
    {
        this.emit("closeModal", "Hello world");
    }
}