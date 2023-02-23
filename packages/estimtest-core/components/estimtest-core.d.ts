import type { Components, JSX } from "../dist/types/components";

interface EstimtestCore extends Components.EstimtestCore, HTMLElement {}
export const EstimtestCore: {
  prototype: EstimtestCore;
  new (): EstimtestCore;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
