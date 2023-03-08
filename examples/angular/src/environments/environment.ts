import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { EstimtestModule } from "estimtest-angular";

/**
 * All imports are present, for type checking to not error when using a module that are not
 * imported on some environments. Ensure the module isn't needed if so.
 */
const environment = {
  estimtest: false,
  imports: [BrowserModule, AppRoutingModule, EstimtestModule],
}

export default environment;