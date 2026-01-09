import { User } from "../../proxies/user/user";


export interface UserService
{
    fetchAll(): Promise<Array<User>>;
    fetchUser(id: string): Promise<User>;
    addUser(firstName: string, lastName: string, email: string | null, dateOfBirth: string): Promise<User>;
}