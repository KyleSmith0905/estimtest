/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { EstimtestExperiments } from "./lib/experiments";
import { EstimtestConfig } from "./lib/config";
export namespace Components {
    interface EstimtestCore {
        /**
          * Whether to show the testing prompt on the bottom of the screen. Having this as false still imports the library but does not use it. Look at the [examples](examples) for sloppy implementations of fully removing Estimtest in production.
         */
        "active"?: string | boolean;
        /**
          * The experiments to be performed on the app. This is set by default to perform multiple standard tests. This field could also be a string. This field accepts an array of objects each with the properties:  `name` A quick ~15 letters title summarizing the test\ `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).\ `fontSize` The font size to set the page. Many users have difficulty reading text at the default font size, users fix this by increasing the default font size. `colorBlind` A change of colors on the page reflecting what colorblind users may see. `keyboardOnly` Many users may use keyboard navigation for a variety of reasons such as: Motor impairment, saving time, and more.
         */
        "experiments"?: string | EstimtestExperiments[];
        /**
          * An element selector containing the parent of where the element should be at. You could use this property in the event that your code does not permit you to place the element there.
         */
        "moveSelector": string;
        /**
          * Progress to the next test in the config. This does not need to be manually implemented, the UI elements perform the same event.
         */
        "nextExperiment": (results: 'fail' | 'pass') => Promise<void>;
        /**
          * Provides the prompt to begin or restart experiments. This activates and resets the experiments as well.
         */
        "promptBeginExperiments": () => Promise<void>;
        /**
          * Starts the experiments using the config sent to this method. This does not need to be manually implemented, the UI elements perform the same event.
         */
        "startExperiments": (config?: EstimtestConfig) => Promise<void>;
    }
}
declare global {
    interface HTMLEstimtestCoreElement extends Components.EstimtestCore, HTMLStencilElement {
    }
    var HTMLEstimtestCoreElement: {
        prototype: HTMLEstimtestCoreElement;
        new (): HTMLEstimtestCoreElement;
    };
    interface HTMLElementTagNameMap {
        "estimtest-core": HTMLEstimtestCoreElement;
    }
}
declare namespace LocalJSX {
    interface EstimtestCore {
        /**
          * Whether to show the testing prompt on the bottom of the screen. Having this as false still imports the library but does not use it. Look at the [examples](examples) for sloppy implementations of fully removing Estimtest in production.
         */
        "active"?: string | boolean;
        /**
          * The experiments to be performed on the app. This is set by default to perform multiple standard tests. This field could also be a string. This field accepts an array of objects each with the properties:  `name` A quick ~15 letters title summarizing the test\ `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).\ `fontSize` The font size to set the page. Many users have difficulty reading text at the default font size, users fix this by increasing the default font size. `colorBlind` A change of colors on the page reflecting what colorblind users may see. `keyboardOnly` Many users may use keyboard navigation for a variety of reasons such as: Motor impairment, saving time, and more.
         */
        "experiments"?: string | EstimtestExperiments[];
        /**
          * An element selector containing the parent of where the element should be at. You could use this property in the event that your code does not permit you to place the element there.
         */
        "moveSelector"?: string;
    }
    interface IntrinsicElements {
        "estimtest-core": EstimtestCore;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "estimtest-core": LocalJSX.EstimtestCore & JSXBase.HTMLAttributes<HTMLEstimtestCoreElement>;
        }
    }
}
