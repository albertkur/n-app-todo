

import { PageViewModel, template, route } from "@nivinjoseph/n-app";
import { Routes } from "../routes";
import "./file-system-view.scss";
// import * as $ from "jquery";
// import { Draggable, DragStopEvent } from "@shopify/draggable";

@template(require("./file-system-view.html"))
@route(Routes.fileSystem)
export class FileSystemViewModel extends PageViewModel
{
    data()
    {
        return {
            data: [{
                label: "Level one 1",
                children: [{
                    label: "Level two 1-1",
                    children: [{
                        label: "Level three 1-1-1"
                    }]
                }]
            }, {
                label: "Level one 2",
                children: [{
                    label: "Level two 2-1",
                    children: [{
                        label: "Level three 2-1-1"
                    }]
                }, {
                    label: "Level two 2-2",
                    children: [{
                        label: "Level three 2-2-1"
                    }]
                }]
            }, {
                label: "Level one 3",
                children: [{
                    label: "Level two 3-1",
                    children: [{
                        label: "Level three 3-1-1"
                    }]
                }, {
                    label: "Level two 3-2",
                    children: [{
                        label: "Level three 3-2-1"
                    }]
                }]
            }],
            defaultProps: {
                children: "children",
                label: "label"
            }
        };
    }
    // @ts-ignore
    handleDragStart(node: any, ev: any)
    {
        console.log("drag start", node);
    }
    // @ts-ignore
    handleDragEnter(draggingNode: any, dropNode: { label: any; }, ev: any)
    {
        console.log("tree drag enter: ", dropNode.label);
    }
    // @ts-ignore
    handleDragLeave(draggingNode: any, dropNode: { label: any; }, ev: any)
    {
        console.log("tree drag leave: ", dropNode.label);
    }
    // @ts-ignore
    handleDragOver(draggingNode: any, dropNode: { label: any; }, ev: any)
    {
        console.log("tree drag over: ", dropNode.label);
    }
    // @ts-ignore
    handleDragEnd(draggingNode: any, dropNode: { label: any; }, dropType: any, ev: any)
    {
        console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    }
    // @ts-ignore
    handleDrop(draggingNode: any, dropNode: { label: any; }, dropType: any, ev: any)
    {
        console.log("tree drop: ", dropNode.label, dropType);
    }
    // @ts-ignore
    allowDrop(draggingNode: any, dropNode: { data: { label: string; }; }, type: string)
    {
        if (dropNode.data.label === "Level two 3-1")
        {
            return type !== "inner";
        } else
        {
            return true;
        }
    }
    allowDrag(draggingNode: { data: { label: string | string[]; }; })
    {
        return draggingNode.data.label.indexOf("Level three 3-1-1") === -1;
    }
    // private _entities: Array<Library> = [
    //     {
    //         path: "root",
    //         name: "folder_1",
    //         type: Type.folder
    //     },
    //     {
    //         path: "root",
    //         name: "folder_2",
    //         type: Type.folder
    //     },
    //     {
    //         path: "root",
    //         name: "folder_3",
    //         type: Type.folder
    //     },
    //     {
    //         path: "root",
    //         name: "folder_4",
    //         type: Type.folder
    //     },
    //     {
    //         path: "root/folder_1",
    //         name: "subfolder_1",
    //         type: Type.folder
    //     },
    //     {
    //         path: "root/folder_1/subfolder_1",
    //         name: "file_1",
    //         type: Type.file
    //     },
    // ];

    // private _dragOverId: HTMLElement | null = null;

    // protected override  onMount(element: HTMLElement): void
    // {
    //     super.onMount(element);

    //     this.generateFolderStructure();

    //     const draggableComponent = new Draggable(element.querySelectorAll("#root"), {
    //         draggable: ".draggable",
    //         // delay: 300,
    //         distance: 5,
    //     });
    //     draggableComponent.on("drag:stop", (event: DragStopEvent) =>
    //     {
    //         if (this._dragOverId == null)
    //             return;

    //         this._dragOverId!.style.background = "inherit";
    //         // console.log(this._dragOverId);

