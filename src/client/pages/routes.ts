export class Routes
{
    public static userList = "/userList";
    public static manageUser = "/manageUser?{id?: string}";
    
    public static todos = "/todos";
    public static manageTodo = "/manageTodo?{id?:string}";

    public static paxList = "/paxList";
    public static managePax = "/managePax?{id?: string}";

    /**
     * static
     */
    private constructor() { }
}