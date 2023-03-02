import { APP_INITIALIZER, NgModule } from '@angular/core';
import { defineCustomElements } from 'estimtest-core/loader';

import { DIRECTIVES } from './directives/index';

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
  imports: [],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return defineCustomElements();
      },
    },
  ],
})
export class EstimtestModule {}