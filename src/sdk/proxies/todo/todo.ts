export interface Todo
{
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    isDeleted: boolean;
    assignedTo: string | null;


    update(title: string, description: string | null, assignedTo: string | null): Promise<void>;
    assignsTo(userId: string): Promise<void>;
    unAssigns(): Promise<void>;
    complete(): Promise<void>;
    delete(): Promise<void>;
}