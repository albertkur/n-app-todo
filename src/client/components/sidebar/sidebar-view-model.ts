import { ComponentViewModel, element, NavigationService, template } from "@nivinjoseph/n-app";
import { Routes } from "../../pages/routes";
import "./sidebar-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";

interface Menu
{
    title: string;
    href: string;
}

@template(require("./sidebar-view.html"))
@element("sidebar")
@inject("NavigationService")
export class SidebarViewModel extends ComponentViewModel
{
    private readonly _navigationService: NavigationService;
    private readonly _menus: Array<Menu>;

    public get menus(): Array<Menu> { return this._menus; }


    public constructor(navigationService: NavigationService)
    {
        super();

        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        this._navigationService = navigationService;


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

    public isActiveMenu(path: string): boolean { return this._navigationService.currentRoutePath === path; } // check the active menu and apply the css

}