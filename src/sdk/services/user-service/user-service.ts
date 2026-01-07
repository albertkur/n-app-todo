import { User } from "../../models/user";


export interface UserService
{
    fetchAll(): Promise<Array<User>>;

    fetchUser(id: string): Promise<User>;

    addUser(user: User): Promise<void>;

    update(user: User): Promise<void>;

    delete(id: string): Promise<void>;
}