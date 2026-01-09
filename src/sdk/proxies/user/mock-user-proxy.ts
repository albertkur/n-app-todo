import { User } from "./user";
import { given } from "@nivinjoseph/n-defensive";

export class MockUserProxy implements User
{
    private readonly _id: string;
    private _firstName: string;
    private _lastName: string;
    private _email: string | null;
    private _dateOfBirth: string;
    private _isDeleted: boolean;

    public get id(): string { return this._id; }
    public get firstName(): string { return this._firstName; }
    public get lastName(): string { return this._lastName; }
    public get email(): string | null { return this._email; }
    public get dateOfBirth(): string { return this._dateOfBirth; }
    public get isDeleted(): boolean { return this._isDeleted; }

    public constructor(id: string, firstName: string, lastName: string, dateOfBirth: string, email: string | null)
    {
        given(id, "id").ensureHasValue().ensureIsString();
        this._id = id;

        given(firstName, "firstName").ensureHasValue().ensureIsString();
        this._firstName = firstName;

        given(lastName, "lastName").ensureHasValue().ensureIsString();
        this._lastName = lastName;

        given(email, "email").ensureIsString();
        this._email = email || null;

        given(dateOfBirth, "dateOfBirth").ensureHasValue().ensureIsString();
        this._dateOfBirth = dateOfBirth;

        this._isDeleted = false;
    }

    public async update(firstName: string, lastName: string, email: string | null, dateOfBirth: string): Promise<void>
    {
        given(this, "this").ensure(t => !t.isDeleted, "user is already deleted");
        
        given(firstName, "firstName").ensureHasValue().ensureIsString();
        given(lastName, "lastName").ensureHasValue().ensureIsString();
        given(email, "email").ensureIsString();
        given(dateOfBirth, "dateOfBirth").ensureHasValue().ensureIsString();

        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._dateOfBirth = dateOfBirth;
    }

    public async delete(): Promise<void>
    {
        given(this, "this").ensure(t => !t.isDeleted, "user is already deleted");

        this._isDeleted = true;
    }
}