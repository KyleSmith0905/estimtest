/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { EstimtestConfig } from "./lib/config";
export namespace Components {
    interface EstimtestCore {
        /**
          * Whether to show the testing prompt on the bottom of the screen. Set this value to `false` to no longer see the estimtest bar.
         */
        "active"?: boolean;
        /**
          * The tests to be performed on the app. This is set by default to perform a `Large Font Size` and `Mobile Screen Size` test. This field accepts an array of objects each with the properties:  `name` A quick ~15 letters title summarizing the test\ `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).\ `fontSize` The font size to set the page.\ `width` The width to set the page.\ `height` The height to set the page.
         */
        "tests"?: EstimtestConfig['tests'];
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
          * Whether to show the testing prompt on the bottom of the screen. Set this value to `false` to no longer see the estimtest bar.
         */
        "active"?: boolean;
        /**
          * The tests to be performed on the app. This is set by default to perform a `Large Font Size` and `Mobile Screen Size` test. This field accepts an array of objects each with the properties:  `name` A quick ~15 letters title summarizing the test\ `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).\ `fontSize` The font size to set the page.\ `width` The width to set the page.\ `height` The height to set the page.
         */
        "tests"?: EstimtestConfig['tests'];
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
