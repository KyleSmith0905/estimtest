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
        "active"?: boolean;
        "config"?: string | EstimtestConfig;
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
        "active"?: boolean;
        "config"?: string | EstimtestConfig;
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
