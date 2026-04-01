import "@nivinjoseph/n-ext";

import "./styles/main.scss";
import "vuetify/dist/vuetify.min.css";

import "material-design-icons/iconfont/material-icons.css";
import { ClientApp, DefaultDialogService, DialogLocation, Vue } from "@nivinjoseph/n-app";
import { Routes } from "./pages/routes";
import { pages } from "./pages/pages";
import { ComponentInstaller, Registry } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { MockTodoService } from "../sdk/services/todo-service/mock-todo-service";
import { components } from "./components/components";
import Vuetify, { type UserVuetifyPreset } from "vuetify";


console.log(Vue);

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
Vue.use(Vuetify);
const options: UserVuetifyPreset = {
    theme: {
        dark: false,
        themes: {
            light: {
                primary: "#337E74",
                lightPrimary: "#E6F4F1",
                darkPrimary: "#1F4F48",
                error: "#F44336",
                warning: "#FFC107",
                accent: "#256058",
                success: "#28A745",
                brightGreen: "#22C55E",
                lighterGreen: "#4CD984",
                darkGreen: "#166534",
                brightRed: "#EF4444",
                lighterRed: "#F37A7A",
                darkRed: "#991B1B",
                lightGreen: "#DCFCE7",
                lightRed: "#FEF2F2",
                extraLightRed: "#FFF5F5",
                lightPurple: "#F3E8FF",
                darkPurple: "#6B21A8",
                extraLightPurple: "#FAF5FF",
                lightWarning: "#FEF9C3",
                extraLightWarning: "#FEFCE8",
                darkWarning: "#854D0E",
                extraLightBlue: "#EFF6FF",
                extraLightGreen: "#F0FDF4",
                extraLightOrange: "#FFF7ED",
                lightGrey: "#F9FAFB"
            }
        }
    }
};
const vuetify = new Vuetify(options);


class Installer implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        given(registry, "registry").ensureHasValue().ensureIsObject();

        registry
            .registerSingleton("TodoService", MockTodoService); // installing dependencies, usually used by VMs


        // Types of dependencies: 
        // registerSingleton: Singleton, one instance of the dependency class through out the lifecycle of the app.
        // registry.registerTransient: Transient, new instance of the dependency class is created when it needs to be injected.
        // registry.registerScoped: Scoped dependency, same instance is used if it's the same scope, else it it's new instance. 
        //                          Eg: Page and a component in that page will get the same instance of the dependency, while another page will get a new instance of the dependency.
        // registry.registerInstance: Instance dependency, similar to singleton, only deference is you provide the instance, and the instance is not created by the framework. 
    }
}


const client = new ClientApp("#app", "shell", { vuetify })
    .useInstaller(new Installer())
    .registerDialogService(new DefaultDialogService({
        accentColor: "#93C5FC",
        dialogLocation: DialogLocation.bottomLeft
    }))
    .registerComponents(...components) // registering all your app components
    .registerPages(...pages)  // registering all your app pages
    .useAsInitialRoute(Routes.todos)
    .useAsUnknownRoute(Routes.todos)
    .useHistoryModeRouting();

client.bootstrap();