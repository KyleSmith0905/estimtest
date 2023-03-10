import { NgModule } from '@angular/core';
import { defineCustomElements } from 'estimtest-core/loader';

import { DIRECTIVES } from './directives/index';

defineCustomElements();

@NgModule({
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
  imports: [],
  providers: [],
})
export class EstimtestModule {}