    //         const draggedOver = this._entities.find(t => `${t.path.split("/").join("")}${t.name}` === this._dragOverId!.id);
    //         const dragged = this._entities.findIndex(t => `${t.path.split("/").join("")}${t.name}` === event.source.id);


    //         const oldPath = `${this._entities[dragged].path}/${this._entities[dragged].name}`;

    //         const newPath = `${draggedOver!.path}/${draggedOver!.name}`;
    //         if (oldPath === newPath)
    //             return;

    //         this._entities[dragged].path = newPath;

    //         for (const item of this._entities)
    //         {
    //             if (item.path.startsWith(oldPath))
    //             {
    //                 console.log(oldPath);
    //                 console.log(`${newPath}/${this._entities[dragged].name}`);

    //                 item.path = item.path.replace(oldPath, `${newPath}/${this._entities[dragged].name}`);
    //             }
    //         }

    //         window.setTimeout(() =>
    //         {
    //             this.generateFolderStructure();
    //         }, 0);
    //     });
    //     draggableComponent.on("drag:over", (event) =>
    //     {
    //         // console.log(event);
    //         event.over.style.background = "red";

    //         this._dragOverId = event.over;
    //     });
    //     draggableComponent.on("drag:out", (event) =>
    //     {
    //         // console.log(event);
    //         event.over.style.background = "inherit";
    //         this._dragOverId = null;
    //     });
    //     this.executeOnDestroy(draggableComponent.destroy);
    // }

    // private generateFolderStructure(): void
    // {
    //     $("#root").empty();
    //     console.log(this._entities.map(t => t.path));

    //     for (const item of this._entities)
    //     {

    //         this.generateFolders(item);

    //         const folders = item.path.split("/");
    //         const parentId = folders.join("");

    //         const parentElement = this.domElement.querySelector(`#${parentId}`);
    //         const id = `${parentId}${item.name}`;
    //         const child = this.domElement.querySelector(`#${id}`);

    //         if (child != null)
    //             continue;

    //         // if (item.type === Type.folder)
    //         //     $(parentElement!).append(`< div id = ${ id } class= "draggable${parentId === "root" ? "" : " ml - 3"}" > ${ item.name } < /div>`);
    //         // else
    //         const child2 = $(`<div id=${id} class="draggable${parentId === "root" ? "" : " ml-3"}">${item.name}</div>`)
    //             .on("click", function (e)
    //             {
    //                 e.stopPropagation();
    //                 $(this).children().slideToggle({
    //                     duration: 200,
    //                     complete: function ()
    //                     {
    //                         console.log("clicked", this);
    //                     },
    //                 });

    //             });
    //         $(parentElement!).append(child2);

    //         // console.log("child", child2);

    //     }
    // }

    // private generateFolders(item: Library): void
    // {
    //     const folders = item.path.split("/");
    //     // console.log("folders", folders);

    //     for (let i = 0; i < folders.length - 1; i++)
    //     {
    //         let subPath = folders.take(i + 1).join("");
    //         // console.log("subpath", subPath);

    //         const parentElement = this.domElement.querySelector(`#${subPath}`);
    //         // console.log("parent", parentElement);

    //         const id = `${subPath}${folders[i + 1]}`;

    //         const child = this.domElement.querySelector(`#${id}`);

    //         if (child != null)
    //             continue;

    //         // $(parentElement!).append(`<div id=${id} class="draggable${subPath === "root" ? "" : " ml-3"}">${folders[i + 1]}</div>`);
    //         const child2 = $(`<div id=${id} class="draggable${subPath === "root" ? "" : " ml-3"}">${folders[i + 1]}</div>`)
    //             .on("click", function (e)
    //             {
    //                 e.stopPropagation();
    //                 $(this).children().slideToggle(200);
    //             });
    //         $(parentElement!).append(child2);
    //         // console.log("child", child);

    //     }
    // }
}


// interface Library
// {
//     path: string;
//     name: string;
//     type: Type;
// }

// enum Type
// {
//     file,
//     folder
// }