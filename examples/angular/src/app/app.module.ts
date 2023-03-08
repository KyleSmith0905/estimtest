import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import environment from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: environment.imports,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
