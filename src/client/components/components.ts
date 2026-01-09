
import { TodoViewModel } from "./todo/todo-view-model";
import { ShellViewModel } from "./shell/shell-view-model";
import { ClassHierarchy } from "@nivinjoseph/n-util";
import { ComponentViewModel } from "@nivinjoseph/n-app";
import { SidebarViewModel } from "./sidebar/sidebar-view-model";


export const components: Array<ClassHierarchy<ComponentViewModel>> = [
    ShellViewModel,
    TodoViewModel,
    SidebarViewModel
];