import { Input, NgModule } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'estimtest-core',
  template: '',
  styles: []
})
export class FakeEstimtestCoreComponent {
  @Input() active: any;
  @Input() experiments: any;
}


@NgModule({
  declarations: [FakeEstimtestCoreComponent],
  exports: [FakeEstimtestCoreComponent]
})
export class FakeEstimtestModule { }
