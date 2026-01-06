export class Routes
{
    public static todos = "/todos";
    public static manageTodo = "/manageTodo?{id?:string}";
    public static paxList = "/paxList";
    public static managePax = "/managePax?{id?: string}";
    public static users = "/users";

    /**
     * static
     */
    private constructor() { }
}