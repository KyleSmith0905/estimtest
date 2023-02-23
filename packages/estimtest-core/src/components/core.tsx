import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { EstimtestConfig } from '../lib/config';

@Component({
  tag: 'estimtest-core',
  styleUrl: 'core.css',
  shadow: false,
})
export class EstimtestCore {
  @Prop()
  config?: string | EstimtestConfig;
  
  @Prop()
  active?: boolean = true;

  @State()
  status: 'inactive' | 'prompted' | 'active' | 'finished' = 'inactive';

  @State()
  errors: Record<string, {message: string, visible: boolean}> = {};

  @Watch('config')
  watchConfigHandler() {
    // Warn user that changes to configuration will not have an affect.
    if (this.status === 'active') {
      this.errorHandler('The configuration file could not be changed during active testing.')
    }
  }
  
  @Watch('active')
  watchActiveHandler(newValue: typeof this.errors) {
    console.log('active status changed')
    if (newValue && this.status === 'inactive') {
      this.errorHandler('The configuration file could not be changed during active testing.')
    }
  }
  
  componentDidLoad() {
    console.log('component did load')
    if (this.active) {
      this.promptBeginTests();
    }
  }
  
  promptBeginTests() {
    this.status = 'prompted';
  }

  errorHandler(message: string) {
    const errorId = Math.random().toString(16).slice(2);
    this.errors[errorId] = {
      message: message,
      visible: true,
    }

    setInterval(() => {
      this.errors[errorId].visible = false;
    }, 5000);

    setInterval(() => {
      delete this.errors[errorId];
    }, 5500);
  }

  render() {
    // if (!this.active) return (<Fragment/>)
    // else if (this.status === 'inactive') return (<Fragment/>)

    return (
      <Host>
        <div class={{'full-screen': true}}>
          <div class={{'errors': true}}>
            {/* {Object.values(this.errors).map(element => (
              <div>
                <h2>Error</h2>
                <p>{element.message}</p>
              </div>
            ))} */}
          </div>
          <div class={{'control-bar': true}}>
            {/* {this.status === 'prompted' && (
              <h2>Start Tests</h2>
            )} */}
          </div>
        </div>
      </Host>
    );
  }
}