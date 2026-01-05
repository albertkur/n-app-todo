
import { TodoViewModel } from "./todo/todo-view-model";
import { ShellViewModel } from "./shell/shell-view-model";
import { ClassHierarchy } from "@nivinjoseph/n-util";
import { ComponentViewModel } from "@nivinjoseph/n-app";


export const components: Array<ClassHierarchy<ComponentViewModel>> = [
    ShellViewModel,
    TodoViewModel
];