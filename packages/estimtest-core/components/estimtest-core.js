import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const coreCss = ".full-screen{position:absolute;width:100%;height:100%;top:0rem}";

const EstimtestCore$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.config = undefined;
    this.active = true;
    this.status = 'inactive';
    this.errors = {};
  }
  watchConfigHandler() {
    // Warn user that changes to configuration will not have an affect.
    if (this.status === 'active') {
      this.errorHandler('The configuration file could not be changed during active testing.');
    }
  }
  watchActiveHandler(newValue) {
    console.log('active status changed');
    if (newValue && this.status === 'inactive') {
      this.errorHandler('The configuration file could not be changed during active testing.');
    }
  }
  componentDidLoad() {
    console.log('component did load');
    if (this.active) {
      this.promptBeginTests();
    }
  }
  promptBeginTests() {
    this.status = 'prompted';
  }
  errorHandler(message) {
    const errorId = Math.random().toString(16).slice(2);
    this.errors[errorId] = {
      message: message,
      visible: true,
    };
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
    return (h(Host, null, h("div", { class: { 'full-screen': true } }, h("div", { class: { 'errors': true } }), h("div", { class: { 'control-bar': true } }))));
  }
  static get watchers() { return {
    "config": ["watchConfigHandler"],
    "active": ["watchActiveHandler"]
  }; }
  static get style() { return coreCss; }
}, [0, "estimtest-core", {
    "config": [1],
    "active": [4],
    "status": [32],
    "errors": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["estimtest-core"];
  components.forEach(tagName => { switch (tagName) {
    case "estimtest-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, EstimtestCore$1);
      }
      break;
  } });
}

const EstimtestCore = EstimtestCore$1;
const defineCustomElement = defineCustomElement$1;

export { EstimtestCore, defineCustomElement };
