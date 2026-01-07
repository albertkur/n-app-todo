export class Routes
{
    public static todos = "/todos";
    public static manageTodo = "/manageTodo?{id?:string}";
    public static paxList = "/paxList";
    public static managePax = "/managePax?{id?: string}";
    public static userList = "/userList";
    public static manageUser = "/manageUser?{id?: string}";

    /**
     * static
     */
    private constructor() { }
}