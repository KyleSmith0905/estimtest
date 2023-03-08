import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { EstimtestModule } from "estimtest-angular";

const environment = {
  estimtest: true,
  imports: [BrowserModule, AppRoutingModule, EstimtestModule],
}

export default environment;