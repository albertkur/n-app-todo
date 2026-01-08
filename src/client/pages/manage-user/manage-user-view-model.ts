import { template, PageViewModel, route, NavigationService } from "@nivinjoseph/n-app";
import "./manage-user-view.scss";
import { User } from "../../../sdk/models/user";
import { Routes } from "../routes";
import { UserService } from "../../../sdk/services/user-service/user-service";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { Validator, strval } from "@nivinjoseph/n-validate";


@template(require("./manage-user-view.html"))
@route(Routes.manageUser)
@inject("UserService", "NavigationService")
export class ManageUserViewModel extends PageViewModel
{
    private readonly _userService: UserService;
    private readonly _navigationService: NavigationService;


    private _user: User | null = null;
    private _isNew: boolean;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _dateOfBirth: string;
    private readonly _validator: Validator<this>;

    public get user(): User | null { return this._user; }
    // handle user form
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

    public constructor(userService: UserService, navigationService: NavigationService)
    {
        super();
        given(userService, "userService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();

        this._userService = userService;
        this._navigationService = navigationService;
        this._isNew = true;
        this._firstName = "";
        this._lastName = "";
        this._email = "";
        this._dateOfBirth = "";
        this._validator = this._createValidator();
    }

    public async submit(): Promise<void>
    {
        this._validator.enable();
        if (!this._validate())
            return;

        if (this.isNew)
        {
            console.log("create new user");
            await this.addUser({ firstName: this._firstName, lastName: this._lastName, email: this._email, dateOfBirth: this._dateOfBirth } as User);
        }
        else
        {
            await this.updateUser({ ...this.user, firstName: this._firstName, lastName: this._lastName, email: this._email, dateOfBirth: this._dateOfBirth } as User);
        }
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

    // cancel and redirect to user list
    public cancel(): void
    {
        this._navigationService.navigate(Routes.userList);
    }

    protected override async onEnter(id?: string): Promise<void>
    {
        given(id as string, "id").ensureIsString();


        if (id == null || id.isEmptyOrWhiteSpace())
        {
            this._isNew = true;
            this._user = {
                firstName: "",
                lastName: "",
                email: "",
                dateOfBirth: ""
            };
            this._firstName = "";
            this._lastName = "";
            this._email = "";
            return;
        }

        try
        {
            this._user = await this._userService.fetchUser(id);
            this._firstName = this._user.firstName;
            this._lastName = this._user.lastName;
            this._email = this._user.email;
            this._dateOfBirth = this._user.dateOfBirth;
            this._isNew = false;
        }
        catch (error)
        {
            console.log("Something went wrong");
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
            .isString();

        return validator;
    }
}