export interface User
{
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    dateOfBirth: string;
    isDeleted: boolean;
    
    
    update(firstName: string, lastName: string, email: string, dateOfBirth: string): Promise<void>;
    delete(): Promise<void>;
}