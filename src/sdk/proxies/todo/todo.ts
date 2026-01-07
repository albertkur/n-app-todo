export interface Todo
{
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    isDeleted: boolean;
    // added:
    assignedTo: string | null;


    update(title: string, description: string, assignedTo:string): Promise<void>;
    complete(): Promise<void>;
    delete(): Promise<void>;
}