import { template, PageViewModel, route, NavigationService, DialogService } from "@nivinjoseph/n-app";
import "./manage-user-view.scss";
import { Routes } from "../routes";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ErrorMessage } from "../../models/error-message";
import { User } from "../../../sdk/proxies/user/user";
import { dedupe, Duration } from "@nivinjoseph/n-util";


@template(require("./manage-user-view.html"))
@route(Routes.manageUser)
@inject("UserService", "NavigationService", "DialogService")
export class ManageUserViewModel extends PageViewModel
{
    private readonly _userService: UserService;
    private readonly _navigationService: NavigationService;
    private readonly _dialogService: DialogService;


    private _user: User | null = null;

    private _isNew: boolean;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _dateOfBirth: string;
    private readonly _validator: Validator<this>;

    public get user(): User | null { return this._user; }

    public get isNew(): boolean { return this._isNew; } // check is new create or update user information

    public get firstName(): string { return this._firstName; }
    public set firstName(value: string) { this._firstName = value; }

    public get lastName(): string { return this._lastName; }
    public set lastName(value: string) { this._lastName = value; }

    public get email(): string { return this._email; }
    public set email(value: string) { this._email = value; }

    public get dateOfBirth(): string { return this._dateOfBirth; }
    public set dateOfBirth(value: string) { this._dateOfBirth = value; }

    public get hasErrors(): boolean { return !this._validate(); } // if has any error return true
    public get errors(): object { return this._validator.errors; } // which field is error

    public constructor(userService: UserService, navigationService: NavigationService, dialogService: DialogService)
    {
        super();
        given(userService, "userService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();


        this._userService = userService;
        this._navigationService = navigationService;
        this._dialogService = dialogService;

        this._user = null;
        this._isNew = true;
        this._firstName = "";
        this._lastName = "";
        this._email = "";
        this._dateOfBirth = "";
        this._validator = this._createValidator();
    }

    @dedupe(Duration.fromSeconds(1))
    public async submit(): Promise<void>
    {
        this._validator.enable();
        if (!this._validate())
            return;

        this._dialogService.showLoadingScreen();
        try
        {
            if (this._user)
            {
                await this._user.update(this._firstName, this._lastName, this._email, this._dateOfBirth);
            }
            else
            {
                await this.addUser(this._firstName, this._lastName, this._email, this._dateOfBirth);
            }
            this._dialogService.showSuccessMessage(this._user ? "Update user successfully" : "Create user successfully");
        }
        catch (error)
        {
            console.log("UPDATE USER: something went wrong", error);
            this._dialogService.showErrorMessage(ErrorMessage.generic);
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }

        this._navigationService.navigate(Routes.userList);
    }

    // add user
    public async addUser(firstName: string, lastName: string, email: string | null, dateOfBirth: string): Promise<void>
    {
        given(firstName, "firstName").ensureHasValue().ensureIsString();
        given(lastName, "lastName").ensureHasValue().ensureIsString();
        given(email, "email").ensureIsString();
        given(dateOfBirth, "dateOfBirth").ensureHasValue().ensureIsString();

        await this._userService.addUser(firstName, lastName, email, dateOfBirth);
    }

    // cancel and redirect to user list
    public cancel(): void
    {
        this._navigationService.navigate(Routes.userList);
    }

    protected override async onEnter(id?: string): Promise<void>
    {
        given(id as string, "id").ensureIsString();


        if (id && !id.isEmptyOrWhiteSpace())
        {
            this._isNew = false;
            this._userService.fetchUser(id).then(t => 
            {
                this._user = t;

                this._firstName = t.firstName;
                this._lastName = t.lastName;
                this._email = t.email || "";
                this._dateOfBirth = t.dateOfBirth;
            }
            ).catch(e => console.log(e));
        }
        else
        {
            this._isNew = true;
        }
    }

    private _validate(): boolean
    {
        this._validator.validate(this);
        return this._validator.isValid;
    }

    private _createValidator(): Validator<this>
    {
        const validator = new Validator<this>(true);

        validator
            .prop("firstName")
            .isRequired().withMessage("The first name field is required.")
            .isString()
            .useValidationRule(strval.hasMaxLength(50));

        validator
            .prop("lastName")
            .isRequired().withMessage("The last name field is required.")
            .isString()
            .useValidationRule(strval.hasMaxLength(500));

        validator
            .prop("email")
            .isOptional()
            .isString()
            .isEmail().withMessage("Please enter a valid email.");

        validator
            .prop("dateOfBirth")
            .isRequired().withMessage("The date of birth field is required.")
            .isDate("YYYY-MM-DD")
            .ensure(date => new Date(date) < new Date()).withMessage("Date of birth can not be future");

        return validator;
    }
}