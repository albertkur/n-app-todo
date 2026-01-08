import { ComponentViewModel, element, template } from "@nivinjoseph/n-app";
import { Routes } from "../../pages/routes";
import "./sidebar-view.scss";

interface Menu
{
    title: string;
    href: string;
}

@template(require("./sidebar-view.html"))
@element("sidebar")
export class SidebarViewModel extends ComponentViewModel
{
    private readonly _menus: Array<Menu>;

    public get menus(): Array<Menu> { return this._menus; }

    public constructor()
    {
        super();

        this._menus = [
            {
                title: "Users",
                href: Routes.userList
            },
            {
                title: "Todo",
                href: Routes.todos
            },
            {
                title: "Pax list",
                href: Routes.paxList
            }
        ];
    }
}