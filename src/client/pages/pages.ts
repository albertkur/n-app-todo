import { ListTodosViewModel } from "./list-todos/list-todos-view-model";
import { ManagePaxViewModel } from "./manage-pax/manage-pax-view-model";
import { ManageTodoViewModel } from "./manage-todo/manage-todo-view-model";
import { PaxListViewModel } from "./pax-list/pax-list-view-model";
import { ClassHierarchy } from "@nivinjoseph/n-util";
import { PageViewModel } from "@nivinjoseph/n-app";


export const pages: Array<ClassHierarchy<PageViewModel>> = [
    ListTodosViewModel,
    ManageTodoViewModel,

    ManagePaxViewModel,
    PaxListViewModel
];