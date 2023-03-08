import { Component } from '@angular/core';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public estimtestEnabled = environment.estimtest;

  title = 'angular-tour-of-heroes';
}
