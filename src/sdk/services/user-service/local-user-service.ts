import { Uuid } from "@nivinjoseph/n-util";
import { User } from "../../models/user";
import { UserService } from "./user-service";
import { given } from "@nivinjoseph/n-defensive";
import { ApplicationException } from "@nivinjoseph/n-exception";

export class LocalUserService implements UserService
{
    private readonly _allUsers: Array<User> = new Array<User>();

    public constructor()
    {
        this._allUsers.push({
            id: Uuid.create(),
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            dateOfBirth: "1998-01-08"
        },
            {
                id: Uuid.create(),
                firstName: "Jane",
                lastName: "Doe",
                email: "janedoe@gmail.com",
                dateOfBirth: "1998-01-10"
            },
            {
                id: Uuid.create(),
                firstName: "Pea",
                lastName: "Nut",
                email: "peanut@gmail.com",
                dateOfBirth: "1998-02-08"
            });
    }

    public async fetchAll(): Promise<Array<User>>
    {
        return this._allUsers.map(t => ({ ...t }));
    }

    public async fetchUser(id: string): Promise<User>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        const existingPaxIndex = this._allUsers.findIndex(t => t.id === id);
        if (existingPaxIndex === -1)
            throw new ApplicationException(`User with id ${id} not found`);

        const user = this._allUsers[existingPaxIndex];

        return { ...user };
    }

    public async addUser(user: User): Promise<void>
    {
        given(user, "user").ensureHasValue().ensureIsObject().ensure(t => t.id == null);

        user.id = Uuid.create();
        this._allUsers.push({ ...user });
    }

    public async update(user: User): Promise<void>
    {
        given(user, "user").ensureHasValue().ensureIsObject().ensure(t => t.id != null && this._allUsers.some(p => p.id == t.id));

        const existingPaxIndex = this._allUsers.findIndex(t => t.id === user.id);
        this._allUsers.splice(existingPaxIndex, 1, { ...user });
    }

    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString().ensure(t => this._allUsers.some(user => user.id === t));

        const existingPaxIndex = this._allUsers.findIndex(t => t.id === id);
        this._allUsers.splice(existingPaxIndex, 1);
    }
}