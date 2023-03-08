import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { FakeEstimtestModule } from "src/components/fake-estimtest.module";

const environment = {
  estimtest: false,
  imports: [BrowserModule, AppRoutingModule, FakeEstimtestModule],
}

export default environment;