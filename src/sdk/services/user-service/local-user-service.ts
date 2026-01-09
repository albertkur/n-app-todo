import { Uuid } from "@nivinjoseph/n-util";
import { UserService } from "./user-service";
import { given } from "@nivinjoseph/n-defensive";
import { User } from "../../proxies/user/user";
import { MockUserProxy } from "../../proxies/user/mock-user-proxy";

export class LocalUserService implements UserService
{
    private readonly _allUsers: Array<MockUserProxy>;

    public constructor()
    {
        const users = new Array<MockUserProxy>();
        const count = 10;

        for (let i = 0; i < count; i++)
        {
            users.push(new MockUserProxy(Uuid.create(), `First Name ${i}`, `Last Name ${i}`, "1998-01-01", `email${i}@gmail.com`));
        }
        this._allUsers = users;
    }

    public async fetchAll(): Promise<Array<User>>
    {
        return Promise.resolve(this._allUsers);
    }

    public async fetchUser(id: string): Promise<User>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        return Promise.resolve(this._allUsers.find(t => t.id === id) as User);
    }

    public async addUser(firstName: string, lastName: string, email: string, dateOfBirth: string): Promise<User>
    {
        given(firstName, "firstName").ensureHasValue().ensureIsString();
        given(lastName, "lastName").ensureHasValue().ensureIsString();
        given(email, "email").ensureHasValue().ensureIsString();
        given(dateOfBirth, "dateOfBirth").ensureHasValue().ensureIsString();

        const user = new MockUserProxy(Uuid.create(), firstName, lastName, dateOfBirth, email);
        this._allUsers.push(user);
        return Promise.resolve(user);
    }
}