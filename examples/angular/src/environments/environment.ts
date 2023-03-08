import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { EstimtestModule } from "estimtest-angular";

/**
 * All imports are present, for type checking to not error when using a module that are not
 * imported on some environments. We will be warned whether the module is in use or not, therefore
 * you could add kinda fake component.
 */
const environment = {
  estimtest: false,
  imports: [BrowserModule, AppRoutingModule, EstimtestModule],
}

export default environment;