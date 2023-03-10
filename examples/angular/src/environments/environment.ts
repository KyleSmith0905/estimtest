import { EstimtestModule } from "estimtest-angular";

/**
 * All imports are present, for type checking to not error when using a module that are not
 * imported on some environments. We will be warned whether the module is in use or not, therefore
 * you could add kinda fake component.
 */
const environment: {estimtest: boolean, appImports: any[]} = {
  estimtest: false,
  appImports: [EstimtestModule],
}

export default environment;