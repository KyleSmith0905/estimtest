'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*!
 Stencil Mock Doc v2.22.2 | MIT Licensed | https://stenciljs.com
 */
const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const attrHandler = {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop];
    }
    if (typeof prop !== 'symbol' && !isNaN(prop)) {
      return obj.__items[prop];
    }
    return undefined;
  },
};
const createAttributeProxy = (caseInsensitive) => new Proxy(new MockAttributeMap(caseInsensitive), attrHandler);
class MockAttributeMap {
  constructor(caseInsensitive = false) {
    this.caseInsensitive = caseInsensitive;
    this.__items = [];
  }
  get length() {
    return this.__items.length;
  }
  item(index) {
    return this.__items[index] || null;
  }
  setNamedItem(attr) {
    attr.namespaceURI = null;
    this.setNamedItemNS(attr);
  }
  setNamedItemNS(attr) {
    if (attr != null && attr.value != null) {
      attr.value = String(attr.value);
    }
    const existingAttr = this.__items.find((a) => a.name === attr.name && a.namespaceURI === attr.namespaceURI);
    if (existingAttr != null) {
      existingAttr.value = attr.value;
    }
    else {
      this.__items.push(attr);
    }
  }
  getNamedItem(attrName) {
    if (this.caseInsensitive) {
      attrName = attrName.toLowerCase();
    }
    return this.getNamedItemNS(null, attrName);
  }
  getNamedItemNS(namespaceURI, attrName) {
    namespaceURI = getNamespaceURI(namespaceURI);
    return (this.__items.find((attr) => attr.name === attrName && getNamespaceURI(attr.namespaceURI) === namespaceURI) || null);
  }
  removeNamedItem(attr) {
    this.removeNamedItemNS(attr);
  }
  removeNamedItemNS(attr) {
    for (let i = 0, ii = this.__items.length; i < ii; i++) {
      if (this.__items[i].name === attr.name && this.__items[i].namespaceURI === attr.namespaceURI) {
        this.__items.splice(i, 1);
        break;
      }
    }
  }
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({
        done: i === this.length,
        value: this.item(i++),
      }),
    };
  }
  get [Symbol.toStringTag]() {
    return 'MockAttributeMap';
  }
}
function getNamespaceURI(namespaceURI) {
  return namespaceURI === XLINK_NS ? null : namespaceURI;
}
function cloneAttributes(srcAttrs, sortByName = false) {
  const dstAttrs = new MockAttributeMap(srcAttrs.caseInsensitive);
  if (srcAttrs != null) {
    const attrLen = srcAttrs.length;
    if (sortByName && attrLen > 1) {
      const sortedAttrs = [];
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        sortedAttrs.push(dstAttr);
      }
      sortedAttrs.sort(sortAttributes).forEach((attr) => {
        dstAttrs.setNamedItemNS(attr);
      });
    }
    else {
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        dstAttrs.setNamedItemNS(dstAttr);
      }
    }
  }
  return dstAttrs;
}
function sortAttributes(a, b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}
class MockAttr {
  constructor(attrName, attrValue, namespaceURI = null) {
    this._name = attrName;
    this._value = String(attrValue);
    this._namespaceURI = namespaceURI;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = String(value);
  }
  get nodeName() {
    return this._name;
  }
  set nodeName(value) {
    this._name = value;
  }
  get nodeValue() {
    return this._value;
  }
  set nodeValue(value) {
    this._value = String(value);
  }
  get namespaceURI() {
    return this._namespaceURI;
  }
  set namespaceURI(namespaceURI) {
    this._namespaceURI = namespaceURI;
  }
}

class MockClassList {
  constructor(elm) {
    this.elm = elm;
  }
  add(...classNames) {
    const clsNames = getItems(this.elm);
    let updated = false;
    classNames.forEach((className) => {
      className = String(className);
      validateClass(className);
      if (clsNames.includes(className) === false) {
        clsNames.push(className);
        updated = true;
      }
    });
    if (updated) {
      this.elm.setAttributeNS(null, 'class', clsNames.join(' '));
    }
  }
  remove(...classNames) {
    const clsNames = getItems(this.elm);
    let updated = false;
    classNames.forEach((className) => {
      className = String(className);
      validateClass(className);
      const index = clsNames.indexOf(className);
      if (index > -1) {
        clsNames.splice(index, 1);
        updated = true;
      }
    });
    if (updated) {
      this.elm.setAttributeNS(null, 'class', clsNames.filter((c) => c.length > 0).join(' '));
    }
  }
  contains(className) {
    className = String(className);
    return getItems(this.elm).includes(className);
  }
  toggle(className) {
    className = String(className);
    if (this.contains(className) === true) {
      this.remove(className);
    }
    else {
      this.add(className);
    }
  }
  get length() {
    return getItems(this.elm).length;
  }
  item(index) {
    return getItems(this.elm)[index];
  }
  toString() {
    return getItems(this.elm).join(' ');
  }
}
function validateClass(className) {
  if (className === '') {
    throw new Error('The token provided must not be empty.');
  }
  if (/\s/.test(className)) {
    throw new Error(`The token provided ('${className}') contains HTML space characters, which are not valid in tokens.`);
  }
}
function getItems(elm) {
  const className = elm.getAttribute('class');
  if (typeof className === 'string' && className.length > 0) {
    return className
      .trim()
      .split(' ')
      .filter((c) => c.length > 0);
  }
  return [];
}

class MockCSSStyleDeclaration {
  constructor() {
    this._styles = new Map();
  }
  setProperty(prop, value) {
    prop = jsCaseToCssCase(prop);
    if (value == null || value === '') {
      this._styles.delete(prop);
    }
    else {
      this._styles.set(prop, String(value));
    }
  }
  getPropertyValue(prop) {
    prop = jsCaseToCssCase(prop);
    return String(this._styles.get(prop) || '');
  }
  removeProperty(prop) {
    prop = jsCaseToCssCase(prop);
    this._styles.delete(prop);
  }
  get length() {
    return this._styles.size;
  }
  get cssText() {
    const cssText = [];
    this._styles.forEach((value, prop) => {
      cssText.push(`${prop}: ${value};`);
    });
    return cssText.join(' ').trim();
  }
  set cssText(cssText) {
    if (cssText == null || cssText === '') {
      this._styles.clear();
      return;
    }
    cssText.split(';').forEach((rule) => {
      rule = rule.trim();
      if (rule.length > 0) {
        const splt = rule.split(':');
        if (splt.length > 1) {
          const prop = splt[0].trim();
          const value = splt.slice(1).join(':').trim();
          if (prop !== '' && value !== '') {
            this._styles.set(jsCaseToCssCase(prop), value);
          }
        }
      }
    });
  }
}
function createCSSStyleDeclaration() {
  return new Proxy(new MockCSSStyleDeclaration(), cssProxyHandler);
}
const cssProxyHandler = {
  get(cssStyle, prop) {
    if (prop in cssStyle) {
      return cssStyle[prop];
    }
    prop = cssCaseToJsCase(prop);
    return cssStyle.getPropertyValue(prop);
  },
  set(cssStyle, prop, value) {
    if (prop in cssStyle) {
      cssStyle[prop] = value;
    }
    else {
      cssStyle.setProperty(prop, value);
    }
    return true;
  },
};
function cssCaseToJsCase(str) {
  // font-size to fontSize
  if (str.length > 1 && str.includes('-') === true) {
    str = str
      .toLowerCase()
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join('');
    str = str.slice(0, 1).toLowerCase() + str.slice(1);
  }
  return str;
}
function jsCaseToCssCase(str) {
  // fontSize to font-size
  if (str.length > 1 && str.includes('-') === false && /[A-Z]/.test(str) === true) {
    str = str
      .replace(/([A-Z])/g, (g) => ' ' + g[0])
      .trim()
      .replace(/ /g, '-')
      .toLowerCase();
  }
  return str;
}

class MockCustomElementRegistry {
  constructor(win) {
    this.win = win;
  }
  define(tagName, cstr, options) {
    if (tagName.toLowerCase() !== tagName) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
    }
    if (this.__registry == null) {
      this.__registry = new Map();
    }
    this.__registry.set(tagName, { cstr, options });
    if (this.__whenDefined != null) {
      const whenDefinedResolveFns = this.__whenDefined.get(tagName);
      if (whenDefinedResolveFns != null) {
        whenDefinedResolveFns.forEach((whenDefinedResolveFn) => {
          whenDefinedResolveFn();
        });
        whenDefinedResolveFns.length = 0;
        this.__whenDefined.delete(tagName);
      }
    }
    const doc = this.win.document;
    if (doc != null) {
      const hosts = doc.querySelectorAll(tagName);
      hosts.forEach((host) => {
        if (upgradedElements.has(host) === false) {
          tempDisableCallbacks.add(doc);
          const upgradedCmp = createCustomElement(this, doc, tagName);
          for (let i = 0; i < host.childNodes.length; i++) {
            const childNode = host.childNodes[i];
            childNode.remove();
            upgradedCmp.appendChild(childNode);
          }
          tempDisableCallbacks.delete(doc);
          if (proxyElements.has(host)) {
            proxyElements.set(host, upgradedCmp);
          }
        }
        fireConnectedCallback(host);
      });
    }
  }
  get(tagName) {
    if (this.__registry != null) {
      const def = this.__registry.get(tagName.toLowerCase());
      if (def != null) {
        return def.cstr;
      }
    }
    return undefined;
  }
  upgrade(_rootNode) {
    //
  }
  clear() {
    if (this.__registry != null) {
      this.__registry.clear();
    }
    if (this.__whenDefined != null) {
      this.__whenDefined.clear();
    }
  }
  whenDefined(tagName) {
    tagName = tagName.toLowerCase();
    if (this.__registry != null && this.__registry.has(tagName) === true) {
      return Promise.resolve(this.__registry.get(tagName).cstr);
    }
    return new Promise((resolve) => {
      if (this.__whenDefined == null) {
        this.__whenDefined = new Map();
      }
      let whenDefinedResolveFns = this.__whenDefined.get(tagName);
      if (whenDefinedResolveFns == null) {
        whenDefinedResolveFns = [];
        this.__whenDefined.set(tagName, whenDefinedResolveFns);
      }
      whenDefinedResolveFns.push(resolve);
    });
  }
}
function createCustomElement(customElements, ownerDocument, tagName) {
  const Cstr = customElements.get(tagName);
  if (Cstr != null) {
    const cmp = new Cstr(ownerDocument);
    cmp.nodeName = tagName.toUpperCase();
    upgradedElements.add(cmp);
    return cmp;
  }
  const host = new Proxy({}, {
    get(obj, prop) {
      const elm = proxyElements.get(host);
      if (elm != null) {
        return elm[prop];
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      const elm = proxyElements.get(host);
      if (elm != null) {
        elm[prop] = val;
      }
      else {
        obj[prop] = val;
      }
      return true;
    },
    has(obj, prop) {
      const elm = proxyElements.get(host);
      if (prop in elm) {
        return true;
      }
      if (prop in obj) {
        return true;
      }
      return false;
    },
  });
  const elm = new MockHTMLElement(ownerDocument, tagName);
  proxyElements.set(host, elm);
  return host;
}
const proxyElements = new WeakMap();
const upgradedElements = new WeakSet();
function connectNode(ownerDocument, node) {
  node.ownerDocument = ownerDocument;
  if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
    if (ownerDocument != null && node.nodeName.includes('-')) {
      const win = ownerDocument.defaultView;
      if (win != null && typeof node.connectedCallback === 'function' && node.isConnected) {
        fireConnectedCallback(node);
      }
      const shadowRoot = node.shadowRoot;
      if (shadowRoot != null) {
        shadowRoot.childNodes.forEach((childNode) => {
          connectNode(ownerDocument, childNode);
        });
      }
    }
    node.childNodes.forEach((childNode) => {
      connectNode(ownerDocument, childNode);
    });
  }
  else {
    node.childNodes.forEach((childNode) => {
      childNode.ownerDocument = ownerDocument;
    });
  }
}
function fireConnectedCallback(node) {
  if (typeof node.connectedCallback === 'function') {
    if (tempDisableCallbacks.has(node.ownerDocument) === false) {
      try {
        node.connectedCallback();
      }
      catch (e) {
        console.error(e);
      }
    }
  }
}
function disconnectNode(node) {
  if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
    if (node.nodeName.includes('-') === true && typeof node.disconnectedCallback === 'function') {
      if (tempDisableCallbacks.has(node.ownerDocument) === false) {
        try {
          node.disconnectedCallback();
        }
        catch (e) {
          console.error(e);
        }
      }
    }
    node.childNodes.forEach(disconnectNode);
  }
}
function attributeChanged(node, attrName, oldValue, newValue) {
  attrName = attrName.toLowerCase();
  const observedAttributes = node.constructor.observedAttributes;
  if (Array.isArray(observedAttributes) === true &&
    observedAttributes.some((obs) => obs.toLowerCase() === attrName) === true) {
    try {
      node.attributeChangedCallback(attrName, oldValue, newValue);
    }
    catch (e) {
      console.error(e);
    }
  }
}
function checkAttributeChanged(node) {
  return node.nodeName.includes('-') === true && typeof node.attributeChangedCallback === 'function';
}
const tempDisableCallbacks = new Set();

function dataset(elm) {
  const ds = {};
  const attributes = elm.attributes;
  const attrLen = attributes.length;
  for (let i = 0; i < attrLen; i++) {
    const attr = attributes.item(i);
    const nodeName = attr.nodeName;
    if (nodeName.startsWith('data-')) {
      ds[dashToPascalCase(nodeName)] = attr.nodeValue;
    }
  }
  return new Proxy(ds, {
    get(_obj, camelCaseProp) {
      return ds[camelCaseProp];
    },
    set(_obj, camelCaseProp, value) {
      const dataAttr = toDataAttribute(camelCaseProp);
      elm.setAttribute(dataAttr, value);
      return true;
    },
  });
}
function toDataAttribute(str) {
  return ('data-' +
    String(str)
      .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
      .trim()
      .replace(/ /g, '-')
      .toLowerCase());
}
function dashToPascalCase(str) {
  str = String(str).slice(5);
  return str
    .split('-')
    .map((segment, index) => {
    if (index === 0) {
      return segment.charAt(0).toLowerCase() + segment.slice(1);
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  })
    .join('');
}

class MockEvent {
  constructor(type, eventInitDict) {
    this.bubbles = false;
    this.cancelBubble = false;
    this.cancelable = false;
    this.composed = false;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.srcElement = null;
    this.target = null;
    if (typeof type !== 'string') {
      throw new Error(`Event type required`);
    }
    this.type = type;
    this.timeStamp = Date.now();
    if (eventInitDict != null) {
      Object.assign(this, eventInitDict);
    }
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
  stopImmediatePropagation() {
    this.cancelBubble = true;
  }
  composedPath() {
    const composedPath = [];
    let currentElement = this.target;
    while (currentElement) {
      composedPath.push(currentElement);
      if (!currentElement.parentElement && currentElement.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
        // the current element doesn't have a parent, but we've detected it's our root document node. push the window
        // object associated with the document onto the path
        composedPath.push(currentElement.defaultView);
        break;
      }
      currentElement = currentElement.parentElement;
    }
    return composedPath;
  }
}
class MockCustomEvent extends MockEvent {
  constructor(type, customEventInitDic) {
    super(type);
    this.detail = null;
    if (customEventInitDic != null) {
      Object.assign(this, customEventInitDic);
    }
  }
}
class MockKeyboardEvent extends MockEvent {
  constructor(type, keyboardEventInitDic) {
    super(type);
    this.code = '';
    this.key = '';
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;
    this.location = 0;
    this.repeat = false;
    if (keyboardEventInitDic != null) {
      Object.assign(this, keyboardEventInitDic);
    }
  }
}
class MockMouseEvent extends MockEvent {
  constructor(type, mouseEventInitDic) {
    super(type);
    this.screenX = 0;
    this.screenY = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.altKey = false;
    this.metaKey = false;
    this.button = 0;
    this.buttons = 0;
    this.relatedTarget = null;
    if (mouseEventInitDic != null) {
      Object.assign(this, mouseEventInitDic);
    }
  }
}
class MockUIEvent extends MockEvent {
  constructor(type, uiEventInitDic) {
    super(type);
    this.detail = null;
    this.view = null;
    if (uiEventInitDic != null) {
      Object.assign(this, uiEventInitDic);
    }
  }
}
class MockFocusEvent extends MockUIEvent {
  constructor(type, focusEventInitDic) {
    super(type);
    this.relatedTarget = null;
    if (focusEventInitDic != null) {
      Object.assign(this, focusEventInitDic);
    }
  }
}
class MockEventListener {
  constructor(type, handler) {
    this.type = type;
    this.handler = handler;
  }
}
function addEventListener(elm, type, handler) {
  const target = elm;
  if (target.__listeners == null) {
    target.__listeners = [];
  }
  target.__listeners.push(new MockEventListener(type, handler));
}
function removeEventListener(elm, type, handler) {
  const target = elm;
  if (target != null && Array.isArray(target.__listeners) === true) {
    const elmListener = target.__listeners.find((e) => e.type === type && e.handler === handler);
    if (elmListener != null) {
      const index = target.__listeners.indexOf(elmListener);
      target.__listeners.splice(index, 1);
    }
  }
}
function resetEventListeners(target) {
  if (target != null && target.__listeners != null) {
    target.__listeners = null;
  }
}
function triggerEventListener(elm, ev) {
  if (elm == null || ev.cancelBubble === true) {
    return;
  }
  const target = elm;
  ev.currentTarget = elm;
  if (Array.isArray(target.__listeners) === true) {
    const listeners = target.__listeners.filter((e) => e.type === ev.type);
    listeners.forEach((listener) => {
      try {
        listener.handler.call(target, ev);
      }
      catch (err) {
        console.error(err);
      }
    });
  }
  if (ev.bubbles === false) {
    return;
  }
  if (elm.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
    triggerEventListener(elm.defaultView, ev);
  }
  else {
    triggerEventListener(elm.parentElement, ev);
  }
}
function dispatchEvent(currentTarget, ev) {
  ev.target = currentTarget;
  triggerEventListener(currentTarget, ev);
  return true;
}

// Parse5 7.1.2
const e=function(e){const t=new Set([65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111]),s="�";var a;!function(e){e[e.EOF=-1]="EOF",e[e.NULL=0]="NULL",e[e.TABULATION=9]="TABULATION",e[e.CARRIAGE_RETURN=13]="CARRIAGE_RETURN",e[e.LINE_FEED=10]="LINE_FEED",e[e.FORM_FEED=12]="FORM_FEED",e[e.SPACE=32]="SPACE",e[e.EXCLAMATION_MARK=33]="EXCLAMATION_MARK",e[e.QUOTATION_MARK=34]="QUOTATION_MARK",e[e.NUMBER_SIGN=35]="NUMBER_SIGN",e[e.AMPERSAND=38]="AMPERSAND",e[e.APOSTROPHE=39]="APOSTROPHE",e[e.HYPHEN_MINUS=45]="HYPHEN_MINUS",e[e.SOLIDUS=47]="SOLIDUS",e[e.DIGIT_0=48]="DIGIT_0",e[e.DIGIT_9=57]="DIGIT_9",e[e.SEMICOLON=59]="SEMICOLON",e[e.LESS_THAN_SIGN=60]="LESS_THAN_SIGN",e[e.EQUALS_SIGN=61]="EQUALS_SIGN",e[e.GREATER_THAN_SIGN=62]="GREATER_THAN_SIGN",e[e.QUESTION_MARK=63]="QUESTION_MARK",e[e.LATIN_CAPITAL_A=65]="LATIN_CAPITAL_A",e[e.LATIN_CAPITAL_F=70]="LATIN_CAPITAL_F",e[e.LATIN_CAPITAL_X=88]="LATIN_CAPITAL_X",e[e.LATIN_CAPITAL_Z=90]="LATIN_CAPITAL_Z",e[e.RIGHT_SQUARE_BRACKET=93]="RIGHT_SQUARE_BRACKET",e[e.GRAVE_ACCENT=96]="GRAVE_ACCENT",e[e.LATIN_SMALL_A=97]="LATIN_SMALL_A",e[e.LATIN_SMALL_F=102]="LATIN_SMALL_F",e[e.LATIN_SMALL_X=120]="LATIN_SMALL_X",e[e.LATIN_SMALL_Z=122]="LATIN_SMALL_Z",e[e.REPLACEMENT_CHARACTER=65533]="REPLACEMENT_CHARACTER";}(a=a||(a={}));const r="[CDATA[",n="doctype",i="script";function o(e){return e>=55296&&e<=57343}function c(e){return 32!==e&&10!==e&&13!==e&&9!==e&&12!==e&&e>=1&&e<=31||e>=127&&e<=159}function E(e){return e>=64976&&e<=65007||t.has(e)}var T,h;!function(e){e.controlCharacterInInputStream="control-character-in-input-stream",e.noncharacterInInputStream="noncharacter-in-input-stream",e.surrogateInInputStream="surrogate-in-input-stream",e.nonVoidHtmlElementStartTagWithTrailingSolidus="non-void-html-element-start-tag-with-trailing-solidus",e.endTagWithAttributes="end-tag-with-attributes",e.endTagWithTrailingSolidus="end-tag-with-trailing-solidus",e.unexpectedSolidusInTag="unexpected-solidus-in-tag",e.unexpectedNullCharacter="unexpected-null-character",e.unexpectedQuestionMarkInsteadOfTagName="unexpected-question-mark-instead-of-tag-name",e.invalidFirstCharacterOfTagName="invalid-first-character-of-tag-name",e.unexpectedEqualsSignBeforeAttributeName="unexpected-equals-sign-before-attribute-name",e.missingEndTagName="missing-end-tag-name",e.unexpectedCharacterInAttributeName="unexpected-character-in-attribute-name",e.unknownNamedCharacterReference="unknown-named-character-reference",e.missingSemicolonAfterCharacterReference="missing-semicolon-after-character-reference",e.unexpectedCharacterAfterDoctypeSystemIdentifier="unexpected-character-after-doctype-system-identifier",e.unexpectedCharacterInUnquotedAttributeValue="unexpected-character-in-unquoted-attribute-value",e.eofBeforeTagName="eof-before-tag-name",e.eofInTag="eof-in-tag",e.missingAttributeValue="missing-attribute-value",e.missingWhitespaceBetweenAttributes="missing-whitespace-between-attributes",e.missingWhitespaceAfterDoctypePublicKeyword="missing-whitespace-after-doctype-public-keyword",e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers="missing-whitespace-between-doctype-public-and-system-identifiers",e.missingWhitespaceAfterDoctypeSystemKeyword="missing-whitespace-after-doctype-system-keyword",e.missingQuoteBeforeDoctypePublicIdentifier="missing-quote-before-doctype-public-identifier",e.missingQuoteBeforeDoctypeSystemIdentifier="missing-quote-before-doctype-system-identifier",e.missingDoctypePublicIdentifier="missing-doctype-public-identifier",e.missingDoctypeSystemIdentifier="missing-doctype-system-identifier",e.abruptDoctypePublicIdentifier="abrupt-doctype-public-identifier",e.abruptDoctypeSystemIdentifier="abrupt-doctype-system-identifier",e.cdataInHtmlContent="cdata-in-html-content",e.incorrectlyOpenedComment="incorrectly-opened-comment",e.eofInScriptHtmlCommentLikeText="eof-in-script-html-comment-like-text",e.eofInDoctype="eof-in-doctype",e.nestedComment="nested-comment",e.abruptClosingOfEmptyComment="abrupt-closing-of-empty-comment",e.eofInComment="eof-in-comment",e.incorrectlyClosedComment="incorrectly-closed-comment",e.eofInCdata="eof-in-cdata",e.absenceOfDigitsInNumericCharacterReference="absence-of-digits-in-numeric-character-reference",e.nullCharacterReference="null-character-reference",e.surrogateCharacterReference="surrogate-character-reference",e.characterReferenceOutsideUnicodeRange="character-reference-outside-unicode-range",e.controlCharacterReference="control-character-reference",e.noncharacterCharacterReference="noncharacter-character-reference",e.missingWhitespaceBeforeDoctypeName="missing-whitespace-before-doctype-name",e.missingDoctypeName="missing-doctype-name",e.invalidCharacterSequenceAfterDoctypeName="invalid-character-sequence-after-doctype-name",e.duplicateAttribute="duplicate-attribute",e.nonConformingDoctype="non-conforming-doctype",e.missingDoctype="missing-doctype",e.misplacedDoctype="misplaced-doctype",e.endTagWithoutMatchingOpenElement="end-tag-without-matching-open-element",e.closingOfElementWithOpenChildElements="closing-of-element-with-open-child-elements",e.disallowedContentInNoscriptInHead="disallowed-content-in-noscript-in-head",e.openElementsLeftAfterEof="open-elements-left-after-eof",e.abandonedHeadElementChild="abandoned-head-element-child",e.misplacedStartTagForHeadElement="misplaced-start-tag-for-head-element",e.nestedNoscriptInHead="nested-noscript-in-head",e.eofInElementThatCanContainOnlyText="eof-in-element-that-can-contain-only-text";}(T=T||(T={}));class _{constructor(e){this.handler=e,this.html="",this.pos=-1,this.lastGapPos=-2,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=65536,this.isEol=!1,this.lineStartPos=0,this.droppedBufferSize=0,this.line=1,this.lastErrOffset=-1;}get col(){return this.pos-this.lineStartPos+Number(this.lastGapPos!==this.pos)}get offset(){return this.droppedBufferSize+this.pos}getError(e){const{line:t,col:s,offset:a}=this;return {code:e,startLine:t,endLine:t,startCol:s,endCol:s,startOffset:a,endOffset:a}}_err(e){this.handler.onParseError&&this.lastErrOffset!==this.offset&&(this.lastErrOffset=this.offset,this.handler.onParseError(this.getError(e)));}_addGap(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos;}_processSurrogate(e){if(this.pos!==this.html.length-1){const t=this.html.charCodeAt(this.pos+1);if(function(e){return e>=56320&&e<=57343}(t))return this.pos++,this._addGap(),1024*(e-55296)+9216+t}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,a.EOF;return this._err(T.surrogateInInputStream),e}willDropParsedChunk(){return this.pos>this.bufferWaterline}dropParsedChunk(){this.willDropParsedChunk()&&(this.html=this.html.substring(this.pos),this.lineStartPos-=this.pos,this.droppedBufferSize+=this.pos,this.pos=0,this.lastGapPos=-2,this.gapStack.length=0);}write(e,t){this.html.length>0?this.html+=e:this.html=e,this.endOfChunkHit=!1,this.lastChunkWritten=t;}insertHtmlAtCurrentPos(e){this.html=this.html.substring(0,this.pos+1)+e+this.html.substring(this.pos+1),this.endOfChunkHit=!1;}startsWith(e,t){if(this.pos+e.length>this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,!1;if(t)return this.html.startsWith(e,this.pos);for(let t=0;t<e.length;t++)if((32|this.html.charCodeAt(this.pos+t))!==e.charCodeAt(t))return !1;return !0}peek(e){const t=this.pos+e;if(t>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,a.EOF;const s=this.html.charCodeAt(t);return s===a.CARRIAGE_RETURN?a.LINE_FEED:s}advance(){if(this.pos++,this.isEol&&(this.isEol=!1,this.line++,this.lineStartPos=this.pos),this.pos>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,a.EOF;let e=this.html.charCodeAt(this.pos);return e===a.CARRIAGE_RETURN?(this.isEol=!0,this.skipNextNewLine=!0,a.LINE_FEED):e===a.LINE_FEED&&(this.isEol=!0,this.skipNextNewLine)?(this.line--,this.skipNextNewLine=!1,this._addGap(),this.advance()):(this.skipNextNewLine=!1,o(e)&&(e=this._processSurrogate(e)),null===this.handler.onParseError||e>31&&e<127||e===a.LINE_FEED||e===a.CARRIAGE_RETURN||e>159&&e<64976||this._checkForProblematicCharacters(e),e)}_checkForProblematicCharacters(e){c(e)?this._err(T.controlCharacterInInputStream):E(e)&&this._err(T.noncharacterInInputStream);}retreat(e){for(this.pos-=e;this.pos<this.lastGapPos;)this.lastGapPos=this.gapStack.pop(),this.pos--;this.isEol=!1;}}function A(e,t){for(let s=e.attrs.length-1;s>=0;s--)if(e.attrs[s].name===t)return e.attrs[s].value;return null}!function(e){e[e.CHARACTER=0]="CHARACTER",e[e.NULL_CHARACTER=1]="NULL_CHARACTER",e[e.WHITESPACE_CHARACTER=2]="WHITESPACE_CHARACTER",e[e.START_TAG=3]="START_TAG",e[e.END_TAG=4]="END_TAG",e[e.COMMENT=5]="COMMENT",e[e.DOCTYPE=6]="DOCTYPE",e[e.EOF=7]="EOF",e[e.HIBERNATION=8]="HIBERNATION";}(h=h||(h={}));var l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function m(e,t,s){return e(s={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&s.path)}},s.exports),s.exports}var p,d,I,N,u,C=m((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=new Uint16Array('ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((function(e){return e.charCodeAt(0)})));})),D=m((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=new Uint16Array("Ȁaglq\tɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((function(e){return e.charCodeAt(0)})));})),S=m((function(e,t){var s;Object.defineProperty(t,"__esModule",{value:!0}),t.replaceCodePoint=t.fromCodePoint=void 0;var a=new Map([[0,65533],[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);function r(e){var t;return e>=55296&&e<=57343||e>1114111?65533:null!==(t=a.get(e))&&void 0!==t?t:e}t.fromCodePoint=null!==(s=String.fromCodePoint)&&void 0!==s?s:function(e){var t="";return e>65535&&(e-=65536,t+=String.fromCharCode(e>>>10&1023|55296),e=56320|1023&e),t+String.fromCharCode(e)},t.replaceCodePoint=r,t.default=function(e){return (0, t.fromCodePoint)(r(e))};})),R=m((function(e,t){var s=l&&l.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.decodeXML=t.decodeHTMLStrict=t.decodeHTML=t.determineBranch=t.BinTrieFlags=t.fromCodePoint=t.replaceCodePoint=t.decodeCodePoint=t.xmlDecodeTree=t.htmlDecodeTree=void 0;var a=s(C);t.htmlDecodeTree=a.default;var r=s(D);t.xmlDecodeTree=r.default;var n=s(S);t.decodeCodePoint=n.default;var i,o,c=S;function E(e){return function(t,s){for(var a="",r=0,c=0;(c=t.indexOf("&",c))>=0;)if(a+=t.slice(r,c),r=c,c+=1,t.charCodeAt(c)!==i.NUM){for(var E=0,h=1,_=0,A=e[_];c<t.length&&!((_=T(e,A,_+1,t.charCodeAt(c)))<0);c++,h++){var l=(A=e[_])&o.VALUE_LENGTH;if(l){var m;if(s&&t.charCodeAt(c)!==i.SEMI||(E=_,h=0),0==(m=(l>>14)-1))break;_+=m;}}0!==E&&(a+=1==(m=(e[E]&o.VALUE_LENGTH)>>14)?String.fromCharCode(e[E]&~o.VALUE_LENGTH):2===m?String.fromCharCode(e[E+1]):String.fromCharCode(e[E+1],e[E+2]),r=c-h+1);}else {var p=c+1,d=10,I=t.charCodeAt(p);(I|i.To_LOWER_BIT)===i.LOWER_X&&(d=16,c+=1,p+=1);do{I=t.charCodeAt(++c);}while(I>=i.ZERO&&I<=i.NINE||16===d&&(I|i.To_LOWER_BIT)>=i.LOWER_A&&(I|i.To_LOWER_BIT)<=i.LOWER_F);if(p!==c){var N=t.substring(p,c),u=parseInt(N,d);if(t.charCodeAt(c)===i.SEMI)c+=1;else if(s)continue;a+=(0, n.default)(u),r=c;}}return a+t.slice(r)}}function T(e,t,s,a){var r=(t&o.BRANCH_LENGTH)>>7,n=t&o.JUMP_TABLE;if(0===r)return 0!==n&&a===n?s:-1;if(n){var i=a-n;return i<0||i>=r?-1:e[s+i]-1}for(var c=s,E=c+r-1;c<=E;){var T=c+E>>>1,h=e[T];if(h<a)c=T+1;else {if(!(h>a))return e[T+r];E=T-1;}}return -1}Object.defineProperty(t,"replaceCodePoint",{enumerable:!0,get:function(){return c.replaceCodePoint}}),Object.defineProperty(t,"fromCodePoint",{enumerable:!0,get:function(){return c.fromCodePoint}}),function(e){e[e.NUM=35]="NUM",e[e.SEMI=59]="SEMI",e[e.ZERO=48]="ZERO",e[e.NINE=57]="NINE",e[e.LOWER_A=97]="LOWER_A",e[e.LOWER_F=102]="LOWER_F",e[e.LOWER_X=120]="LOWER_X",e[e.To_LOWER_BIT=32]="To_LOWER_BIT";}(i||(i={})),function(e){e[e.VALUE_LENGTH=49152]="VALUE_LENGTH",e[e.BRANCH_LENGTH=16256]="BRANCH_LENGTH",e[e.JUMP_TABLE=127]="JUMP_TABLE";}(o=t.BinTrieFlags||(t.BinTrieFlags={})),t.determineBranch=T;var h=E(a.default),_=E(r.default);t.decodeHTML=function(e){return h(e,!1)},t.decodeHTMLStrict=function(e){return h(e,!0)},t.decodeXML=function(e){return _(e,!0)};}));!function(e){e.HTML="http://www.w3.org/1999/xhtml",e.MATHML="http://www.w3.org/1998/Math/MathML",e.SVG="http://www.w3.org/2000/svg",e.XLINK="http://www.w3.org/1999/xlink",e.XML="http://www.w3.org/XML/1998/namespace",e.XMLNS="http://www.w3.org/2000/xmlns/";}(p=p||(p={})),function(e){e.TYPE="type",e.ACTION="action",e.ENCODING="encoding",e.PROMPT="prompt",e.NAME="name",e.COLOR="color",e.FACE="face",e.SIZE="size";}(d=d||(d={})),function(e){e.NO_QUIRKS="no-quirks",e.QUIRKS="quirks",e.LIMITED_QUIRKS="limited-quirks";}(I=I||(I={})),function(e){e.A="a",e.ADDRESS="address",e.ANNOTATION_XML="annotation-xml",e.APPLET="applet",e.AREA="area",e.ARTICLE="article",e.ASIDE="aside",e.B="b",e.BASE="base",e.BASEFONT="basefont",e.BGSOUND="bgsound",e.BIG="big",e.BLOCKQUOTE="blockquote",e.BODY="body",e.BR="br",e.BUTTON="button",e.CAPTION="caption",e.CENTER="center",e.CODE="code",e.COL="col",e.COLGROUP="colgroup",e.DD="dd",e.DESC="desc",e.DETAILS="details",e.DIALOG="dialog",e.DIR="dir",e.DIV="div",e.DL="dl",e.DT="dt",e.EM="em",e.EMBED="embed",e.FIELDSET="fieldset",e.FIGCAPTION="figcaption",e.FIGURE="figure",e.FONT="font",e.FOOTER="footer",e.FOREIGN_OBJECT="foreignObject",e.FORM="form",e.FRAME="frame",e.FRAMESET="frameset",e.H1="h1",e.H2="h2",e.H3="h3",e.H4="h4",e.H5="h5",e.H6="h6",e.HEAD="head",e.HEADER="header",e.HGROUP="hgroup",e.HR="hr",e.HTML="html",e.I="i",e.IMG="img",e.IMAGE="image",e.INPUT="input",e.IFRAME="iframe",e.KEYGEN="keygen",e.LABEL="label",e.LI="li",e.LINK="link",e.LISTING="listing",e.MAIN="main",e.MALIGNMARK="malignmark",e.MARQUEE="marquee",e.MATH="math",e.MENU="menu",e.META="meta",e.MGLYPH="mglyph",e.MI="mi",e.MO="mo",e.MN="mn",e.MS="ms",e.MTEXT="mtext",e.NAV="nav",e.NOBR="nobr",e.NOFRAMES="noframes",e.NOEMBED="noembed",e.NOSCRIPT="noscript",e.OBJECT="object",e.OL="ol",e.OPTGROUP="optgroup",e.OPTION="option",e.P="p",e.PARAM="param",e.PLAINTEXT="plaintext",e.PRE="pre",e.RB="rb",e.RP="rp",e.RT="rt",e.RTC="rtc",e.RUBY="ruby",e.S="s",e.SCRIPT="script",e.SECTION="section",e.SELECT="select",e.SOURCE="source",e.SMALL="small",e.SPAN="span",e.STRIKE="strike",e.STRONG="strong",e.STYLE="style",e.SUB="sub",e.SUMMARY="summary",e.SUP="sup",e.TABLE="table",e.TBODY="tbody",e.TEMPLATE="template",e.TEXTAREA="textarea",e.TFOOT="tfoot",e.TD="td",e.TH="th",e.THEAD="thead",e.TITLE="title",e.TR="tr",e.TRACK="track",e.TT="tt",e.U="u",e.UL="ul",e.SVG="svg",e.VAR="var",e.WBR="wbr",e.XMP="xmp";}(N=N||(N={})),function(e){e[e.UNKNOWN=0]="UNKNOWN",e[e.A=1]="A",e[e.ADDRESS=2]="ADDRESS",e[e.ANNOTATION_XML=3]="ANNOTATION_XML",e[e.APPLET=4]="APPLET",e[e.AREA=5]="AREA",e[e.ARTICLE=6]="ARTICLE",e[e.ASIDE=7]="ASIDE",e[e.B=8]="B",e[e.BASE=9]="BASE",e[e.BASEFONT=10]="BASEFONT",e[e.BGSOUND=11]="BGSOUND",e[e.BIG=12]="BIG",e[e.BLOCKQUOTE=13]="BLOCKQUOTE",e[e.BODY=14]="BODY",e[e.BR=15]="BR",e[e.BUTTON=16]="BUTTON",e[e.CAPTION=17]="CAPTION",e[e.CENTER=18]="CENTER",e[e.CODE=19]="CODE",e[e.COL=20]="COL",e[e.COLGROUP=21]="COLGROUP",e[e.DD=22]="DD",e[e.DESC=23]="DESC",e[e.DETAILS=24]="DETAILS",e[e.DIALOG=25]="DIALOG",e[e.DIR=26]="DIR",e[e.DIV=27]="DIV",e[e.DL=28]="DL",e[e.DT=29]="DT",e[e.EM=30]="EM",e[e.EMBED=31]="EMBED",e[e.FIELDSET=32]="FIELDSET",e[e.FIGCAPTION=33]="FIGCAPTION",e[e.FIGURE=34]="FIGURE",e[e.FONT=35]="FONT",e[e.FOOTER=36]="FOOTER",e[e.FOREIGN_OBJECT=37]="FOREIGN_OBJECT",e[e.FORM=38]="FORM",e[e.FRAME=39]="FRAME",e[e.FRAMESET=40]="FRAMESET",e[e.H1=41]="H1",e[e.H2=42]="H2",e[e.H3=43]="H3",e[e.H4=44]="H4",e[e.H5=45]="H5",e[e.H6=46]="H6",e[e.HEAD=47]="HEAD",e[e.HEADER=48]="HEADER",e[e.HGROUP=49]="HGROUP",e[e.HR=50]="HR",e[e.HTML=51]="HTML",e[e.I=52]="I",e[e.IMG=53]="IMG",e[e.IMAGE=54]="IMAGE",e[e.INPUT=55]="INPUT",e[e.IFRAME=56]="IFRAME",e[e.KEYGEN=57]="KEYGEN",e[e.LABEL=58]="LABEL",e[e.LI=59]="LI",e[e.LINK=60]="LINK",e[e.LISTING=61]="LISTING",e[e.MAIN=62]="MAIN",e[e.MALIGNMARK=63]="MALIGNMARK",e[e.MARQUEE=64]="MARQUEE",e[e.MATH=65]="MATH",e[e.MENU=66]="MENU",e[e.META=67]="META",e[e.MGLYPH=68]="MGLYPH",e[e.MI=69]="MI",e[e.MO=70]="MO",e[e.MN=71]="MN",e[e.MS=72]="MS",e[e.MTEXT=73]="MTEXT",e[e.NAV=74]="NAV",e[e.NOBR=75]="NOBR",e[e.NOFRAMES=76]="NOFRAMES",e[e.NOEMBED=77]="NOEMBED",e[e.NOSCRIPT=78]="NOSCRIPT",e[e.OBJECT=79]="OBJECT",e[e.OL=80]="OL",e[e.OPTGROUP=81]="OPTGROUP",e[e.OPTION=82]="OPTION",e[e.P=83]="P",e[e.PARAM=84]="PARAM",e[e.PLAINTEXT=85]="PLAINTEXT",e[e.PRE=86]="PRE",e[e.RB=87]="RB",e[e.RP=88]="RP",e[e.RT=89]="RT",e[e.RTC=90]="RTC",e[e.RUBY=91]="RUBY",e[e.S=92]="S",e[e.SCRIPT=93]="SCRIPT",e[e.SECTION=94]="SECTION",e[e.SELECT=95]="SELECT",e[e.SOURCE=96]="SOURCE",e[e.SMALL=97]="SMALL",e[e.SPAN=98]="SPAN",e[e.STRIKE=99]="STRIKE",e[e.STRONG=100]="STRONG",e[e.STYLE=101]="STYLE",e[e.SUB=102]="SUB",e[e.SUMMARY=103]="SUMMARY",e[e.SUP=104]="SUP",e[e.TABLE=105]="TABLE",e[e.TBODY=106]="TBODY",e[e.TEMPLATE=107]="TEMPLATE",e[e.TEXTAREA=108]="TEXTAREA",e[e.TFOOT=109]="TFOOT",e[e.TD=110]="TD",e[e.TH=111]="TH",e[e.THEAD=112]="THEAD",e[e.TITLE=113]="TITLE",e[e.TR=114]="TR",e[e.TRACK=115]="TRACK",e[e.TT=116]="TT",e[e.U=117]="U",e[e.UL=118]="UL",e[e.SVG=119]="SVG",e[e.VAR=120]="VAR",e[e.WBR=121]="WBR",e[e.XMP=122]="XMP";}(u=u||(u={}));const O=new Map([[N.A,u.A],[N.ADDRESS,u.ADDRESS],[N.ANNOTATION_XML,u.ANNOTATION_XML],[N.APPLET,u.APPLET],[N.AREA,u.AREA],[N.ARTICLE,u.ARTICLE],[N.ASIDE,u.ASIDE],[N.B,u.B],[N.BASE,u.BASE],[N.BASEFONT,u.BASEFONT],[N.BGSOUND,u.BGSOUND],[N.BIG,u.BIG],[N.BLOCKQUOTE,u.BLOCKQUOTE],[N.BODY,u.BODY],[N.BR,u.BR],[N.BUTTON,u.BUTTON],[N.CAPTION,u.CAPTION],[N.CENTER,u.CENTER],[N.CODE,u.CODE],[N.COL,u.COL],[N.COLGROUP,u.COLGROUP],[N.DD,u.DD],[N.DESC,u.DESC],[N.DETAILS,u.DETAILS],[N.DIALOG,u.DIALOG],[N.DIR,u.DIR],[N.DIV,u.DIV],[N.DL,u.DL],[N.DT,u.DT],[N.EM,u.EM],[N.EMBED,u.EMBED],[N.FIELDSET,u.FIELDSET],[N.FIGCAPTION,u.FIGCAPTION],[N.FIGURE,u.FIGURE],[N.FONT,u.FONT],[N.FOOTER,u.FOOTER],[N.FOREIGN_OBJECT,u.FOREIGN_OBJECT],[N.FORM,u.FORM],[N.FRAME,u.FRAME],[N.FRAMESET,u.FRAMESET],[N.H1,u.H1],[N.H2,u.H2],[N.H3,u.H3],[N.H4,u.H4],[N.H5,u.H5],[N.H6,u.H6],[N.HEAD,u.HEAD],[N.HEADER,u.HEADER],[N.HGROUP,u.HGROUP],[N.HR,u.HR],[N.HTML,u.HTML],[N.I,u.I],[N.IMG,u.IMG],[N.IMAGE,u.IMAGE],[N.INPUT,u.INPUT],[N.IFRAME,u.IFRAME],[N.KEYGEN,u.KEYGEN],[N.LABEL,u.LABEL],[N.LI,u.LI],[N.LINK,u.LINK],[N.LISTING,u.LISTING],[N.MAIN,u.MAIN],[N.MALIGNMARK,u.MALIGNMARK],[N.MARQUEE,u.MARQUEE],[N.MATH,u.MATH],[N.MENU,u.MENU],[N.META,u.META],[N.MGLYPH,u.MGLYPH],[N.MI,u.MI],[N.MO,u.MO],[N.MN,u.MN],[N.MS,u.MS],[N.MTEXT,u.MTEXT],[N.NAV,u.NAV],[N.NOBR,u.NOBR],[N.NOFRAMES,u.NOFRAMES],[N.NOEMBED,u.NOEMBED],[N.NOSCRIPT,u.NOSCRIPT],[N.OBJECT,u.OBJECT],[N.OL,u.OL],[N.OPTGROUP,u.OPTGROUP],[N.OPTION,u.OPTION],[N.P,u.P],[N.PARAM,u.PARAM],[N.PLAINTEXT,u.PLAINTEXT],[N.PRE,u.PRE],[N.RB,u.RB],[N.RP,u.RP],[N.RT,u.RT],[N.RTC,u.RTC],[N.RUBY,u.RUBY],[N.S,u.S],[N.SCRIPT,u.SCRIPT],[N.SECTION,u.SECTION],[N.SELECT,u.SELECT],[N.SOURCE,u.SOURCE],[N.SMALL,u.SMALL],[N.SPAN,u.SPAN],[N.STRIKE,u.STRIKE],[N.STRONG,u.STRONG],[N.STYLE,u.STYLE],[N.SUB,u.SUB],[N.SUMMARY,u.SUMMARY],[N.SUP,u.SUP],[N.TABLE,u.TABLE],[N.TBODY,u.TBODY],[N.TEMPLATE,u.TEMPLATE],[N.TEXTAREA,u.TEXTAREA],[N.TFOOT,u.TFOOT],[N.TD,u.TD],[N.TH,u.TH],[N.THEAD,u.THEAD],[N.TITLE,u.TITLE],[N.TR,u.TR],[N.TRACK,u.TRACK],[N.TT,u.TT],[N.U,u.U],[N.UL,u.UL],[N.SVG,u.SVG],[N.VAR,u.VAR],[N.WBR,u.WBR],[N.XMP,u.XMP]]);function f(e){var t;return null!==(t=O.get(e))&&void 0!==t?t:u.UNKNOWN}const L=u,g={[p.HTML]:new Set([L.ADDRESS,L.APPLET,L.AREA,L.ARTICLE,L.ASIDE,L.BASE,L.BASEFONT,L.BGSOUND,L.BLOCKQUOTE,L.BODY,L.BR,L.BUTTON,L.CAPTION,L.CENTER,L.COL,L.COLGROUP,L.DD,L.DETAILS,L.DIR,L.DIV,L.DL,L.DT,L.EMBED,L.FIELDSET,L.FIGCAPTION,L.FIGURE,L.FOOTER,L.FORM,L.FRAME,L.FRAMESET,L.H1,L.H2,L.H3,L.H4,L.H5,L.H6,L.HEAD,L.HEADER,L.HGROUP,L.HR,L.HTML,L.IFRAME,L.IMG,L.INPUT,L.LI,L.LINK,L.LISTING,L.MAIN,L.MARQUEE,L.MENU,L.META,L.NAV,L.NOEMBED,L.NOFRAMES,L.NOSCRIPT,L.OBJECT,L.OL,L.P,L.PARAM,L.PLAINTEXT,L.PRE,L.SCRIPT,L.SECTION,L.SELECT,L.SOURCE,L.STYLE,L.SUMMARY,L.TABLE,L.TBODY,L.TD,L.TEMPLATE,L.TEXTAREA,L.TFOOT,L.TH,L.THEAD,L.TITLE,L.TR,L.TRACK,L.UL,L.WBR,L.XMP]),[p.MATHML]:new Set([L.MI,L.MO,L.MN,L.MS,L.MTEXT,L.ANNOTATION_XML]),[p.SVG]:new Set([L.TITLE,L.FOREIGN_OBJECT,L.DESC]),[p.XLINK]:new Set,[p.XML]:new Set,[p.XMLNS]:new Set};function M(e){return e===L.H1||e===L.H2||e===L.H3||e===L.H4||e===L.H5||e===L.H6}new Set([N.STYLE,N.SCRIPT,N.XMP,N.IFRAME,N.NOEMBED,N.NOFRAMES,N.PLAINTEXT]);const k=new Map([[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);var P;!function(e){e[e.DATA=0]="DATA",e[e.RCDATA=1]="RCDATA",e[e.RAWTEXT=2]="RAWTEXT",e[e.SCRIPT_DATA=3]="SCRIPT_DATA",e[e.PLAINTEXT=4]="PLAINTEXT",e[e.TAG_OPEN=5]="TAG_OPEN",e[e.END_TAG_OPEN=6]="END_TAG_OPEN",e[e.TAG_NAME=7]="TAG_NAME",e[e.RCDATA_LESS_THAN_SIGN=8]="RCDATA_LESS_THAN_SIGN",e[e.RCDATA_END_TAG_OPEN=9]="RCDATA_END_TAG_OPEN",e[e.RCDATA_END_TAG_NAME=10]="RCDATA_END_TAG_NAME",e[e.RAWTEXT_LESS_THAN_SIGN=11]="RAWTEXT_LESS_THAN_SIGN",e[e.RAWTEXT_END_TAG_OPEN=12]="RAWTEXT_END_TAG_OPEN",e[e.RAWTEXT_END_TAG_NAME=13]="RAWTEXT_END_TAG_NAME",e[e.SCRIPT_DATA_LESS_THAN_SIGN=14]="SCRIPT_DATA_LESS_THAN_SIGN",e[e.SCRIPT_DATA_END_TAG_OPEN=15]="SCRIPT_DATA_END_TAG_OPEN",e[e.SCRIPT_DATA_END_TAG_NAME=16]="SCRIPT_DATA_END_TAG_NAME",e[e.SCRIPT_DATA_ESCAPE_START=17]="SCRIPT_DATA_ESCAPE_START",e[e.SCRIPT_DATA_ESCAPE_START_DASH=18]="SCRIPT_DATA_ESCAPE_START_DASH",e[e.SCRIPT_DATA_ESCAPED=19]="SCRIPT_DATA_ESCAPED",e[e.SCRIPT_DATA_ESCAPED_DASH=20]="SCRIPT_DATA_ESCAPED_DASH",e[e.SCRIPT_DATA_ESCAPED_DASH_DASH=21]="SCRIPT_DATA_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN=22]="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN=23]="SCRIPT_DATA_ESCAPED_END_TAG_OPEN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME=24]="SCRIPT_DATA_ESCAPED_END_TAG_NAME",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START=25]="SCRIPT_DATA_DOUBLE_ESCAPE_START",e[e.SCRIPT_DATA_DOUBLE_ESCAPED=26]="SCRIPT_DATA_DOUBLE_ESCAPED",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH=27]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH=28]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN=29]="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END=30]="SCRIPT_DATA_DOUBLE_ESCAPE_END",e[e.BEFORE_ATTRIBUTE_NAME=31]="BEFORE_ATTRIBUTE_NAME",e[e.ATTRIBUTE_NAME=32]="ATTRIBUTE_NAME",e[e.AFTER_ATTRIBUTE_NAME=33]="AFTER_ATTRIBUTE_NAME",e[e.BEFORE_ATTRIBUTE_VALUE=34]="BEFORE_ATTRIBUTE_VALUE",e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED=35]="ATTRIBUTE_VALUE_DOUBLE_QUOTED",e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED=36]="ATTRIBUTE_VALUE_SINGLE_QUOTED",e[e.ATTRIBUTE_VALUE_UNQUOTED=37]="ATTRIBUTE_VALUE_UNQUOTED",e[e.AFTER_ATTRIBUTE_VALUE_QUOTED=38]="AFTER_ATTRIBUTE_VALUE_QUOTED",e[e.SELF_CLOSING_START_TAG=39]="SELF_CLOSING_START_TAG",e[e.BOGUS_COMMENT=40]="BOGUS_COMMENT",e[e.MARKUP_DECLARATION_OPEN=41]="MARKUP_DECLARATION_OPEN",e[e.COMMENT_START=42]="COMMENT_START",e[e.COMMENT_START_DASH=43]="COMMENT_START_DASH",e[e.COMMENT=44]="COMMENT",e[e.COMMENT_LESS_THAN_SIGN=45]="COMMENT_LESS_THAN_SIGN",e[e.COMMENT_LESS_THAN_SIGN_BANG=46]="COMMENT_LESS_THAN_SIGN_BANG",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH=47]="COMMENT_LESS_THAN_SIGN_BANG_DASH",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH=48]="COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH",e[e.COMMENT_END_DASH=49]="COMMENT_END_DASH",e[e.COMMENT_END=50]="COMMENT_END",e[e.COMMENT_END_BANG=51]="COMMENT_END_BANG",e[e.DOCTYPE=52]="DOCTYPE",e[e.BEFORE_DOCTYPE_NAME=53]="BEFORE_DOCTYPE_NAME",e[e.DOCTYPE_NAME=54]="DOCTYPE_NAME",e[e.AFTER_DOCTYPE_NAME=55]="AFTER_DOCTYPE_NAME",e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD=56]="AFTER_DOCTYPE_PUBLIC_KEYWORD",e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER=57]="BEFORE_DOCTYPE_PUBLIC_IDENTIFIER",e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED=58]="DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED=59]="DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER=60]="AFTER_DOCTYPE_PUBLIC_IDENTIFIER",e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS=61]="BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS",e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD=62]="AFTER_DOCTYPE_SYSTEM_KEYWORD",e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER=63]="BEFORE_DOCTYPE_SYSTEM_IDENTIFIER",e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED=64]="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED=65]="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER=66]="AFTER_DOCTYPE_SYSTEM_IDENTIFIER",e[e.BOGUS_DOCTYPE=67]="BOGUS_DOCTYPE",e[e.CDATA_SECTION=68]="CDATA_SECTION",e[e.CDATA_SECTION_BRACKET=69]="CDATA_SECTION_BRACKET",e[e.CDATA_SECTION_END=70]="CDATA_SECTION_END",e[e.CHARACTER_REFERENCE=71]="CHARACTER_REFERENCE",e[e.NAMED_CHARACTER_REFERENCE=72]="NAMED_CHARACTER_REFERENCE",e[e.AMBIGUOUS_AMPERSAND=73]="AMBIGUOUS_AMPERSAND",e[e.NUMERIC_CHARACTER_REFERENCE=74]="NUMERIC_CHARACTER_REFERENCE",e[e.HEXADEMICAL_CHARACTER_REFERENCE_START=75]="HEXADEMICAL_CHARACTER_REFERENCE_START",e[e.HEXADEMICAL_CHARACTER_REFERENCE=76]="HEXADEMICAL_CHARACTER_REFERENCE",e[e.DECIMAL_CHARACTER_REFERENCE=77]="DECIMAL_CHARACTER_REFERENCE",e[e.NUMERIC_CHARACTER_REFERENCE_END=78]="NUMERIC_CHARACTER_REFERENCE_END";}(P||(P={}));const b={DATA:P.DATA,RCDATA:P.RCDATA,RAWTEXT:P.RAWTEXT,SCRIPT_DATA:P.SCRIPT_DATA,PLAINTEXT:P.PLAINTEXT,CDATA_SECTION:P.CDATA_SECTION};function B(e){return e>=a.DIGIT_0&&e<=a.DIGIT_9}function H(e){return e>=a.LATIN_CAPITAL_A&&e<=a.LATIN_CAPITAL_Z}function F(e){return function(e){return e>=a.LATIN_SMALL_A&&e<=a.LATIN_SMALL_Z}(e)||H(e)}function U(e){return F(e)||B(e)}function G(e){return e>=a.LATIN_CAPITAL_A&&e<=a.LATIN_CAPITAL_F}function y(e){return e>=a.LATIN_SMALL_A&&e<=a.LATIN_SMALL_F}function w(e){return e+32}function Y(e){return e===a.SPACE||e===a.LINE_FEED||e===a.TABULATION||e===a.FORM_FEED}function x(e){return Y(e)||e===a.SOLIDUS||e===a.GREATER_THAN_SIGN}class v{constructor(e,t){this.options=e,this.handler=t,this.paused=!1,this.inLoop=!1,this.inForeignNode=!1,this.lastStartTagName="",this.active=!1,this.state=P.DATA,this.returnState=P.DATA,this.charRefCode=-1,this.consumedAfterSnapshot=-1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr={name:"",value:""},this.preprocessor=new _(t),this.currentLocation=this.getCurrentLocation(-1);}_err(e){var t,s;null===(s=(t=this.handler).onParseError)||void 0===s||s.call(t,this.preprocessor.getError(e));}getCurrentLocation(e){return this.options.sourceCodeLocationInfo?{startLine:this.preprocessor.line,startCol:this.preprocessor.col-e,startOffset:this.preprocessor.offset-e,endLine:-1,endCol:-1,endOffset:-1}:null}_runParsingLoop(){if(!this.inLoop){for(this.inLoop=!0;this.active&&!this.paused;){this.consumedAfterSnapshot=0;const e=this._consume();this._ensureHibernation()||this._callState(e);}this.inLoop=!1;}}pause(){this.paused=!0;}resume(e){if(!this.paused)throw new Error("Parser was already resumed");this.paused=!1,this.inLoop||(this._runParsingLoop(),this.paused||null==e||e());}write(e,t,s){this.active=!0,this.preprocessor.write(e,t),this._runParsingLoop(),this.paused||null==s||s();}insertHtmlAtCurrentPos(e){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(e),this._runParsingLoop();}_ensureHibernation(){return !!this.preprocessor.endOfChunkHit&&(this._unconsume(this.consumedAfterSnapshot),this.active=!1,!0)}_consume(){return this.consumedAfterSnapshot++,this.preprocessor.advance()}_unconsume(e){this.consumedAfterSnapshot-=e,this.preprocessor.retreat(e);}_reconsumeInState(e,t){this.state=e,this._callState(t);}_advanceBy(e){this.consumedAfterSnapshot+=e;for(let t=0;t<e;t++)this.preprocessor.advance();}_consumeSequenceIfMatch(e,t){return !!this.preprocessor.startsWith(e,t)&&(this._advanceBy(e.length-1),!0)}_createStartTagToken(){this.currentToken={type:h.START_TAG,tagName:"",tagID:u.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(1)};}_createEndTagToken(){this.currentToken={type:h.END_TAG,tagName:"",tagID:u.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(2)};}_createCommentToken(e){this.currentToken={type:h.COMMENT,data:"",location:this.getCurrentLocation(e)};}_createDoctypeToken(e){this.currentToken={type:h.DOCTYPE,name:e,forceQuirks:!1,publicId:null,systemId:null,location:this.currentLocation};}_createCharacterToken(e,t){this.currentCharacterToken={type:e,chars:t,location:this.currentLocation};}_createAttr(e){this.currentAttr={name:e,value:""},this.currentLocation=this.getCurrentLocation(0);}_leaveAttrName(){var e,t;const s=this.currentToken;null===A(s,this.currentAttr.name)?(s.attrs.push(this.currentAttr),s.location&&this.currentLocation&&((null!==(e=(t=s.location).attrs)&&void 0!==e?e:t.attrs=Object.create(null))[this.currentAttr.name]=this.currentLocation,this._leaveAttrValue())):this._err(T.duplicateAttribute);}_leaveAttrValue(){this.currentLocation&&(this.currentLocation.endLine=this.preprocessor.line,this.currentLocation.endCol=this.preprocessor.col,this.currentLocation.endOffset=this.preprocessor.offset);}prepareToken(e){this._emitCurrentCharacterToken(e.location),this.currentToken=null,e.location&&(e.location.endLine=this.preprocessor.line,e.location.endCol=this.preprocessor.col+1,e.location.endOffset=this.preprocessor.offset+1),this.currentLocation=this.getCurrentLocation(-1);}emitCurrentTagToken(){const e=this.currentToken;this.prepareToken(e),e.tagID=f(e.tagName),e.type===h.START_TAG?(this.lastStartTagName=e.tagName,this.handler.onStartTag(e)):(e.attrs.length>0&&this._err(T.endTagWithAttributes),e.selfClosing&&this._err(T.endTagWithTrailingSolidus),this.handler.onEndTag(e)),this.preprocessor.dropParsedChunk();}emitCurrentComment(e){this.prepareToken(e),this.handler.onComment(e),this.preprocessor.dropParsedChunk();}emitCurrentDoctype(e){this.prepareToken(e),this.handler.onDoctype(e),this.preprocessor.dropParsedChunk();}_emitCurrentCharacterToken(e){if(this.currentCharacterToken){switch(e&&this.currentCharacterToken.location&&(this.currentCharacterToken.location.endLine=e.startLine,this.currentCharacterToken.location.endCol=e.startCol,this.currentCharacterToken.location.endOffset=e.startOffset),this.currentCharacterToken.type){case h.CHARACTER:this.handler.onCharacter(this.currentCharacterToken);break;case h.NULL_CHARACTER:this.handler.onNullCharacter(this.currentCharacterToken);break;case h.WHITESPACE_CHARACTER:this.handler.onWhitespaceCharacter(this.currentCharacterToken);}this.currentCharacterToken=null;}}_emitEOFToken(){const e=this.getCurrentLocation(0);e&&(e.endLine=e.startLine,e.endCol=e.startCol,e.endOffset=e.startOffset),this._emitCurrentCharacterToken(e),this.handler.onEof({type:h.EOF,location:e}),this.active=!1;}_appendCharToCurrentCharacterToken(e,t){if(this.currentCharacterToken){if(this.currentCharacterToken.type===e)return void(this.currentCharacterToken.chars+=t);this.currentLocation=this.getCurrentLocation(0),this._emitCurrentCharacterToken(this.currentLocation),this.preprocessor.dropParsedChunk();}this._createCharacterToken(e,t);}_emitCodePoint(e){const t=Y(e)?h.WHITESPACE_CHARACTER:e===a.NULL?h.NULL_CHARACTER:h.CHARACTER;this._appendCharToCurrentCharacterToken(t,String.fromCodePoint(e));}_emitChars(e){this._appendCharToCurrentCharacterToken(h.CHARACTER,e);}_matchNamedCharacterReference(e){let t=null,s=0,r=!1;for(let i=0,o=R.htmlDecodeTree[0];i>=0&&(i=R.determineBranch(R.htmlDecodeTree,o,i+1,e),!(i<0));e=this._consume()){s+=1,o=R.htmlDecodeTree[i];const c=o&R.BinTrieFlags.VALUE_LENGTH;if(c){const o=(c>>14)-1;if(e!==a.SEMICOLON&&this._isCharacterReferenceInAttribute()&&((n=this.preprocessor.peek(1))===a.EQUALS_SIGN||U(n))?(t=[a.AMPERSAND],i+=o):(t=0===o?[R.htmlDecodeTree[i]&~R.BinTrieFlags.VALUE_LENGTH]:1===o?[R.htmlDecodeTree[++i]]:[R.htmlDecodeTree[++i],R.htmlDecodeTree[++i]],s=0,r=e!==a.SEMICOLON),0===o){this._consume();break}}}var n;return this._unconsume(s),r&&!this.preprocessor.endOfChunkHit&&this._err(T.missingSemicolonAfterCharacterReference),this._unconsume(1),t}_isCharacterReferenceInAttribute(){return this.returnState===P.ATTRIBUTE_VALUE_DOUBLE_QUOTED||this.returnState===P.ATTRIBUTE_VALUE_SINGLE_QUOTED||this.returnState===P.ATTRIBUTE_VALUE_UNQUOTED}_flushCodePointConsumedAsCharacterReference(e){this._isCharacterReferenceInAttribute()?this.currentAttr.value+=String.fromCodePoint(e):this._emitCodePoint(e);}_callState(e){switch(this.state){case P.DATA:this._stateData(e);break;case P.RCDATA:this._stateRcdata(e);break;case P.RAWTEXT:this._stateRawtext(e);break;case P.SCRIPT_DATA:this._stateScriptData(e);break;case P.PLAINTEXT:this._statePlaintext(e);break;case P.TAG_OPEN:this._stateTagOpen(e);break;case P.END_TAG_OPEN:this._stateEndTagOpen(e);break;case P.TAG_NAME:this._stateTagName(e);break;case P.RCDATA_LESS_THAN_SIGN:this._stateRcdataLessThanSign(e);break;case P.RCDATA_END_TAG_OPEN:this._stateRcdataEndTagOpen(e);break;case P.RCDATA_END_TAG_NAME:this._stateRcdataEndTagName(e);break;case P.RAWTEXT_LESS_THAN_SIGN:this._stateRawtextLessThanSign(e);break;case P.RAWTEXT_END_TAG_OPEN:this._stateRawtextEndTagOpen(e);break;case P.RAWTEXT_END_TAG_NAME:this._stateRawtextEndTagName(e);break;case P.SCRIPT_DATA_LESS_THAN_SIGN:this._stateScriptDataLessThanSign(e);break;case P.SCRIPT_DATA_END_TAG_OPEN:this._stateScriptDataEndTagOpen(e);break;case P.SCRIPT_DATA_END_TAG_NAME:this._stateScriptDataEndTagName(e);break;case P.SCRIPT_DATA_ESCAPE_START:this._stateScriptDataEscapeStart(e);break;case P.SCRIPT_DATA_ESCAPE_START_DASH:this._stateScriptDataEscapeStartDash(e);break;case P.SCRIPT_DATA_ESCAPED:this._stateScriptDataEscaped(e);break;case P.SCRIPT_DATA_ESCAPED_DASH:this._stateScriptDataEscapedDash(e);break;case P.SCRIPT_DATA_ESCAPED_DASH_DASH:this._stateScriptDataEscapedDashDash(e);break;case P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataEscapedLessThanSign(e);break;case P.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:this._stateScriptDataEscapedEndTagOpen(e);break;case P.SCRIPT_DATA_ESCAPED_END_TAG_NAME:this._stateScriptDataEscapedEndTagName(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPE_START:this._stateScriptDataDoubleEscapeStart(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED:this._stateScriptDataDoubleEscaped(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:this._stateScriptDataDoubleEscapedDash(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:this._stateScriptDataDoubleEscapedDashDash(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataDoubleEscapedLessThanSign(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPE_END:this._stateScriptDataDoubleEscapeEnd(e);break;case P.BEFORE_ATTRIBUTE_NAME:this._stateBeforeAttributeName(e);break;case P.ATTRIBUTE_NAME:this._stateAttributeName(e);break;case P.AFTER_ATTRIBUTE_NAME:this._stateAfterAttributeName(e);break;case P.BEFORE_ATTRIBUTE_VALUE:this._stateBeforeAttributeValue(e);break;case P.ATTRIBUTE_VALUE_DOUBLE_QUOTED:this._stateAttributeValueDoubleQuoted(e);break;case P.ATTRIBUTE_VALUE_SINGLE_QUOTED:this._stateAttributeValueSingleQuoted(e);break;case P.ATTRIBUTE_VALUE_UNQUOTED:this._stateAttributeValueUnquoted(e);break;case P.AFTER_ATTRIBUTE_VALUE_QUOTED:this._stateAfterAttributeValueQuoted(e);break;case P.SELF_CLOSING_START_TAG:this._stateSelfClosingStartTag(e);break;case P.BOGUS_COMMENT:this._stateBogusComment(e);break;case P.MARKUP_DECLARATION_OPEN:this._stateMarkupDeclarationOpen(e);break;case P.COMMENT_START:this._stateCommentStart(e);break;case P.COMMENT_START_DASH:this._stateCommentStartDash(e);break;case P.COMMENT:this._stateComment(e);break;case P.COMMENT_LESS_THAN_SIGN:this._stateCommentLessThanSign(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG:this._stateCommentLessThanSignBang(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG_DASH:this._stateCommentLessThanSignBangDash(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:this._stateCommentLessThanSignBangDashDash(e);break;case P.COMMENT_END_DASH:this._stateCommentEndDash(e);break;case P.COMMENT_END:this._stateCommentEnd(e);break;case P.COMMENT_END_BANG:this._stateCommentEndBang(e);break;case P.DOCTYPE:this._stateDoctype(e);break;case P.BEFORE_DOCTYPE_NAME:this._stateBeforeDoctypeName(e);break;case P.DOCTYPE_NAME:this._stateDoctypeName(e);break;case P.AFTER_DOCTYPE_NAME:this._stateAfterDoctypeName(e);break;case P.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._stateAfterDoctypePublicKeyword(e);break;case P.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:this._stateBeforeDoctypePublicIdentifier(e);break;case P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypePublicIdentifierDoubleQuoted(e);break;case P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypePublicIdentifierSingleQuoted(e);break;case P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:this._stateAfterDoctypePublicIdentifier(e);break;case P.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:this._stateBetweenDoctypePublicAndSystemIdentifiers(e);break;case P.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._stateAfterDoctypeSystemKeyword(e);break;case P.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:this._stateBeforeDoctypeSystemIdentifier(e);break;case P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypeSystemIdentifierDoubleQuoted(e);break;case P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypeSystemIdentifierSingleQuoted(e);break;case P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:this._stateAfterDoctypeSystemIdentifier(e);break;case P.BOGUS_DOCTYPE:this._stateBogusDoctype(e);break;case P.CDATA_SECTION:this._stateCdataSection(e);break;case P.CDATA_SECTION_BRACKET:this._stateCdataSectionBracket(e);break;case P.CDATA_SECTION_END:this._stateCdataSectionEnd(e);break;case P.CHARACTER_REFERENCE:this._stateCharacterReference(e);break;case P.NAMED_CHARACTER_REFERENCE:this._stateNamedCharacterReference(e);break;case P.AMBIGUOUS_AMPERSAND:this._stateAmbiguousAmpersand(e);break;case P.NUMERIC_CHARACTER_REFERENCE:this._stateNumericCharacterReference(e);break;case P.HEXADEMICAL_CHARACTER_REFERENCE_START:this._stateHexademicalCharacterReferenceStart(e);break;case P.HEXADEMICAL_CHARACTER_REFERENCE:this._stateHexademicalCharacterReference(e);break;case P.DECIMAL_CHARACTER_REFERENCE:this._stateDecimalCharacterReference(e);break;case P.NUMERIC_CHARACTER_REFERENCE_END:this._stateNumericCharacterReferenceEnd(e);break;default:throw new Error("Unknown state")}}_stateData(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.TAG_OPEN;break;case a.AMPERSAND:this.returnState=P.DATA,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitCodePoint(e);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateRcdata(e){switch(e){case a.AMPERSAND:this.returnState=P.RCDATA,this.state=P.CHARACTER_REFERENCE;break;case a.LESS_THAN_SIGN:this.state=P.RCDATA_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateRawtext(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.RAWTEXT_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptData(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_statePlaintext(e){switch(e){case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateTagOpen(e){if(F(e))this._createStartTagToken(),this.state=P.TAG_NAME,this._stateTagName(e);else switch(e){case a.EXCLAMATION_MARK:this.state=P.MARKUP_DECLARATION_OPEN;break;case a.SOLIDUS:this.state=P.END_TAG_OPEN;break;case a.QUESTION_MARK:this._err(T.unexpectedQuestionMarkInsteadOfTagName),this._createCommentToken(1),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e);break;case a.EOF:this._err(T.eofBeforeTagName),this._emitChars("<"),this._emitEOFToken();break;default:this._err(T.invalidFirstCharacterOfTagName),this._emitChars("<"),this.state=P.DATA,this._stateData(e);}}_stateEndTagOpen(e){if(F(e))this._createEndTagToken(),this.state=P.TAG_NAME,this._stateTagName(e);else switch(e){case a.GREATER_THAN_SIGN:this._err(T.missingEndTagName),this.state=P.DATA;break;case a.EOF:this._err(T.eofBeforeTagName),this._emitChars("</"),this._emitEOFToken();break;default:this._err(T.invalidFirstCharacterOfTagName),this._createCommentToken(2),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e);}}_stateTagName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.SOLIDUS:this.state=P.SELF_CLOSING_START_TAG;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentTagToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),t.tagName+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:t.tagName+=String.fromCodePoint(H(e)?w(e):e);}}_stateRcdataLessThanSign(e){e===a.SOLIDUS?this.state=P.RCDATA_END_TAG_OPEN:(this._emitChars("<"),this.state=P.RCDATA,this._stateRcdata(e));}_stateRcdataEndTagOpen(e){F(e)?(this.state=P.RCDATA_END_TAG_NAME,this._stateRcdataEndTagName(e)):(this._emitChars("</"),this.state=P.RCDATA,this._stateRcdata(e));}handleSpecialEndTag(e){if(!this.preprocessor.startsWith(this.lastStartTagName,!1))return !this._ensureHibernation();switch(this._createEndTagToken(),this.currentToken.tagName=this.lastStartTagName,this.preprocessor.peek(this.lastStartTagName.length)){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:return this._advanceBy(this.lastStartTagName.length),this.state=P.BEFORE_ATTRIBUTE_NAME,!1;case a.SOLIDUS:return this._advanceBy(this.lastStartTagName.length),this.state=P.SELF_CLOSING_START_TAG,!1;case a.GREATER_THAN_SIGN:return this._advanceBy(this.lastStartTagName.length),this.emitCurrentTagToken(),this.state=P.DATA,!1;default:return !this._ensureHibernation()}}_stateRcdataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.RCDATA,this._stateRcdata(e));}_stateRawtextLessThanSign(e){e===a.SOLIDUS?this.state=P.RAWTEXT_END_TAG_OPEN:(this._emitChars("<"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateRawtextEndTagOpen(e){F(e)?(this.state=P.RAWTEXT_END_TAG_NAME,this._stateRawtextEndTagName(e)):(this._emitChars("</"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateRawtextEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateScriptDataLessThanSign(e){switch(e){case a.SOLIDUS:this.state=P.SCRIPT_DATA_END_TAG_OPEN;break;case a.EXCLAMATION_MARK:this.state=P.SCRIPT_DATA_ESCAPE_START,this._emitChars("<!");break;default:this._emitChars("<"),this.state=P.SCRIPT_DATA,this._stateScriptData(e);}}_stateScriptDataEndTagOpen(e){F(e)?(this.state=P.SCRIPT_DATA_END_TAG_NAME,this._stateScriptDataEndTagName(e)):(this._emitChars("</"),this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscapeStart(e){e===a.HYPHEN_MINUS?(this.state=P.SCRIPT_DATA_ESCAPE_START_DASH,this._emitChars("-")):(this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscapeStartDash(e){e===a.HYPHEN_MINUS?(this.state=P.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-")):(this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscaped(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_ESCAPED_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptDataEscapedDash(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataEscapedDashDash(e){switch(e){case a.HYPHEN_MINUS:this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.GREATER_THAN_SIGN:this.state=P.SCRIPT_DATA,this._emitChars(">");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataEscapedLessThanSign(e){e===a.SOLIDUS?this.state=P.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:F(e)?(this._emitChars("<"),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPE_START,this._stateScriptDataDoubleEscapeStart(e)):(this._emitChars("<"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataEscapedEndTagOpen(e){F(e)?(this.state=P.SCRIPT_DATA_ESCAPED_END_TAG_NAME,this._stateScriptDataEscapedEndTagName(e)):(this._emitChars("</"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataEscapedEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataDoubleEscapeStart(e){if(this.preprocessor.startsWith(i,!1)&&x(this.preprocessor.peek(i.length))){this._emitCodePoint(e);for(let e=0;e<i.length;e++)this._emitCodePoint(this._consume());this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED;}else this._ensureHibernation()||(this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataDoubleEscaped(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedDash(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedDashDash(e){switch(e){case a.HYPHEN_MINUS:this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.GREATER_THAN_SIGN:this.state=P.SCRIPT_DATA,this._emitChars(">");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedLessThanSign(e){e===a.SOLIDUS?(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPE_END,this._emitChars("/")):(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e));}_stateScriptDataDoubleEscapeEnd(e){if(this.preprocessor.startsWith(i,!1)&&x(this.preprocessor.peek(i.length))){this._emitCodePoint(e);for(let e=0;e<i.length;e++)this._emitCodePoint(this._consume());this.state=P.SCRIPT_DATA_ESCAPED;}else this._ensureHibernation()||(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e));}_stateBeforeAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.SOLIDUS:case a.GREATER_THAN_SIGN:case a.EOF:this.state=P.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case a.EQUALS_SIGN:this._err(T.unexpectedEqualsSignBeforeAttributeName),this._createAttr("="),this.state=P.ATTRIBUTE_NAME;break;default:this._createAttr(""),this.state=P.ATTRIBUTE_NAME,this._stateAttributeName(e);}}_stateAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:case a.SOLIDUS:case a.GREATER_THAN_SIGN:case a.EOF:this._leaveAttrName(),this.state=P.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case a.EQUALS_SIGN:this._leaveAttrName(),this.state=P.BEFORE_ATTRIBUTE_VALUE;break;case a.QUOTATION_MARK:case a.APOSTROPHE:case a.LESS_THAN_SIGN:this._err(T.unexpectedCharacterInAttributeName),this.currentAttr.name+=String.fromCodePoint(e);break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.name+=s;break;default:this.currentAttr.name+=String.fromCodePoint(H(e)?w(e):e);}}_stateAfterAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.SOLIDUS:this.state=P.SELF_CLOSING_START_TAG;break;case a.EQUALS_SIGN:this.state=P.BEFORE_ATTRIBUTE_VALUE;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._createAttr(""),this.state=P.ATTRIBUTE_NAME,this._stateAttributeName(e);}}_stateBeforeAttributeValue(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:this.state=P.ATTRIBUTE_VALUE_DOUBLE_QUOTED;break;case a.APOSTROPHE:this.state=P.ATTRIBUTE_VALUE_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingAttributeValue),this.state=P.DATA,this.emitCurrentTagToken();break;default:this.state=P.ATTRIBUTE_VALUE_UNQUOTED,this._stateAttributeValueUnquoted(e);}}_stateAttributeValueDoubleQuoted(e){switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_DOUBLE_QUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAttributeValueSingleQuoted(e){switch(e){case a.APOSTROPHE:this.state=P.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_SINGLE_QUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAttributeValueUnquoted(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this._leaveAttrValue(),this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_UNQUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=P.DATA,this.emitCurrentTagToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.QUOTATION_MARK:case a.APOSTROPHE:case a.LESS_THAN_SIGN:case a.EQUALS_SIGN:case a.GRAVE_ACCENT:this._err(T.unexpectedCharacterInUnquotedAttributeValue),this.currentAttr.value+=String.fromCodePoint(e);break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAfterAttributeValueQuoted(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this._leaveAttrValue(),this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.SOLIDUS:this._leaveAttrValue(),this.state=P.SELF_CLOSING_START_TAG;break;case a.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._err(T.missingWhitespaceBetweenAttributes),this.state=P.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e);}}_stateSelfClosingStartTag(e){switch(e){case a.GREATER_THAN_SIGN:this.currentToken.selfClosing=!0,this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._err(T.unexpectedSolidusInTag),this.state=P.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e);}}_stateBogusComment(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this.emitCurrentComment(t),this._emitEOFToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),t.data+=s;break;default:t.data+=String.fromCodePoint(e);}}_stateMarkupDeclarationOpen(e){this._consumeSequenceIfMatch("--",!0)?(this._createCommentToken("--".length+1),this.state=P.COMMENT_START):this._consumeSequenceIfMatch(n,!1)?(this.currentLocation=this.getCurrentLocation(n.length+1),this.state=P.DOCTYPE):this._consumeSequenceIfMatch(r,!0)?this.inForeignNode?this.state=P.CDATA_SECTION:(this._err(T.cdataInHtmlContent),this._createCommentToken(r.length+1),this.currentToken.data="[CDATA[",this.state=P.BOGUS_COMMENT):this._ensureHibernation()||(this._err(T.incorrectlyOpenedComment),this._createCommentToken(2),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e));}_stateCommentStart(e){switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_START_DASH;break;case a.GREATER_THAN_SIGN:{this._err(T.abruptClosingOfEmptyComment),this.state=P.DATA;const e=this.currentToken;this.emitCurrentComment(e);break}default:this.state=P.COMMENT,this._stateComment(e);}}_stateCommentStartDash(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END;break;case a.GREATER_THAN_SIGN:this._err(T.abruptClosingOfEmptyComment),this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="-",this.state=P.COMMENT,this._stateComment(e);}}_stateComment(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END_DASH;break;case a.LESS_THAN_SIGN:t.data+="<",this.state=P.COMMENT_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.data+=s;break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=String.fromCodePoint(e);}}_stateCommentLessThanSign(e){const t=this.currentToken;switch(e){case a.EXCLAMATION_MARK:t.data+="!",this.state=P.COMMENT_LESS_THAN_SIGN_BANG;break;case a.LESS_THAN_SIGN:t.data+="<";break;default:this.state=P.COMMENT,this._stateComment(e);}}_stateCommentLessThanSignBang(e){e===a.HYPHEN_MINUS?this.state=P.COMMENT_LESS_THAN_SIGN_BANG_DASH:(this.state=P.COMMENT,this._stateComment(e));}_stateCommentLessThanSignBangDash(e){e===a.HYPHEN_MINUS?this.state=P.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:(this.state=P.COMMENT_END_DASH,this._stateCommentEndDash(e));}_stateCommentLessThanSignBangDashDash(e){e!==a.GREATER_THAN_SIGN&&e!==a.EOF&&this._err(T.nestedComment),this.state=P.COMMENT_END,this._stateCommentEnd(e);}_stateCommentEndDash(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END;break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="-",this.state=P.COMMENT,this._stateComment(e);}}_stateCommentEnd(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentComment(t);break;case a.EXCLAMATION_MARK:this.state=P.COMMENT_END_BANG;break;case a.HYPHEN_MINUS:t.data+="-";break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="--",this.state=P.COMMENT,this._stateComment(e);}}_stateCommentEndBang(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:t.data+="--!",this.state=P.COMMENT_END_DASH;break;case a.GREATER_THAN_SIGN:this._err(T.incorrectlyClosedComment),this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="--!",this.state=P.COMMENT,this._stateComment(e);}}_stateDoctype(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:this.state=P.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);break;case a.EOF:{this._err(T.eofInDoctype),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._err(T.missingWhitespaceBeforeDoctypeName),this.state=P.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);}}_stateBeforeDoctypeName(e){if(H(e))this._createDoctypeToken(String.fromCharCode(w(e))),this.state=P.DOCTYPE_NAME;else switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.NULL:this._err(T.unexpectedNullCharacter),this._createDoctypeToken(s),this.state=P.DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:{this._err(T.missingDoctypeName),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this.state=P.DATA;break}case a.EOF:{this._err(T.eofInDoctype),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._createDoctypeToken(String.fromCodePoint(e)),this.state=P.DOCTYPE_NAME;}}_stateDoctypeName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.AFTER_DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.NULL:this._err(T.unexpectedNullCharacter),t.name+=s;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.name+=String.fromCodePoint(H(e)?w(e):e);}}_stateAfterDoctypeName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._consumeSequenceIfMatch("public",!1)?this.state=P.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._consumeSequenceIfMatch("system",!1)?this.state=P.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._ensureHibernation()||(this._err(T.invalidCharacterSequenceAfterDoctypeName),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e));}}_stateAfterDoctypePublicKeyword(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceAfterDoctypePublicKeyword),t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceAfterDoctypePublicKeyword),t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBeforeDoctypePublicIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateDoctypePublicIdentifierDoubleQuoted(e){const t=this.currentToken;switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.publicId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e);}}_stateDoctypePublicIdentifierSingleQuoted(e){const t=this.currentToken;switch(e){case a.APOSTROPHE:this.state=P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.publicId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e);}}_stateAfterDoctypePublicIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBetweenDoctypePublicAndSystemIdentifiers(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.QUOTATION_MARK:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateAfterDoctypeSystemKeyword(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBeforeDoctypeSystemIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateDoctypeSystemIdentifierDoubleQuoted(e){const t=this.currentToken;switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.systemId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e);}}_stateDoctypeSystemIdentifierSingleQuoted(e){const t=this.currentToken;switch(e){case a.APOSTROPHE:this.state=P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.systemId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e);}}_stateAfterDoctypeSystemIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.unexpectedCharacterAfterDoctypeSystemIdentifier),this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBogusDoctype(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.NULL:this._err(T.unexpectedNullCharacter);break;case a.EOF:this.emitCurrentDoctype(t),this._emitEOFToken();}}_stateCdataSection(e){switch(e){case a.RIGHT_SQUARE_BRACKET:this.state=P.CDATA_SECTION_BRACKET;break;case a.EOF:this._err(T.eofInCdata),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateCdataSectionBracket(e){e===a.RIGHT_SQUARE_BRACKET?this.state=P.CDATA_SECTION_END:(this._emitChars("]"),this.state=P.CDATA_SECTION,this._stateCdataSection(e));}_stateCdataSectionEnd(e){switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA;break;case a.RIGHT_SQUARE_BRACKET:this._emitChars("]");break;default:this._emitChars("]]"),this.state=P.CDATA_SECTION,this._stateCdataSection(e);}}_stateCharacterReference(e){e===a.NUMBER_SIGN?this.state=P.NUMERIC_CHARACTER_REFERENCE:U(e)?(this.state=P.NAMED_CHARACTER_REFERENCE,this._stateNamedCharacterReference(e)):(this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._reconsumeInState(this.returnState,e));}_stateNamedCharacterReference(e){const t=this._matchNamedCharacterReference(e);if(this._ensureHibernation());else if(t){for(let e=0;e<t.length;e++)this._flushCodePointConsumedAsCharacterReference(t[e]);this.state=this.returnState;}else this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this.state=P.AMBIGUOUS_AMPERSAND;}_stateAmbiguousAmpersand(e){U(e)?this._flushCodePointConsumedAsCharacterReference(e):(e===a.SEMICOLON&&this._err(T.unknownNamedCharacterReference),this._reconsumeInState(this.returnState,e));}_stateNumericCharacterReference(e){this.charRefCode=0,e===a.LATIN_SMALL_X||e===a.LATIN_CAPITAL_X?this.state=P.HEXADEMICAL_CHARACTER_REFERENCE_START:B(e)?(this.state=P.DECIMAL_CHARACTER_REFERENCE,this._stateDecimalCharacterReference(e)):(this._err(T.absenceOfDigitsInNumericCharacterReference),this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._flushCodePointConsumedAsCharacterReference(a.NUMBER_SIGN),this._reconsumeInState(this.returnState,e));}_stateHexademicalCharacterReferenceStart(e){!function(e){return B(e)||G(e)||y(e)}(e)?(this._err(T.absenceOfDigitsInNumericCharacterReference),this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._flushCodePointConsumedAsCharacterReference(a.NUMBER_SIGN),this._unconsume(2),this.state=this.returnState):(this.state=P.HEXADEMICAL_CHARACTER_REFERENCE,this._stateHexademicalCharacterReference(e));}_stateHexademicalCharacterReference(e){G(e)?this.charRefCode=16*this.charRefCode+e-55:y(e)?this.charRefCode=16*this.charRefCode+e-87:B(e)?this.charRefCode=16*this.charRefCode+e-48:e===a.SEMICOLON?this.state=P.NUMERIC_CHARACTER_REFERENCE_END:(this._err(T.missingSemicolonAfterCharacterReference),this.state=P.NUMERIC_CHARACTER_REFERENCE_END,this._stateNumericCharacterReferenceEnd(e));}_stateDecimalCharacterReference(e){B(e)?this.charRefCode=10*this.charRefCode+e-48:e===a.SEMICOLON?this.state=P.NUMERIC_CHARACTER_REFERENCE_END:(this._err(T.missingSemicolonAfterCharacterReference),this.state=P.NUMERIC_CHARACTER_REFERENCE_END,this._stateNumericCharacterReferenceEnd(e));}_stateNumericCharacterReferenceEnd(e){if(this.charRefCode===a.NULL)this._err(T.nullCharacterReference),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(this.charRefCode>1114111)this._err(T.characterReferenceOutsideUnicodeRange),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(o(this.charRefCode))this._err(T.surrogateCharacterReference),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(E(this.charRefCode))this._err(T.noncharacterCharacterReference);else if(c(this.charRefCode)||this.charRefCode===a.CARRIAGE_RETURN){this._err(T.controlCharacterReference);const e=k.get(this.charRefCode);void 0!==e&&(this.charRefCode=e);}this._flushCodePointConsumedAsCharacterReference(this.charRefCode),this._reconsumeInState(this.returnState,e);}}const Q=new Set([u.DD,u.DT,u.LI,u.OPTGROUP,u.OPTION,u.P,u.RB,u.RP,u.RT,u.RTC]),q=new Set([...Q,u.CAPTION,u.COLGROUP,u.TBODY,u.TD,u.TFOOT,u.TH,u.THEAD,u.TR]),W=new Map([[u.APPLET,p.HTML],[u.CAPTION,p.HTML],[u.HTML,p.HTML],[u.MARQUEE,p.HTML],[u.OBJECT,p.HTML],[u.TABLE,p.HTML],[u.TD,p.HTML],[u.TEMPLATE,p.HTML],[u.TH,p.HTML],[u.ANNOTATION_XML,p.MATHML],[u.MI,p.MATHML],[u.MN,p.MATHML],[u.MO,p.MATHML],[u.MS,p.MATHML],[u.MTEXT,p.MATHML],[u.DESC,p.SVG],[u.FOREIGN_OBJECT,p.SVG],[u.TITLE,p.SVG]]),X=[u.H1,u.H2,u.H3,u.H4,u.H5,u.H6],K=[u.TR,u.TEMPLATE,u.HTML],V=[u.TBODY,u.TFOOT,u.THEAD,u.TEMPLATE,u.HTML],z=[u.TABLE,u.TEMPLATE,u.HTML],j=[u.TD,u.TH];class J{get currentTmplContentOrNode(){return this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):this.current}constructor(e,t,s){this.treeAdapter=t,this.handler=s,this.items=[],this.tagIDs=[],this.stackTop=-1,this.tmplCount=0,this.currentTagId=u.UNKNOWN,this.current=e;}_indexOf(e){return this.items.lastIndexOf(e,this.stackTop)}_isInTemplate(){return this.currentTagId===u.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===p.HTML}_updateCurrentElement(){this.current=this.items[this.stackTop],this.currentTagId=this.tagIDs[this.stackTop];}push(e,t){this.stackTop++,this.items[this.stackTop]=e,this.current=e,this.tagIDs[this.stackTop]=t,this.currentTagId=t,this._isInTemplate()&&this.tmplCount++,this.handler.onItemPush(e,t,!0);}pop(){const e=this.current;this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!0);}replace(e,t){const s=this._indexOf(e);this.items[s]=t,s===this.stackTop&&(this.current=t);}insertAfter(e,t,s){const a=this._indexOf(e)+1;this.items.splice(a,0,t),this.tagIDs.splice(a,0,s),this.stackTop++,a===this.stackTop&&this._updateCurrentElement(),this.handler.onItemPush(this.current,this.currentTagId,a===this.stackTop);}popUntilTagNamePopped(e){let t=this.stackTop+1;do{t=this.tagIDs.lastIndexOf(e,t-1);}while(t>0&&this.treeAdapter.getNamespaceURI(this.items[t])!==p.HTML);this.shortenToLength(t<0?0:t);}shortenToLength(e){for(;this.stackTop>=e;){const t=this.current;this.tmplCount>0&&this._isInTemplate()&&(this.tmplCount-=1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(t,this.stackTop<e);}}popUntilElementPopped(e){const t=this._indexOf(e);this.shortenToLength(t<0?0:t);}popUntilPopped(e,t){const s=this._indexOfTagNames(e,t);this.shortenToLength(s<0?0:s);}popUntilNumberedHeaderPopped(){this.popUntilPopped(X,p.HTML);}popUntilTableCellPopped(){this.popUntilPopped(j,p.HTML);}popAllUpToHtmlElement(){this.tmplCount=0,this.shortenToLength(1);}_indexOfTagNames(e,t){for(let s=this.stackTop;s>=0;s--)if(e.includes(this.tagIDs[s])&&this.treeAdapter.getNamespaceURI(this.items[s])===t)return s;return -1}clearBackTo(e,t){const s=this._indexOfTagNames(e,t);this.shortenToLength(s+1);}clearBackToTableContext(){this.clearBackTo(z,p.HTML);}clearBackToTableBodyContext(){this.clearBackTo(V,p.HTML);}clearBackToTableRowContext(){this.clearBackTo(K,p.HTML);}remove(e){const t=this._indexOf(e);t>=0&&(t===this.stackTop?this.pop():(this.items.splice(t,1),this.tagIDs.splice(t,1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!1)));}tryPeekProperlyNestedBodyElement(){return this.stackTop>=1&&this.tagIDs[1]===u.BODY?this.items[1]:null}contains(e){return this._indexOf(e)>-1}getCommonAncestor(e){const t=this._indexOf(e)-1;return t>=0?this.items[t]:null}isRootHtmlElementCurrent(){return 0===this.stackTop&&this.tagIDs[0]===u.HTML}hasInScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===p.HTML)return !0;if(W.get(s)===a)return !1}return !0}hasNumberedHeaderInScope(){for(let e=this.stackTop;e>=0;e--){const t=this.tagIDs[e],s=this.treeAdapter.getNamespaceURI(this.items[e]);if(M(t)&&s===p.HTML)return !0;if(W.get(t)===s)return !1}return !0}hasInListItemScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===p.HTML)return !0;if((s===u.UL||s===u.OL)&&a===p.HTML||W.get(s)===a)return !1}return !0}hasInButtonScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===p.HTML)return !0;if(s===u.BUTTON&&a===p.HTML||W.get(s)===a)return !1}return !0}hasInTableScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t];if(this.treeAdapter.getNamespaceURI(this.items[t])===p.HTML){if(s===e)return !0;if(s===u.TABLE||s===u.TEMPLATE||s===u.HTML)return !1}}return !0}hasTableBodyContextInTableScope(){for(let e=this.stackTop;e>=0;e--){const t=this.tagIDs[e];if(this.treeAdapter.getNamespaceURI(this.items[e])===p.HTML){if(t===u.TBODY||t===u.THEAD||t===u.TFOOT)return !0;if(t===u.TABLE||t===u.HTML)return !1}}return !0}hasInSelectScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t];if(this.treeAdapter.getNamespaceURI(this.items[t])===p.HTML){if(s===e)return !0;if(s!==u.OPTION&&s!==u.OPTGROUP)return !1}}return !0}generateImpliedEndTags(){for(;Q.has(this.currentTagId);)this.pop();}generateImpliedEndTagsThoroughly(){for(;q.has(this.currentTagId);)this.pop();}generateImpliedEndTagsWithExclusion(e){for(;this.currentTagId!==e&&q.has(this.currentTagId);)this.pop();}}var Z;!function(e){e[e.Marker=0]="Marker",e[e.Element=1]="Element";}(Z=Z||(Z={}));const $={type:Z.Marker};class ee{constructor(e){this.treeAdapter=e,this.entries=[],this.bookmark=null;}_getNoahArkConditionCandidates(e,t){const s=[],a=t.length,r=this.treeAdapter.getTagName(e),n=this.treeAdapter.getNamespaceURI(e);for(let e=0;e<this.entries.length;e++){const t=this.entries[e];if(t.type===Z.Marker)break;const{element:i}=t;if(this.treeAdapter.getTagName(i)===r&&this.treeAdapter.getNamespaceURI(i)===n){const t=this.treeAdapter.getAttrList(i);t.length===a&&s.push({idx:e,attrs:t});}}return s}_ensureNoahArkCondition(e){if(this.entries.length<3)return;const t=this.treeAdapter.getAttrList(e),s=this._getNoahArkConditionCandidates(e,t);if(s.length<3)return;const a=new Map(t.map((e=>[e.name,e.value])));let r=0;for(let e=0;e<s.length;e++){const t=s[e];t.attrs.every((e=>a.get(e.name)===e.value))&&(r+=1,r>=3&&this.entries.splice(t.idx,1));}}insertMarker(){this.entries.unshift($);}pushElement(e,t){this._ensureNoahArkCondition(e),this.entries.unshift({type:Z.Element,element:e,token:t});}insertElementAfterBookmark(e,t){const s=this.entries.indexOf(this.bookmark);this.entries.splice(s,0,{type:Z.Element,element:e,token:t});}removeEntry(e){const t=this.entries.indexOf(e);t>=0&&this.entries.splice(t,1);}clearToLastMarker(){const e=this.entries.indexOf($);e>=0?this.entries.splice(0,e+1):this.entries.length=0;}getElementEntryInScopeWithTagName(e){const t=this.entries.find((t=>t.type===Z.Marker||this.treeAdapter.getTagName(t.element)===e));return t&&t.type===Z.Element?t:null}getElementEntry(e){return this.entries.find((t=>t.type===Z.Element&&t.element===e))}}function te(e){return {nodeName:"#text",value:e,parentNode:null}}const se={createDocument:()=>({nodeName:"#document",mode:I.NO_QUIRKS,childNodes:[]}),createDocumentFragment:()=>({nodeName:"#document-fragment",childNodes:[]}),createElement:(e,t,s)=>({nodeName:e,tagName:e,attrs:s,namespaceURI:t,childNodes:[],parentNode:null}),createCommentNode:e=>({nodeName:"#comment",data:e,parentNode:null}),appendChild(e,t){e.childNodes.push(t),t.parentNode=e;},insertBefore(e,t,s){const a=e.childNodes.indexOf(s);e.childNodes.splice(a,0,t),t.parentNode=e;},setTemplateContent(e,t){e.content=t;},getTemplateContent:e=>e.content,setDocumentType(e,t,s,a){const r=e.childNodes.find((e=>"#documentType"===e.nodeName));if(r)r.name=t,r.publicId=s,r.systemId=a;else {const r={nodeName:"#documentType",name:t,publicId:s,systemId:a,parentNode:null};se.appendChild(e,r);}},setDocumentMode(e,t){e.mode=t;},getDocumentMode:e=>e.mode,detachNode(e){if(e.parentNode){const t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null;}},insertText(e,t){if(e.childNodes.length>0){const s=e.childNodes[e.childNodes.length-1];if(se.isTextNode(s))return void(s.value+=t)}se.appendChild(e,te(t));},insertTextBefore(e,t,s){const a=e.childNodes[e.childNodes.indexOf(s)-1];a&&se.isTextNode(a)?a.value+=t:se.insertBefore(e,te(t),s);},adoptAttributes(e,t){const s=new Set(e.attrs.map((e=>e.name)));for(let a=0;a<t.length;a++)s.has(t[a].name)||e.attrs.push(t[a]);},getFirstChild:e=>e.childNodes[0],getChildNodes:e=>e.childNodes,getParentNode:e=>e.parentNode,getAttrList:e=>e.attrs,getTagName:e=>e.tagName,getNamespaceURI:e=>e.namespaceURI,getTextNodeContent:e=>e.value,getCommentNodeContent:e=>e.data,getDocumentTypeNodeName:e=>e.name,getDocumentTypeNodePublicId:e=>e.publicId,getDocumentTypeNodeSystemId:e=>e.systemId,isTextNode:e=>"#text"===e.nodeName,isCommentNode:e=>"#comment"===e.nodeName,isDocumentTypeNode:e=>"#documentType"===e.nodeName,isElementNode:e=>Object.prototype.hasOwnProperty.call(e,"tagName"),setNodeSourceCodeLocation(e,t){e.sourceCodeLocation=t;},getNodeSourceCodeLocation:e=>e.sourceCodeLocation,updateNodeSourceCodeLocation(e,t){e.sourceCodeLocation={...e.sourceCodeLocation,...t};}},ae="html",re=["+//silmaril//dtd html pro v0r11 19970101//","-//as//dtd html 3.0 aswedit + extensions//","-//advasoft ltd//dtd html 3.0 aswedit + extensions//","-//ietf//dtd html 2.0 level 1//","-//ietf//dtd html 2.0 level 2//","-//ietf//dtd html 2.0 strict level 1//","-//ietf//dtd html 2.0 strict level 2//","-//ietf//dtd html 2.0 strict//","-//ietf//dtd html 2.0//","-//ietf//dtd html 2.1e//","-//ietf//dtd html 3.0//","-//ietf//dtd html 3.2 final//","-//ietf//dtd html 3.2//","-//ietf//dtd html 3//","-//ietf//dtd html level 0//","-//ietf//dtd html level 1//","-//ietf//dtd html level 2//","-//ietf//dtd html level 3//","-//ietf//dtd html strict level 0//","-//ietf//dtd html strict level 1//","-//ietf//dtd html strict level 2//","-//ietf//dtd html strict level 3//","-//ietf//dtd html strict//","-//ietf//dtd html//","-//metrius//dtd metrius presentational//","-//microsoft//dtd internet explorer 2.0 html strict//","-//microsoft//dtd internet explorer 2.0 html//","-//microsoft//dtd internet explorer 2.0 tables//","-//microsoft//dtd internet explorer 3.0 html strict//","-//microsoft//dtd internet explorer 3.0 html//","-//microsoft//dtd internet explorer 3.0 tables//","-//netscape comm. corp.//dtd html//","-//netscape comm. corp.//dtd strict html//","-//o'reilly and associates//dtd html 2.0//","-//o'reilly and associates//dtd html extended 1.0//","-//o'reilly and associates//dtd html extended relaxed 1.0//","-//sq//dtd html 2.0 hotmetal + extensions//","-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//","-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//","-//spyglass//dtd html 2.0 extended//","-//sun microsystems corp.//dtd hotjava html//","-//sun microsystems corp.//dtd hotjava strict html//","-//w3c//dtd html 3 1995-03-24//","-//w3c//dtd html 3.2 draft//","-//w3c//dtd html 3.2 final//","-//w3c//dtd html 3.2//","-//w3c//dtd html 3.2s draft//","-//w3c//dtd html 4.0 frameset//","-//w3c//dtd html 4.0 transitional//","-//w3c//dtd html experimental 19960712//","-//w3c//dtd html experimental 970421//","-//w3c//dtd w3 html//","-//w3o//dtd w3 html 3.0//","-//webtechs//dtd mozilla html 2.0//","-//webtechs//dtd mozilla html//"],ne=[...re,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"],ie=new Set(["-//w3o//dtd w3 html strict 3.0//en//","-/w3c/dtd html 4.0 transitional/en","html"]),oe=["-//w3c//dtd xhtml 1.0 frameset//","-//w3c//dtd xhtml 1.0 transitional//"],ce=[...oe,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"];function Ee(e,t){return t.some((t=>e.startsWith(t)))}const Te=new Map(["attributeName","attributeType","baseFrequency","baseProfile","calcMode","clipPathUnits","diffuseConstant","edgeMode","filterUnits","glyphRef","gradientTransform","gradientUnits","kernelMatrix","kernelUnitLength","keyPoints","keySplines","keyTimes","lengthAdjust","limitingConeAngle","markerHeight","markerUnits","markerWidth","maskContentUnits","maskUnits","numOctaves","pathLength","patternContentUnits","patternTransform","patternUnits","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","refX","refY","repeatCount","repeatDur","requiredExtensions","requiredFeatures","specularConstant","specularExponent","spreadMethod","startOffset","stdDeviation","stitchTiles","surfaceScale","systemLanguage","tableValues","targetX","targetY","textLength","viewBox","viewTarget","xChannelSelector","yChannelSelector","zoomAndPan"].map((e=>[e.toLowerCase(),e]))),he=new Map([["xlink:actuate",{prefix:"xlink",name:"actuate",namespace:p.XLINK}],["xlink:arcrole",{prefix:"xlink",name:"arcrole",namespace:p.XLINK}],["xlink:href",{prefix:"xlink",name:"href",namespace:p.XLINK}],["xlink:role",{prefix:"xlink",name:"role",namespace:p.XLINK}],["xlink:show",{prefix:"xlink",name:"show",namespace:p.XLINK}],["xlink:title",{prefix:"xlink",name:"title",namespace:p.XLINK}],["xlink:type",{prefix:"xlink",name:"type",namespace:p.XLINK}],["xml:base",{prefix:"xml",name:"base",namespace:p.XML}],["xml:lang",{prefix:"xml",name:"lang",namespace:p.XML}],["xml:space",{prefix:"xml",name:"space",namespace:p.XML}],["xmlns",{prefix:"",name:"xmlns",namespace:p.XMLNS}],["xmlns:xlink",{prefix:"xmlns",name:"xlink",namespace:p.XMLNS}]]),_e=new Map(["altGlyph","altGlyphDef","altGlyphItem","animateColor","animateMotion","animateTransform","clipPath","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","foreignObject","glyphRef","linearGradient","radialGradient","textPath"].map((e=>[e.toLowerCase(),e]))),Ae=new Set([u.B,u.BIG,u.BLOCKQUOTE,u.BODY,u.BR,u.CENTER,u.CODE,u.DD,u.DIV,u.DL,u.DT,u.EM,u.EMBED,u.H1,u.H2,u.H3,u.H4,u.H5,u.H6,u.HEAD,u.HR,u.I,u.IMG,u.LI,u.LISTING,u.MENU,u.META,u.NOBR,u.OL,u.P,u.PRE,u.RUBY,u.S,u.SMALL,u.SPAN,u.STRONG,u.STRIKE,u.SUB,u.SUP,u.TABLE,u.TT,u.U,u.UL,u.VAR]);function le(e){for(let t=0;t<e.attrs.length;t++)if("definitionurl"===e.attrs[t].name){e.attrs[t].name="definitionURL";break}}function me(e){for(let t=0;t<e.attrs.length;t++){const s=Te.get(e.attrs[t].name);null!=s&&(e.attrs[t].name=s);}}function pe(e){for(let t=0;t<e.attrs.length;t++){const s=he.get(e.attrs[t].name);s&&(e.attrs[t].prefix=s.prefix,e.attrs[t].name=s.name,e.attrs[t].namespace=s.namespace);}}var de;!function(e){e[e.INITIAL=0]="INITIAL",e[e.BEFORE_HTML=1]="BEFORE_HTML",e[e.BEFORE_HEAD=2]="BEFORE_HEAD",e[e.IN_HEAD=3]="IN_HEAD",e[e.IN_HEAD_NO_SCRIPT=4]="IN_HEAD_NO_SCRIPT",e[e.AFTER_HEAD=5]="AFTER_HEAD",e[e.IN_BODY=6]="IN_BODY",e[e.TEXT=7]="TEXT",e[e.IN_TABLE=8]="IN_TABLE",e[e.IN_TABLE_TEXT=9]="IN_TABLE_TEXT",e[e.IN_CAPTION=10]="IN_CAPTION",e[e.IN_COLUMN_GROUP=11]="IN_COLUMN_GROUP",e[e.IN_TABLE_BODY=12]="IN_TABLE_BODY",e[e.IN_ROW=13]="IN_ROW",e[e.IN_CELL=14]="IN_CELL",e[e.IN_SELECT=15]="IN_SELECT",e[e.IN_SELECT_IN_TABLE=16]="IN_SELECT_IN_TABLE",e[e.IN_TEMPLATE=17]="IN_TEMPLATE",e[e.AFTER_BODY=18]="AFTER_BODY",e[e.IN_FRAMESET=19]="IN_FRAMESET",e[e.AFTER_FRAMESET=20]="AFTER_FRAMESET",e[e.AFTER_AFTER_BODY=21]="AFTER_AFTER_BODY",e[e.AFTER_AFTER_FRAMESET=22]="AFTER_AFTER_FRAMESET";}(de||(de={}));const Ie={startLine:-1,startCol:-1,startOffset:-1,endLine:-1,endCol:-1,endOffset:-1},Ne=new Set([u.TABLE,u.TBODY,u.TFOOT,u.THEAD,u.TR]),ue={scriptingEnabled:!0,sourceCodeLocationInfo:!1,treeAdapter:se,onParseError:null};class Ce{constructor(e,t,s=null,a=null){this.fragmentContext=s,this.scriptHandler=a,this.currentToken=null,this.stopped=!1,this.insertionMode=de.INITIAL,this.originalInsertionMode=de.INITIAL,this.headElement=null,this.formElement=null,this.currentNotInHTML=!1,this.tmplInsertionModeStack=[],this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1,this.options={...ue,...e},this.treeAdapter=this.options.treeAdapter,this.onParseError=this.options.onParseError,this.onParseError&&(this.options.sourceCodeLocationInfo=!0),this.document=null!=t?t:this.treeAdapter.createDocument(),this.tokenizer=new v(this.options,this),this.activeFormattingElements=new ee(this.treeAdapter),this.fragmentContextID=s?f(this.treeAdapter.getTagName(s)):u.UNKNOWN,this._setContextModes(null!=s?s:this.document,this.fragmentContextID),this.openElements=new J(this.document,this.treeAdapter,this);}static parse(e,t){const s=new this(t);return s.tokenizer.write(e,!0),s.document}static getFragmentParser(e,t){const s={...ue,...t};null!=e||(e=s.treeAdapter.createElement(N.TEMPLATE,p.HTML,[]));const a=s.treeAdapter.createElement("documentmock",p.HTML,[]),r=new this(s,a,e);return r.fragmentContextID===u.TEMPLATE&&r.tmplInsertionModeStack.unshift(de.IN_TEMPLATE),r._initTokenizerForFragmentParsing(),r._insertFakeRootElement(),r._resetInsertionMode(),r._findFormInFragmentContext(),r}getFragment(){const e=this.treeAdapter.getFirstChild(this.document),t=this.treeAdapter.createDocumentFragment();return this._adoptNodes(e,t),t}_err(e,t,s){var a;if(!this.onParseError)return;const r=null!==(a=e.location)&&void 0!==a?a:Ie,n={code:t,startLine:r.startLine,startCol:r.startCol,startOffset:r.startOffset,endLine:s?r.startLine:r.endLine,endCol:s?r.startCol:r.endCol,endOffset:s?r.startOffset:r.endOffset};this.onParseError(n);}onItemPush(e,t,s){var a,r;null===(r=(a=this.treeAdapter).onItemPush)||void 0===r||r.call(a,e),s&&this.openElements.stackTop>0&&this._setContextModes(e,t);}onItemPop(e,t){var s,a;if(this.options.sourceCodeLocationInfo&&this._setEndLocation(e,this.currentToken),null===(a=(s=this.treeAdapter).onItemPop)||void 0===a||a.call(s,e,this.openElements.current),t){let e,t;0===this.openElements.stackTop&&this.fragmentContext?(e=this.fragmentContext,t=this.fragmentContextID):({current:e,currentTagId:t}=this.openElements),this._setContextModes(e,t);}}_setContextModes(e,t){const s=e===this.document||this.treeAdapter.getNamespaceURI(e)===p.HTML;this.currentNotInHTML=!s,this.tokenizer.inForeignNode=!s&&!this._isIntegrationPoint(t,e);}_switchToTextParsing(e,t){this._insertElement(e,p.HTML),this.tokenizer.state=t,this.originalInsertionMode=this.insertionMode,this.insertionMode=de.TEXT;}switchToPlaintextParsing(){this.insertionMode=de.TEXT,this.originalInsertionMode=de.IN_BODY,this.tokenizer.state=b.PLAINTEXT;}_getAdjustedCurrentElement(){return 0===this.openElements.stackTop&&this.fragmentContext?this.fragmentContext:this.openElements.current}_findFormInFragmentContext(){let e=this.fragmentContext;for(;e;){if(this.treeAdapter.getTagName(e)===N.FORM){this.formElement=e;break}e=this.treeAdapter.getParentNode(e);}}_initTokenizerForFragmentParsing(){if(this.fragmentContext&&this.treeAdapter.getNamespaceURI(this.fragmentContext)===p.HTML)switch(this.fragmentContextID){case u.TITLE:case u.TEXTAREA:this.tokenizer.state=b.RCDATA;break;case u.STYLE:case u.XMP:case u.IFRAME:case u.NOEMBED:case u.NOFRAMES:case u.NOSCRIPT:this.tokenizer.state=b.RAWTEXT;break;case u.SCRIPT:this.tokenizer.state=b.SCRIPT_DATA;break;case u.PLAINTEXT:this.tokenizer.state=b.PLAINTEXT;}}_setDocumentType(e){const t=e.name||"",s=e.publicId||"",a=e.systemId||"";if(this.treeAdapter.setDocumentType(this.document,t,s,a),e.location){const t=this.treeAdapter.getChildNodes(this.document).find((e=>this.treeAdapter.isDocumentTypeNode(e)));t&&this.treeAdapter.setNodeSourceCodeLocation(t,e.location);}}_attachElementToTree(e,t){if(this.options.sourceCodeLocationInfo){const s=t&&{...t,startTag:t};this.treeAdapter.setNodeSourceCodeLocation(e,s);}if(this._shouldFosterParentOnInsertion())this._fosterParentElement(e);else {const t=this.openElements.currentTmplContentOrNode;this.treeAdapter.appendChild(t,e);}}_appendElement(e,t){const s=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(s,e.location);}_insertElement(e,t){const s=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(s,e.location),this.openElements.push(s,e.tagID);}_insertFakeElement(e,t){const s=this.treeAdapter.createElement(e,p.HTML,[]);this._attachElementToTree(s,null),this.openElements.push(s,t);}_insertTemplate(e){const t=this.treeAdapter.createElement(e.tagName,p.HTML,e.attrs),s=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(t,s),this._attachElementToTree(t,e.location),this.openElements.push(t,e.tagID),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(s,null);}_insertFakeRootElement(){const e=this.treeAdapter.createElement(N.HTML,p.HTML,[]);this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(e,null),this.treeAdapter.appendChild(this.openElements.current,e),this.openElements.push(e,u.HTML);}_appendCommentNode(e,t){const s=this.treeAdapter.createCommentNode(e.data);this.treeAdapter.appendChild(t,s),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(s,e.location);}_insertCharacters(e){let t,s;if(this._shouldFosterParentOnInsertion()?(({parent:t,beforeElement:s}=this._findFosterParentingLocation()),s?this.treeAdapter.insertTextBefore(t,e.chars,s):this.treeAdapter.insertText(t,e.chars)):(t=this.openElements.currentTmplContentOrNode,this.treeAdapter.insertText(t,e.chars)),!e.location)return;const a=this.treeAdapter.getChildNodes(t),r=s?a.lastIndexOf(s):a.length,n=a[r-1];if(this.treeAdapter.getNodeSourceCodeLocation(n)){const{endLine:t,endCol:s,endOffset:a}=e.location;this.treeAdapter.updateNodeSourceCodeLocation(n,{endLine:t,endCol:s,endOffset:a});}else this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(n,e.location);}_adoptNodes(e,t){for(let s=this.treeAdapter.getFirstChild(e);s;s=this.treeAdapter.getFirstChild(e))this.treeAdapter.detachNode(s),this.treeAdapter.appendChild(t,s);}_setEndLocation(e,t){if(this.treeAdapter.getNodeSourceCodeLocation(e)&&t.location){const s=t.location,a=this.treeAdapter.getTagName(e),r=t.type===h.END_TAG&&a===t.tagName?{endTag:{...s},endLine:s.endLine,endCol:s.endCol,endOffset:s.endOffset}:{endLine:s.startLine,endCol:s.startCol,endOffset:s.startOffset};this.treeAdapter.updateNodeSourceCodeLocation(e,r);}}shouldProcessStartTagTokenInForeignContent(e){if(!this.currentNotInHTML)return !1;let t,s;return 0===this.openElements.stackTop&&this.fragmentContext?(t=this.fragmentContext,s=this.fragmentContextID):({current:t,currentTagId:s}=this.openElements),(e.tagID!==u.SVG||this.treeAdapter.getTagName(t)!==N.ANNOTATION_XML||this.treeAdapter.getNamespaceURI(t)!==p.MATHML)&&(this.tokenizer.inForeignNode||(e.tagID===u.MGLYPH||e.tagID===u.MALIGNMARK)&&!this._isIntegrationPoint(s,t,p.HTML))}_processToken(e){switch(e.type){case h.CHARACTER:this.onCharacter(e);break;case h.NULL_CHARACTER:this.onNullCharacter(e);break;case h.COMMENT:this.onComment(e);break;case h.DOCTYPE:this.onDoctype(e);break;case h.START_TAG:this._processStartTag(e);break;case h.END_TAG:this.onEndTag(e);break;case h.EOF:this.onEof(e);break;case h.WHITESPACE_CHARACTER:this.onWhitespaceCharacter(e);}}_isIntegrationPoint(e,t,s){return function(e,t,s,a){return (!a||a===p.HTML)&&function(e,t,s){if(t===p.MATHML&&e===u.ANNOTATION_XML)for(let e=0;e<s.length;e++)if(s[e].name===d.ENCODING){const t=s[e].value.toLowerCase();return "text/html"===t||"application/xhtml+xml"===t}return t===p.SVG&&(e===u.FOREIGN_OBJECT||e===u.DESC||e===u.TITLE)}(e,t,s)||(!a||a===p.MATHML)&&function(e,t){return t===p.MATHML&&(e===u.MI||e===u.MO||e===u.MN||e===u.MS||e===u.MTEXT)}(e,t)}(e,this.treeAdapter.getNamespaceURI(t),this.treeAdapter.getAttrList(t),s)}_reconstructActiveFormattingElements(){const e=this.activeFormattingElements.entries.length;if(e){const t=this.activeFormattingElements.entries.findIndex((e=>e.type===Z.Marker||this.openElements.contains(e.element)));for(let s=t<0?e-1:t-1;s>=0;s--){const e=this.activeFormattingElements.entries[s];this._insertElement(e.token,this.treeAdapter.getNamespaceURI(e.element)),e.element=this.openElements.current;}}}_closeTableCell(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode=de.IN_ROW;}_closePElement(){this.openElements.generateImpliedEndTagsWithExclusion(u.P),this.openElements.popUntilTagNamePopped(u.P);}_resetInsertionMode(){for(let e=this.openElements.stackTop;e>=0;e--)switch(0===e&&this.fragmentContext?this.fragmentContextID:this.openElements.tagIDs[e]){case u.TR:return void(this.insertionMode=de.IN_ROW);case u.TBODY:case u.THEAD:case u.TFOOT:return void(this.insertionMode=de.IN_TABLE_BODY);case u.CAPTION:return void(this.insertionMode=de.IN_CAPTION);case u.COLGROUP:return void(this.insertionMode=de.IN_COLUMN_GROUP);case u.TABLE:return void(this.insertionMode=de.IN_TABLE);case u.BODY:return void(this.insertionMode=de.IN_BODY);case u.FRAMESET:return void(this.insertionMode=de.IN_FRAMESET);case u.SELECT:return void this._resetInsertionModeForSelect(e);case u.TEMPLATE:return void(this.insertionMode=this.tmplInsertionModeStack[0]);case u.HTML:return void(this.insertionMode=this.headElement?de.AFTER_HEAD:de.BEFORE_HEAD);case u.TD:case u.TH:if(e>0)return void(this.insertionMode=de.IN_CELL);break;case u.HEAD:if(e>0)return void(this.insertionMode=de.IN_HEAD)}this.insertionMode=de.IN_BODY;}_resetInsertionModeForSelect(e){if(e>0)for(let t=e-1;t>0;t--){const e=this.openElements.tagIDs[t];if(e===u.TEMPLATE)break;if(e===u.TABLE)return void(this.insertionMode=de.IN_SELECT_IN_TABLE)}this.insertionMode=de.IN_SELECT;}_isElementCausesFosterParenting(e){return Ne.has(e)}_shouldFosterParentOnInsertion(){return this.fosterParentingEnabled&&this._isElementCausesFosterParenting(this.openElements.currentTagId)}_findFosterParentingLocation(){for(let e=this.openElements.stackTop;e>=0;e--){const t=this.openElements.items[e];switch(this.openElements.tagIDs[e]){case u.TEMPLATE:if(this.treeAdapter.getNamespaceURI(t)===p.HTML)return {parent:this.treeAdapter.getTemplateContent(t),beforeElement:null};break;case u.TABLE:{const s=this.treeAdapter.getParentNode(t);return s?{parent:s,beforeElement:t}:{parent:this.openElements.items[e-1],beforeElement:null}}}}return {parent:this.openElements.items[0],beforeElement:null}}_fosterParentElement(e){const t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertBefore(t.parent,e,t.beforeElement):this.treeAdapter.appendChild(t.parent,e);}_isSpecialElement(e,t){const s=this.treeAdapter.getNamespaceURI(e);return g[s].has(t)}onCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode)!function(e,t){e._insertCharacters(t),e.framesetOk=!1;}(this,e);else switch(this.insertionMode){case de.INITIAL:Pe(this,e);break;case de.BEFORE_HTML:be(this,e);break;case de.BEFORE_HEAD:Be(this,e);break;case de.IN_HEAD:Ue(this,e);break;case de.IN_HEAD_NO_SCRIPT:Ge(this,e);break;case de.AFTER_HEAD:ye(this,e);break;case de.IN_BODY:case de.IN_CAPTION:case de.IN_CELL:case de.IN_TEMPLATE:xe(this,e);break;case de.TEXT:case de.IN_SELECT:case de.IN_SELECT_IN_TABLE:this._insertCharacters(e);break;case de.IN_TABLE:case de.IN_TABLE_BODY:case de.IN_ROW:je(this,e);break;case de.IN_TABLE_TEXT:tt(this,e);break;case de.IN_COLUMN_GROUP:nt(this,e);break;case de.AFTER_BODY:lt(this,e);break;case de.AFTER_AFTER_BODY:mt(this,e);}}onNullCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode)!function(e,t){t.chars=s,e._insertCharacters(t);}(this,e);else switch(this.insertionMode){case de.INITIAL:Pe(this,e);break;case de.BEFORE_HTML:be(this,e);break;case de.BEFORE_HEAD:Be(this,e);break;case de.IN_HEAD:Ue(this,e);break;case de.IN_HEAD_NO_SCRIPT:Ge(this,e);break;case de.AFTER_HEAD:ye(this,e);break;case de.TEXT:this._insertCharacters(e);break;case de.IN_TABLE:case de.IN_TABLE_BODY:case de.IN_ROW:je(this,e);break;case de.IN_COLUMN_GROUP:nt(this,e);break;case de.AFTER_BODY:lt(this,e);break;case de.AFTER_AFTER_BODY:mt(this,e);}}onComment(e){if(this.skipNextNewLine=!1,this.currentNotInHTML)Me(this,e);else switch(this.insertionMode){case de.INITIAL:case de.BEFORE_HTML:case de.BEFORE_HEAD:case de.IN_HEAD:case de.IN_HEAD_NO_SCRIPT:case de.AFTER_HEAD:case de.IN_BODY:case de.IN_TABLE:case de.IN_CAPTION:case de.IN_COLUMN_GROUP:case de.IN_TABLE_BODY:case de.IN_ROW:case de.IN_CELL:case de.IN_SELECT:case de.IN_SELECT_IN_TABLE:case de.IN_TEMPLATE:case de.IN_FRAMESET:case de.AFTER_FRAMESET:Me(this,e);break;case de.IN_TABLE_TEXT:st(this,e);break;case de.AFTER_BODY:!function(e,t){e._appendCommentNode(t,e.openElements.items[0]);}(this,e);break;case de.AFTER_AFTER_BODY:case de.AFTER_AFTER_FRAMESET:!function(e,t){e._appendCommentNode(t,e.document);}(this,e);}}onDoctype(e){switch(this.skipNextNewLine=!1,this.insertionMode){case de.INITIAL:!function(e,t){e._setDocumentType(t);const s=t.forceQuirks?I.QUIRKS:function(e){if(e.name!==ae)return I.QUIRKS;const{systemId:t}=e;if(t&&"http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"===t.toLowerCase())return I.QUIRKS;let{publicId:s}=e;if(null!==s){if(s=s.toLowerCase(),ie.has(s))return I.QUIRKS;let e=null===t?ne:re;if(Ee(s,e))return I.QUIRKS;if(e=null===t?oe:ce,Ee(s,e))return I.LIMITED_QUIRKS}return I.NO_QUIRKS}(t);(function(e){return e.name===ae&&null===e.publicId&&(null===e.systemId||"about:legacy-compat"===e.systemId)})(t)||e._err(t,T.nonConformingDoctype),e.treeAdapter.setDocumentMode(e.document,s),e.insertionMode=de.BEFORE_HTML;}(this,e);break;case de.BEFORE_HEAD:case de.IN_HEAD:case de.IN_HEAD_NO_SCRIPT:case de.AFTER_HEAD:this._err(e,T.misplacedDoctype);break;case de.IN_TABLE_TEXT:st(this,e);}}onStartTag(e){this.skipNextNewLine=!1,this.currentToken=e,this._processStartTag(e),e.selfClosing&&!e.ackSelfClosing&&this._err(e,T.nonVoidHtmlElementStartTagWithTrailingSolidus);}_processStartTag(e){this.shouldProcessStartTagTokenInForeignContent(e)?function(e,t){if(function(e){const t=e.tagID;return t===u.FONT&&e.attrs.some((({name:e})=>e===d.COLOR||e===d.SIZE||e===d.FACE))||Ae.has(t)}(t))pt(e),e._startTagOutsideForeignContent(t);else {const s=e._getAdjustedCurrentElement(),a=e.treeAdapter.getNamespaceURI(s);a===p.MATHML?le(t):a===p.SVG&&(function(e){const t=_e.get(e.tagName);null!=t&&(e.tagName=t,e.tagID=f(e.tagName));}(t),me(t)),pe(t),t.selfClosing?e._appendElement(t,a):e._insertElement(t,a),t.ackSelfClosing=!0;}}(this,e):this._startTagOutsideForeignContent(e);}_startTagOutsideForeignContent(e){switch(this.insertionMode){case de.INITIAL:Pe(this,e);break;case de.BEFORE_HTML:!function(e,t){t.tagID===u.HTML?(e._insertElement(t,p.HTML),e.insertionMode=de.BEFORE_HEAD):be(e,t);}(this,e);break;case de.BEFORE_HEAD:!function(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.HEAD:e._insertElement(t,p.HTML),e.headElement=e.openElements.current,e.insertionMode=de.IN_HEAD;break;default:Be(e,t);}}(this,e);break;case de.IN_HEAD:He(this,e);break;case de.IN_HEAD_NO_SCRIPT:!function(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.BASEFONT:case u.BGSOUND:case u.HEAD:case u.LINK:case u.META:case u.NOFRAMES:case u.STYLE:He(e,t);break;case u.NOSCRIPT:e._err(t,T.nestedNoscriptInHead);break;default:Ge(e,t);}}(this,e);break;case de.AFTER_HEAD:!function(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.BODY:e._insertElement(t,p.HTML),e.framesetOk=!1,e.insertionMode=de.IN_BODY;break;case u.FRAMESET:e._insertElement(t,p.HTML),e.insertionMode=de.IN_FRAMESET;break;case u.BASE:case u.BASEFONT:case u.BGSOUND:case u.LINK:case u.META:case u.NOFRAMES:case u.SCRIPT:case u.STYLE:case u.TEMPLATE:case u.TITLE:e._err(t,T.abandonedHeadElementChild),e.openElements.push(e.headElement,u.HEAD),He(e,t),e.openElements.remove(e.headElement);break;case u.HEAD:e._err(t,T.misplacedStartTagForHeadElement);break;default:ye(e,t);}}(this,e);break;case de.IN_BODY:Xe(this,e);break;case de.IN_TABLE:Je(this,e);break;case de.IN_TABLE_TEXT:st(this,e);break;case de.IN_CAPTION:!function(e,t){const s=t.tagID;at.has(s)?e.openElements.hasInTableScope(u.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(u.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=de.IN_TABLE,Je(e,t)):Xe(e,t);}(this,e);break;case de.IN_COLUMN_GROUP:rt(this,e);break;case de.IN_TABLE_BODY:it(this,e);break;case de.IN_ROW:ct(this,e);break;case de.IN_CELL:!function(e,t){const s=t.tagID;at.has(s)?(e.openElements.hasInTableScope(u.TD)||e.openElements.hasInTableScope(u.TH))&&(e._closeTableCell(),ct(e,t)):Xe(e,t);}(this,e);break;case de.IN_SELECT:Tt(this,e);break;case de.IN_SELECT_IN_TABLE:!function(e,t){const s=t.tagID;s===u.CAPTION||s===u.TABLE||s===u.TBODY||s===u.TFOOT||s===u.THEAD||s===u.TR||s===u.TD||s===u.TH?(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode(),e._processStartTag(t)):Tt(e,t);}(this,e);break;case de.IN_TEMPLATE:!function(e,t){switch(t.tagID){case u.BASE:case u.BASEFONT:case u.BGSOUND:case u.LINK:case u.META:case u.NOFRAMES:case u.SCRIPT:case u.STYLE:case u.TEMPLATE:case u.TITLE:He(e,t);break;case u.CAPTION:case u.COLGROUP:case u.TBODY:case u.TFOOT:case u.THEAD:e.tmplInsertionModeStack[0]=de.IN_TABLE,e.insertionMode=de.IN_TABLE,Je(e,t);break;case u.COL:e.tmplInsertionModeStack[0]=de.IN_COLUMN_GROUP,e.insertionMode=de.IN_COLUMN_GROUP,rt(e,t);break;case u.TR:e.tmplInsertionModeStack[0]=de.IN_TABLE_BODY,e.insertionMode=de.IN_TABLE_BODY,it(e,t);break;case u.TD:case u.TH:e.tmplInsertionModeStack[0]=de.IN_ROW,e.insertionMode=de.IN_ROW,ct(e,t);break;default:e.tmplInsertionModeStack[0]=de.IN_BODY,e.insertionMode=de.IN_BODY,Xe(e,t);}}(this,e);break;case de.AFTER_BODY:!function(e,t){t.tagID===u.HTML?Xe(e,t):lt(e,t);}(this,e);break;case de.IN_FRAMESET:!function(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.FRAMESET:e._insertElement(t,p.HTML);break;case u.FRAME:e._appendElement(t,p.HTML),t.ackSelfClosing=!0;break;case u.NOFRAMES:He(e,t);}}(this,e);break;case de.AFTER_FRAMESET:!function(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.NOFRAMES:He(e,t);}}(this,e);break;case de.AFTER_AFTER_BODY:!function(e,t){t.tagID===u.HTML?Xe(e,t):mt(e,t);}(this,e);break;case de.AFTER_AFTER_FRAMESET:!function(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.NOFRAMES:He(e,t);}}(this,e);}}onEndTag(e){this.skipNextNewLine=!1,this.currentToken=e,this.currentNotInHTML?function(e,t){if(t.tagID===u.P||t.tagID===u.BR)return pt(e),void e._endTagOutsideForeignContent(t);for(let s=e.openElements.stackTop;s>0;s--){const a=e.openElements.items[s];if(e.treeAdapter.getNamespaceURI(a)===p.HTML){e._endTagOutsideForeignContent(t);break}const r=e.treeAdapter.getTagName(a);if(r.toLowerCase()===t.tagName){t.tagName=r,e.openElements.shortenToLength(s);break}}}(this,e):this._endTagOutsideForeignContent(e);}_endTagOutsideForeignContent(e){switch(this.insertionMode){case de.INITIAL:Pe(this,e);break;case de.BEFORE_HTML:!function(e,t){const s=t.tagID;s!==u.HTML&&s!==u.HEAD&&s!==u.BODY&&s!==u.BR||be(e,t);}(this,e);break;case de.BEFORE_HEAD:!function(e,t){const s=t.tagID;s===u.HEAD||s===u.BODY||s===u.HTML||s===u.BR?Be(e,t):e._err(t,T.endTagWithoutMatchingOpenElement);}(this,e);break;case de.IN_HEAD:!function(e,t){switch(t.tagID){case u.HEAD:e.openElements.pop(),e.insertionMode=de.AFTER_HEAD;break;case u.BODY:case u.BR:case u.HTML:Ue(e,t);break;case u.TEMPLATE:Fe(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case de.IN_HEAD_NO_SCRIPT:!function(e,t){switch(t.tagID){case u.NOSCRIPT:e.openElements.pop(),e.insertionMode=de.IN_HEAD;break;case u.BR:Ge(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case de.AFTER_HEAD:!function(e,t){switch(t.tagID){case u.BODY:case u.HTML:case u.BR:ye(e,t);break;case u.TEMPLATE:Fe(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case de.IN_BODY:Ve(this,e);break;case de.TEXT:!function(e,t){var s;t.tagID===u.SCRIPT&&(null===(s=e.scriptHandler)||void 0===s||s.call(e,e.openElements.current)),e.openElements.pop(),e.insertionMode=e.originalInsertionMode;}(this,e);break;case de.IN_TABLE:Ze(this,e);break;case de.IN_TABLE_TEXT:st(this,e);break;case de.IN_CAPTION:!function(e,t){const s=t.tagID;switch(s){case u.CAPTION:case u.TABLE:e.openElements.hasInTableScope(u.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(u.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=de.IN_TABLE,s===u.TABLE&&Ze(e,t));break;case u.BODY:case u.COL:case u.COLGROUP:case u.HTML:case u.TBODY:case u.TD:case u.TFOOT:case u.TH:case u.THEAD:case u.TR:break;default:Ve(e,t);}}(this,e);break;case de.IN_COLUMN_GROUP:!function(e,t){switch(t.tagID){case u.COLGROUP:e.openElements.currentTagId===u.COLGROUP&&(e.openElements.pop(),e.insertionMode=de.IN_TABLE);break;case u.TEMPLATE:Fe(e,t);break;case u.COL:break;default:nt(e,t);}}(this,e);break;case de.IN_TABLE_BODY:ot(this,e);break;case de.IN_ROW:Et(this,e);break;case de.IN_CELL:!function(e,t){const s=t.tagID;switch(s){case u.TD:case u.TH:e.openElements.hasInTableScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=de.IN_ROW);break;case u.TABLE:case u.TBODY:case u.TFOOT:case u.THEAD:case u.TR:e.openElements.hasInTableScope(s)&&(e._closeTableCell(),Et(e,t));break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:break;default:Ve(e,t);}}(this,e);break;case de.IN_SELECT:ht(this,e);break;case de.IN_SELECT_IN_TABLE:!function(e,t){const s=t.tagID;s===u.CAPTION||s===u.TABLE||s===u.TBODY||s===u.TFOOT||s===u.THEAD||s===u.TR||s===u.TD||s===u.TH?e.openElements.hasInTableScope(s)&&(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode(),e.onEndTag(t)):ht(e,t);}(this,e);break;case de.IN_TEMPLATE:!function(e,t){t.tagID===u.TEMPLATE&&Fe(e,t);}(this,e);break;case de.AFTER_BODY:At(this,e);break;case de.IN_FRAMESET:!function(e,t){t.tagID!==u.FRAMESET||e.openElements.isRootHtmlElementCurrent()||(e.openElements.pop(),e.fragmentContext||e.openElements.currentTagId===u.FRAMESET||(e.insertionMode=de.AFTER_FRAMESET));}(this,e);break;case de.AFTER_FRAMESET:!function(e,t){t.tagID===u.HTML&&(e.insertionMode=de.AFTER_AFTER_FRAMESET);}(this,e);break;case de.AFTER_AFTER_BODY:mt(this,e);}}onEof(e){switch(this.insertionMode){case de.INITIAL:Pe(this,e);break;case de.BEFORE_HTML:be(this,e);break;case de.BEFORE_HEAD:Be(this,e);break;case de.IN_HEAD:Ue(this,e);break;case de.IN_HEAD_NO_SCRIPT:Ge(this,e);break;case de.AFTER_HEAD:ye(this,e);break;case de.IN_BODY:case de.IN_TABLE:case de.IN_CAPTION:case de.IN_COLUMN_GROUP:case de.IN_TABLE_BODY:case de.IN_ROW:case de.IN_CELL:case de.IN_SELECT:case de.IN_SELECT_IN_TABLE:ze(this,e);break;case de.TEXT:!function(e,t){e._err(t,T.eofInElementThatCanContainOnlyText),e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e.onEof(t);}(this,e);break;case de.IN_TABLE_TEXT:st(this,e);break;case de.IN_TEMPLATE:_t(this,e);break;case de.AFTER_BODY:case de.IN_FRAMESET:case de.AFTER_FRAMESET:case de.AFTER_AFTER_BODY:case de.AFTER_AFTER_FRAMESET:ke(this,e);}}onWhitespaceCharacter(e){if(this.skipNextNewLine&&(this.skipNextNewLine=!1,e.chars.charCodeAt(0)===a.LINE_FEED)){if(1===e.chars.length)return;e.chars=e.chars.substr(1);}if(this.tokenizer.inForeignNode)this._insertCharacters(e);else switch(this.insertionMode){case de.IN_HEAD:case de.IN_HEAD_NO_SCRIPT:case de.AFTER_HEAD:case de.TEXT:case de.IN_COLUMN_GROUP:case de.IN_SELECT:case de.IN_SELECT_IN_TABLE:case de.IN_FRAMESET:case de.AFTER_FRAMESET:this._insertCharacters(e);break;case de.IN_BODY:case de.IN_CAPTION:case de.IN_CELL:case de.IN_TEMPLATE:case de.AFTER_BODY:case de.AFTER_AFTER_BODY:case de.AFTER_AFTER_FRAMESET:Ye(this,e);break;case de.IN_TABLE:case de.IN_TABLE_BODY:case de.IN_ROW:je(this,e);break;case de.IN_TABLE_TEXT:et(this,e);}}}function De(e,t){let s=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return s?e.openElements.contains(s.element)?e.openElements.hasInScope(t.tagID)||(s=null):(e.activeFormattingElements.removeEntry(s),s=null):Ke(e,t),s}function Se(e,t){let s=null,a=e.openElements.stackTop;for(;a>=0;a--){const r=e.openElements.items[a];if(r===t.element)break;e._isSpecialElement(r,e.openElements.tagIDs[a])&&(s=r);}return s||(e.openElements.shortenToLength(a<0?0:a),e.activeFormattingElements.removeEntry(t)),s}function Re(e,t,s){let a=t,r=e.openElements.getCommonAncestor(t);for(let n=0,i=r;i!==s;n++,i=r){r=e.openElements.getCommonAncestor(i);const s=e.activeFormattingElements.getElementEntry(i),o=s&&n>=3;!s||o?(o&&e.activeFormattingElements.removeEntry(s),e.openElements.remove(i)):(i=Oe(e,s),a===t&&(e.activeFormattingElements.bookmark=s),e.treeAdapter.detachNode(a),e.treeAdapter.appendChild(i,a),a=i);}return a}function Oe(e,t){const s=e.treeAdapter.getNamespaceURI(t.element),a=e.treeAdapter.createElement(t.token.tagName,s,t.token.attrs);return e.openElements.replace(t.element,a),t.element=a,a}function fe(e,t,s){const a=f(e.treeAdapter.getTagName(t));if(e._isElementCausesFosterParenting(a))e._fosterParentElement(s);else {const r=e.treeAdapter.getNamespaceURI(t);a===u.TEMPLATE&&r===p.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,s);}}function Le(e,t,s){const a=e.treeAdapter.getNamespaceURI(s.element),{token:r}=s,n=e.treeAdapter.createElement(r.tagName,a,r.attrs);e._adoptNodes(t,n),e.treeAdapter.appendChild(t,n),e.activeFormattingElements.insertElementAfterBookmark(n,r),e.activeFormattingElements.removeEntry(s),e.openElements.remove(s.element),e.openElements.insertAfter(t,n,r.tagID);}function ge(e,t){for(let s=0;s<8;s++){const s=De(e,t);if(!s)break;const a=Se(e,s);if(!a)break;e.activeFormattingElements.bookmark=s;const r=Re(e,a,s.element),n=e.openElements.getCommonAncestor(s.element);e.treeAdapter.detachNode(r),n&&fe(e,n,r),Le(e,a,s);}}function Me(e,t){e._appendCommentNode(t,e.openElements.currentTmplContentOrNode);}function ke(e,t){if(e.stopped=!0,t.location){const s=e.fragmentContext?0:2;for(let a=e.openElements.stackTop;a>=s;a--)e._setEndLocation(e.openElements.items[a],t);if(!e.fragmentContext&&e.openElements.stackTop>=0){const s=e.openElements.items[0],a=e.treeAdapter.getNodeSourceCodeLocation(s);if(a&&!a.endTag&&(e._setEndLocation(s,t),e.openElements.stackTop>=1)){const s=e.openElements.items[1],a=e.treeAdapter.getNodeSourceCodeLocation(s);a&&!a.endTag&&e._setEndLocation(s,t);}}}}function Pe(e,t){e._err(t,T.missingDoctype,!0),e.treeAdapter.setDocumentMode(e.document,I.QUIRKS),e.insertionMode=de.BEFORE_HTML,e._processToken(t);}function be(e,t){e._insertFakeRootElement(),e.insertionMode=de.BEFORE_HEAD,e._processToken(t);}function Be(e,t){e._insertFakeElement(N.HEAD,u.HEAD),e.headElement=e.openElements.current,e.insertionMode=de.IN_HEAD,e._processToken(t);}function He(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.BASE:case u.BASEFONT:case u.BGSOUND:case u.LINK:case u.META:e._appendElement(t,p.HTML),t.ackSelfClosing=!0;break;case u.TITLE:e._switchToTextParsing(t,b.RCDATA);break;case u.NOSCRIPT:e.options.scriptingEnabled?e._switchToTextParsing(t,b.RAWTEXT):(e._insertElement(t,p.HTML),e.insertionMode=de.IN_HEAD_NO_SCRIPT);break;case u.NOFRAMES:case u.STYLE:e._switchToTextParsing(t,b.RAWTEXT);break;case u.SCRIPT:e._switchToTextParsing(t,b.SCRIPT_DATA);break;case u.TEMPLATE:e._insertTemplate(t),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode=de.IN_TEMPLATE,e.tmplInsertionModeStack.unshift(de.IN_TEMPLATE);break;case u.HEAD:e._err(t,T.misplacedStartTagForHeadElement);break;default:Ue(e,t);}}function Fe(e,t){e.openElements.tmplCount>0?(e.openElements.generateImpliedEndTagsThoroughly(),e.openElements.currentTagId!==u.TEMPLATE&&e._err(t,T.closingOfElementWithOpenChildElements),e.openElements.popUntilTagNamePopped(u.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode()):e._err(t,T.endTagWithoutMatchingOpenElement);}function Ue(e,t){e.openElements.pop(),e.insertionMode=de.AFTER_HEAD,e._processToken(t);}function Ge(e,t){const s=t.type===h.EOF?T.openElementsLeftAfterEof:T.disallowedContentInNoscriptInHead;e._err(t,s),e.openElements.pop(),e.insertionMode=de.IN_HEAD,e._processToken(t);}function ye(e,t){e._insertFakeElement(N.BODY,u.BODY),e.insertionMode=de.IN_BODY,we(e,t);}function we(e,t){switch(t.type){case h.CHARACTER:xe(e,t);break;case h.WHITESPACE_CHARACTER:Ye(e,t);break;case h.COMMENT:Me(e,t);break;case h.START_TAG:Xe(e,t);break;case h.END_TAG:Ve(e,t);break;case h.EOF:ze(e,t);}}function Ye(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t);}function xe(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1;}function ve(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,p.HTML),e.framesetOk=!1,t.ackSelfClosing=!0;}function Qe(e){const t=A(e,d.TYPE);return null!=t&&"hidden"===t.toLowerCase()}function qe(e,t){e._switchToTextParsing(t,b.RAWTEXT);}function We(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML);}function Xe(e,t){switch(t.tagID){case u.I:case u.S:case u.B:case u.U:case u.EM:case u.TT:case u.BIG:case u.CODE:case u.FONT:case u.SMALL:case u.STRIKE:case u.STRONG:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case u.A:!function(e,t){const s=e.activeFormattingElements.getElementEntryInScopeWithTagName(N.A);s&&(ge(e,t),e.openElements.remove(s.element),e.activeFormattingElements.removeEntry(s)),e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case u.H1:case u.H2:case u.H3:case u.H4:case u.H5:case u.H6:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),M(e.openElements.currentTagId)&&e.openElements.pop(),e._insertElement(t,p.HTML);}(e,t);break;case u.P:case u.DL:case u.OL:case u.UL:case u.DIV:case u.DIR:case u.NAV:case u.MAIN:case u.MENU:case u.ASIDE:case u.CENTER:case u.FIGURE:case u.FOOTER:case u.HEADER:case u.HGROUP:case u.DIALOG:case u.DETAILS:case u.ADDRESS:case u.ARTICLE:case u.SECTION:case u.SUMMARY:case u.FIELDSET:case u.BLOCKQUOTE:case u.FIGCAPTION:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML);}(e,t);break;case u.LI:case u.DD:case u.DT:!function(e,t){e.framesetOk=!1;const s=t.tagID;for(let t=e.openElements.stackTop;t>=0;t--){const a=e.openElements.tagIDs[t];if(s===u.LI&&a===u.LI||(s===u.DD||s===u.DT)&&(a===u.DD||a===u.DT)){e.openElements.generateImpliedEndTagsWithExclusion(a),e.openElements.popUntilTagNamePopped(a);break}if(a!==u.ADDRESS&&a!==u.DIV&&a!==u.P&&e._isSpecialElement(e.openElements.items[t],a))break}e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML);}(e,t);break;case u.BR:case u.IMG:case u.WBR:case u.AREA:case u.EMBED:case u.KEYGEN:ve(e,t);break;case u.HR:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._appendElement(t,p.HTML),e.framesetOk=!1,t.ackSelfClosing=!0;}(e,t);break;case u.RB:case u.RTC:!function(e,t){e.openElements.hasInScope(u.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,p.HTML);}(e,t);break;case u.RT:case u.RP:!function(e,t){e.openElements.hasInScope(u.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion(u.RTC),e._insertElement(t,p.HTML);}(e,t);break;case u.PRE:case u.LISTING:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),e.skipNextNewLine=!0,e.framesetOk=!1;}(e,t);break;case u.XMP:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,b.RAWTEXT);}(e,t);break;case u.SVG:!function(e,t){e._reconstructActiveFormattingElements(),me(t),pe(t),t.selfClosing?e._appendElement(t,p.SVG):e._insertElement(t,p.SVG),t.ackSelfClosing=!0;}(e,t);break;case u.HTML:!function(e,t){0===e.openElements.tmplCount&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs);}(e,t);break;case u.BASE:case u.LINK:case u.META:case u.STYLE:case u.TITLE:case u.SCRIPT:case u.BGSOUND:case u.BASEFONT:case u.TEMPLATE:He(e,t);break;case u.BODY:!function(e,t){const s=e.openElements.tryPeekProperlyNestedBodyElement();s&&0===e.openElements.tmplCount&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(s,t.attrs));}(e,t);break;case u.FORM:!function(e,t){const s=e.openElements.tmplCount>0;e.formElement&&!s||(e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),s||(e.formElement=e.openElements.current));}(e,t);break;case u.NOBR:!function(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope(u.NOBR)&&(ge(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,p.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case u.MATH:!function(e,t){e._reconstructActiveFormattingElements(),le(t),pe(t),t.selfClosing?e._appendElement(t,p.MATHML):e._insertElement(t,p.MATHML),t.ackSelfClosing=!0;}(e,t);break;case u.TABLE:!function(e,t){e.treeAdapter.getDocumentMode(e.document)!==I.QUIRKS&&e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),e.framesetOk=!1,e.insertionMode=de.IN_TABLE;}(e,t);break;case u.INPUT:!function(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,p.HTML),Qe(t)||(e.framesetOk=!1),t.ackSelfClosing=!0;}(e,t);break;case u.PARAM:case u.TRACK:case u.SOURCE:!function(e,t){e._appendElement(t,p.HTML),t.ackSelfClosing=!0;}(e,t);break;case u.IMAGE:!function(e,t){t.tagName=N.IMG,t.tagID=u.IMG,ve(e,t);}(e,t);break;case u.BUTTON:!function(e,t){e.openElements.hasInScope(u.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(u.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.framesetOk=!1;}(e,t);break;case u.APPLET:case u.OBJECT:case u.MARQUEE:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1;}(e,t);break;case u.IFRAME:!function(e,t){e.framesetOk=!1,e._switchToTextParsing(t,b.RAWTEXT);}(e,t);break;case u.SELECT:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.framesetOk=!1,e.insertionMode=e.insertionMode===de.IN_TABLE||e.insertionMode===de.IN_CAPTION||e.insertionMode===de.IN_TABLE_BODY||e.insertionMode===de.IN_ROW||e.insertionMode===de.IN_CELL?de.IN_SELECT_IN_TABLE:de.IN_SELECT;}(e,t);break;case u.OPTION:case u.OPTGROUP:!function(e,t){e.openElements.currentTagId===u.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML);}(e,t);break;case u.NOEMBED:qe(e,t);break;case u.FRAMESET:!function(e,t){const s=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&s&&(e.treeAdapter.detachNode(s),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,p.HTML),e.insertionMode=de.IN_FRAMESET);}(e,t);break;case u.TEXTAREA:!function(e,t){e._insertElement(t,p.HTML),e.skipNextNewLine=!0,e.tokenizer.state=b.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode=de.TEXT;}(e,t);break;case u.NOSCRIPT:e.options.scriptingEnabled?qe(e,t):We(e,t);break;case u.PLAINTEXT:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),e.tokenizer.state=b.PLAINTEXT;}(e,t);break;case u.COL:case u.TH:case u.TD:case u.TR:case u.HEAD:case u.FRAME:case u.TBODY:case u.TFOOT:case u.THEAD:case u.CAPTION:case u.COLGROUP:break;default:We(e,t);}}function Ke(e,t){const s=t.tagName,a=t.tagID;for(let t=e.openElements.stackTop;t>0;t--){const r=e.openElements.items[t],n=e.openElements.tagIDs[t];if(a===n&&(a!==u.UNKNOWN||e.treeAdapter.getTagName(r)===s)){e.openElements.generateImpliedEndTagsWithExclusion(a),e.openElements.stackTop>=t&&e.openElements.shortenToLength(t);break}if(e._isSpecialElement(r,n))break}}function Ve(e,t){switch(t.tagID){case u.A:case u.B:case u.I:case u.S:case u.U:case u.EM:case u.TT:case u.BIG:case u.CODE:case u.FONT:case u.NOBR:case u.SMALL:case u.STRIKE:case u.STRONG:ge(e,t);break;case u.P:!function(e){e.openElements.hasInButtonScope(u.P)||e._insertFakeElement(N.P,u.P),e._closePElement();}(e);break;case u.DL:case u.UL:case u.OL:case u.DIR:case u.DIV:case u.NAV:case u.PRE:case u.MAIN:case u.MENU:case u.ASIDE:case u.BUTTON:case u.CENTER:case u.FIGURE:case u.FOOTER:case u.HEADER:case u.HGROUP:case u.DIALOG:case u.ADDRESS:case u.ARTICLE:case u.DETAILS:case u.SECTION:case u.SUMMARY:case u.LISTING:case u.FIELDSET:case u.BLOCKQUOTE:case u.FIGCAPTION:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s));}(e,t);break;case u.LI:!function(e){e.openElements.hasInListItemScope(u.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion(u.LI),e.openElements.popUntilTagNamePopped(u.LI));}(e);break;case u.DD:case u.DT:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTagsWithExclusion(s),e.openElements.popUntilTagNamePopped(s));}(e,t);break;case u.H1:case u.H2:case u.H3:case u.H4:case u.H5:case u.H6:!function(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped());}(e);break;case u.BR:!function(e){e._reconstructActiveFormattingElements(),e._insertFakeElement(N.BR,u.BR),e.openElements.pop(),e.framesetOk=!1;}(e);break;case u.BODY:!function(e,t){if(e.openElements.hasInScope(u.BODY)&&(e.insertionMode=de.AFTER_BODY,e.options.sourceCodeLocationInfo)){const s=e.openElements.tryPeekProperlyNestedBodyElement();s&&e._setEndLocation(s,t);}}(e,t);break;case u.HTML:!function(e,t){e.openElements.hasInScope(u.BODY)&&(e.insertionMode=de.AFTER_BODY,At(e,t));}(e,t);break;case u.FORM:!function(e){const t=e.openElements.tmplCount>0,{formElement:s}=e;t||(e.formElement=null),(s||t)&&e.openElements.hasInScope(u.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped(u.FORM):s&&e.openElements.remove(s));}(e);break;case u.APPLET:case u.OBJECT:case u.MARQUEE:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s),e.activeFormattingElements.clearToLastMarker());}(e,t);break;case u.TEMPLATE:Fe(e,t);break;default:Ke(e,t);}}function ze(e,t){e.tmplInsertionModeStack.length>0?_t(e,t):ke(e,t);}function je(e,t){if(Ne.has(e.openElements.currentTagId))switch(e.pendingCharacterTokens.length=0,e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode=de.IN_TABLE_TEXT,t.type){case h.CHARACTER:tt(e,t);break;case h.WHITESPACE_CHARACTER:et(e,t);}else $e(e,t);}function Je(e,t){switch(t.tagID){case u.TD:case u.TH:case u.TR:!function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(N.TBODY,u.TBODY),e.insertionMode=de.IN_TABLE_BODY,it(e,t);}(e,t);break;case u.STYLE:case u.SCRIPT:case u.TEMPLATE:He(e,t);break;case u.COL:!function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(N.COLGROUP,u.COLGROUP),e.insertionMode=de.IN_COLUMN_GROUP,rt(e,t);}(e,t);break;case u.FORM:!function(e,t){e.formElement||0!==e.openElements.tmplCount||(e._insertElement(t,p.HTML),e.formElement=e.openElements.current,e.openElements.pop());}(e,t);break;case u.TABLE:!function(e,t){e.openElements.hasInTableScope(u.TABLE)&&(e.openElements.popUntilTagNamePopped(u.TABLE),e._resetInsertionMode(),e._processStartTag(t));}(e,t);break;case u.TBODY:case u.TFOOT:case u.THEAD:!function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,p.HTML),e.insertionMode=de.IN_TABLE_BODY;}(e,t);break;case u.INPUT:!function(e,t){Qe(t)?e._appendElement(t,p.HTML):$e(e,t),t.ackSelfClosing=!0;}(e,t);break;case u.CAPTION:!function(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,p.HTML),e.insertionMode=de.IN_CAPTION;}(e,t);break;case u.COLGROUP:!function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,p.HTML),e.insertionMode=de.IN_COLUMN_GROUP;}(e,t);break;default:$e(e,t);}}function Ze(e,t){switch(t.tagID){case u.TABLE:e.openElements.hasInTableScope(u.TABLE)&&(e.openElements.popUntilTagNamePopped(u.TABLE),e._resetInsertionMode());break;case u.TEMPLATE:Fe(e,t);break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:case u.TBODY:case u.TD:case u.TFOOT:case u.TH:case u.THEAD:case u.TR:break;default:$e(e,t);}}function $e(e,t){const s=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,we(e,t),e.fosterParentingEnabled=s;}function et(e,t){e.pendingCharacterTokens.push(t);}function tt(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0;}function st(e,t){let s=0;if(e.hasNonWhitespacePendingCharacterToken)for(;s<e.pendingCharacterTokens.length;s++)$e(e,e.pendingCharacterTokens[s]);else for(;s<e.pendingCharacterTokens.length;s++)e._insertCharacters(e.pendingCharacterTokens[s]);e.insertionMode=e.originalInsertionMode,e._processToken(t);}const at=new Set([u.CAPTION,u.COL,u.COLGROUP,u.TBODY,u.TD,u.TFOOT,u.TH,u.THEAD,u.TR]);function rt(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.COL:e._appendElement(t,p.HTML),t.ackSelfClosing=!0;break;case u.TEMPLATE:He(e,t);break;default:nt(e,t);}}function nt(e,t){e.openElements.currentTagId===u.COLGROUP&&(e.openElements.pop(),e.insertionMode=de.IN_TABLE,e._processToken(t));}function it(e,t){switch(t.tagID){case u.TR:e.openElements.clearBackToTableBodyContext(),e._insertElement(t,p.HTML),e.insertionMode=de.IN_ROW;break;case u.TH:case u.TD:e.openElements.clearBackToTableBodyContext(),e._insertFakeElement(N.TR,u.TR),e.insertionMode=de.IN_ROW,ct(e,t);break;case u.CAPTION:case u.COL:case u.COLGROUP:case u.TBODY:case u.TFOOT:case u.THEAD:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=de.IN_TABLE,Je(e,t));break;default:Je(e,t);}}function ot(e,t){const s=t.tagID;switch(t.tagID){case u.TBODY:case u.TFOOT:case u.THEAD:e.openElements.hasInTableScope(s)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=de.IN_TABLE);break;case u.TABLE:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=de.IN_TABLE,Ze(e,t));break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:case u.TD:case u.TH:case u.TR:break;default:Ze(e,t);}}function ct(e,t){switch(t.tagID){case u.TH:case u.TD:e.openElements.clearBackToTableRowContext(),e._insertElement(t,p.HTML),e.insertionMode=de.IN_CELL,e.activeFormattingElements.insertMarker();break;case u.CAPTION:case u.COL:case u.COLGROUP:case u.TBODY:case u.TFOOT:case u.THEAD:case u.TR:e.openElements.hasInTableScope(u.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=de.IN_TABLE_BODY,it(e,t));break;default:Je(e,t);}}function Et(e,t){switch(t.tagID){case u.TR:e.openElements.hasInTableScope(u.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=de.IN_TABLE_BODY);break;case u.TABLE:e.openElements.hasInTableScope(u.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=de.IN_TABLE_BODY,ot(e,t));break;case u.TBODY:case u.TFOOT:case u.THEAD:(e.openElements.hasInTableScope(t.tagID)||e.openElements.hasInTableScope(u.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=de.IN_TABLE_BODY,ot(e,t));break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:case u.TD:case u.TH:break;default:Ze(e,t);}}function Tt(e,t){switch(t.tagID){case u.HTML:Xe(e,t);break;case u.OPTION:e.openElements.currentTagId===u.OPTION&&e.openElements.pop(),e._insertElement(t,p.HTML);break;case u.OPTGROUP:e.openElements.currentTagId===u.OPTION&&e.openElements.pop(),e.openElements.currentTagId===u.OPTGROUP&&e.openElements.pop(),e._insertElement(t,p.HTML);break;case u.INPUT:case u.KEYGEN:case u.TEXTAREA:case u.SELECT:e.openElements.hasInSelectScope(u.SELECT)&&(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode(),t.tagID!==u.SELECT&&e._processStartTag(t));break;case u.SCRIPT:case u.TEMPLATE:He(e,t);}}function ht(e,t){switch(t.tagID){case u.OPTGROUP:e.openElements.stackTop>0&&e.openElements.currentTagId===u.OPTION&&e.openElements.tagIDs[e.openElements.stackTop-1]===u.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagId===u.OPTGROUP&&e.openElements.pop();break;case u.OPTION:e.openElements.currentTagId===u.OPTION&&e.openElements.pop();break;case u.SELECT:e.openElements.hasInSelectScope(u.SELECT)&&(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode());break;case u.TEMPLATE:Fe(e,t);}}function _t(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped(u.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode(),e.onEof(t)):ke(e,t);}function At(e,t){var s;if(t.tagID===u.HTML){if(e.fragmentContext||(e.insertionMode=de.AFTER_AFTER_BODY),e.options.sourceCodeLocationInfo&&e.openElements.tagIDs[0]===u.HTML){e._setEndLocation(e.openElements.items[0],t);const a=e.openElements.items[1];a&&!(null===(s=e.treeAdapter.getNodeSourceCodeLocation(a))||void 0===s?void 0:s.endTag)&&e._setEndLocation(a,t);}}else lt(e,t);}function lt(e,t){e.insertionMode=de.IN_BODY,we(e,t);}function mt(e,t){e.insertionMode=de.IN_BODY,we(e,t);}function pt(e){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==p.HTML&&!e._isIntegrationPoint(e.openElements.currentTagId,e.openElements.current);)e.openElements.pop();}return new Set([N.AREA,N.BASE,N.BASEFONT,N.BGSOUND,N.BR,N.COL,N.EMBED,N.FRAME,N.HR,N.IMG,N.INPUT,N.KEYGEN,N.LINK,N.META,N.PARAM,N.SOURCE,N.TRACK,N.WBR]),e.parse=function(e,t){return Ce.parse(e,t)},e.parseFragment=function(e,t,s){"string"==typeof e&&(s=t,t=e,e=null);const a=Ce.getFragmentParser(e,s);return a.tokenizer.write(t,!0),a.getFragment()},Object.defineProperty(e,"__esModule",{value:!0}),e}({});const parse=e.parse;const parseFragment=e.parseFragment;

const docParser = new WeakMap();
function parseDocumentUtil(ownerDocument, html) {
  const doc = parse(html.trim(), getParser(ownerDocument));
  doc.documentElement = doc.firstElementChild;
  doc.head = doc.documentElement.firstElementChild;
  doc.body = doc.head.nextElementSibling;
  return doc;
}
function parseFragmentUtil(ownerDocument, html) {
  if (typeof html === 'string') {
    html = html.trim();
  }
  else {
    html = '';
  }
  const frag = parseFragment(html, getParser(ownerDocument));
  return frag;
}
function getParser(ownerDocument) {
  let parseOptions = docParser.get(ownerDocument);
  if (parseOptions != null) {
    return parseOptions;
  }
  const treeAdapter = {
    createDocument() {
      const doc = ownerDocument.createElement("#document" /* NODE_NAMES.DOCUMENT_NODE */);
      doc['x-mode'] = 'no-quirks';
      return doc;
    },
    setNodeSourceCodeLocation(node, location) {
      node.sourceCodeLocation = location;
    },
    getNodeSourceCodeLocation(node) {
      return node.sourceCodeLocation;
    },
    createDocumentFragment() {
      return ownerDocument.createDocumentFragment();
    },
    createElement(tagName, namespaceURI, attrs) {
      const elm = ownerDocument.createElementNS(namespaceURI, tagName);
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.namespace == null || attr.namespace === 'http://www.w3.org/1999/xhtml') {
          elm.setAttribute(attr.name, attr.value);
        }
        else {
          elm.setAttributeNS(attr.namespace, attr.name, attr.value);
        }
      }
      return elm;
    },
    createCommentNode(data) {
      return ownerDocument.createComment(data);
    },
    appendChild(parentNode, newNode) {
      parentNode.appendChild(newNode);
    },
    insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
    },
    setTemplateContent(templateElement, contentElement) {
      templateElement.content = contentElement;
    },
    getTemplateContent(templateElement) {
      return templateElement.content;
    },
    setDocumentType(doc, name, publicId, systemId) {
      let doctypeNode = doc.childNodes.find((n) => n.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */);
      if (doctypeNode == null) {
        doctypeNode = ownerDocument.createDocumentTypeNode();
        doc.insertBefore(doctypeNode, doc.firstChild);
      }
      doctypeNode.nodeValue = '!DOCTYPE';
      doctypeNode['x-name'] = name;
      doctypeNode['x-publicId'] = publicId;
      doctypeNode['x-systemId'] = systemId;
    },
    setDocumentMode(doc, mode) {
      doc['x-mode'] = mode;
    },
    getDocumentMode(doc) {
      return doc['x-mode'];
    },
    detachNode(node) {
      node.remove();
    },
    insertText(parentNode, text) {
      const lastChild = parentNode.lastChild;
      if (lastChild != null && lastChild.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
        lastChild.nodeValue += text;
      }
      else {
        parentNode.appendChild(ownerDocument.createTextNode(text));
      }
    },
    insertTextBefore(parentNode, text, referenceNode) {
      const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
      if (prevNode != null && prevNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
        prevNode.nodeValue += text;
      }
      else {
        parentNode.insertBefore(ownerDocument.createTextNode(text), referenceNode);
      }
    },
    adoptAttributes(recipient, attrs) {
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (recipient.hasAttributeNS(attr.namespace, attr.name) === false) {
          recipient.setAttributeNS(attr.namespace, attr.name, attr.value);
        }
      }
    },
    getFirstChild(node) {
      return node.childNodes[0];
    },
    getChildNodes(node) {
      return node.childNodes;
    },
    getParentNode(node) {
      return node.parentNode;
    },
    getAttrList(element) {
      const attrs = element.attributes.__items.map((attr) => {
        return {
          name: attr.name,
          value: attr.value,
          namespace: attr.namespaceURI,
          prefix: null,
        };
      });
      return attrs;
    },
    getTagName(element) {
      if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        return element.nodeName.toLowerCase();
      }
      else {
        return element.nodeName;
      }
    },
    getNamespaceURI(element) {
      // mock-doc widens the type of an element's namespace uri to 'string | null'
      // we use a type assertion here to adhere to parse5's type definitions
      return element.namespaceURI;
    },
    getTextNodeContent(textNode) {
      return textNode.nodeValue;
    },
    getCommentNodeContent(commentNode) {
      return commentNode.nodeValue;
    },
    getDocumentTypeNodeName(doctypeNode) {
      return doctypeNode['x-name'];
    },
    getDocumentTypeNodePublicId(doctypeNode) {
      return doctypeNode['x-publicId'];
    },
    getDocumentTypeNodeSystemId(doctypeNode) {
      return doctypeNode['x-systemId'];
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['text']`. As a result, we cannot
    // complete this function signature
    isTextNode(node) {
      return node.nodeType === 3 /* NODE_TYPES.TEXT_NODE */;
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['comment']`. As a result, we cannot
    // complete this function signature (which requires its return type to be a type predicate)
    isCommentNode(node) {
      return node.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */;
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['document']`. As a result, we cannot
    // complete this function signature (which requires its return type to be a type predicate)
    isDocumentTypeNode(node) {
      return node.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */;
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['element']`. As a result, we cannot
    // complete this function signature (which requires its return type to be a type predicate)
    isElementNode(node) {
      return node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */;
    },
  };
  parseOptions = {
    treeAdapter: treeAdapter,
  };
  docParser.set(ownerDocument, parseOptions);
  return parseOptions;
}

// Sizzle 2.3.9
const Sizzle = (function() {
const window = {
  document: {
  createElement() {
    return {};
  },
  nodeType: 9,
  documentElement: {
    nodeType: 1,
    nodeName: 'HTML'
  }
  }
};
const module = { exports: {} };

/*! Sizzle v2.3.9 | (c) JS Foundation and other contributors | js.foundation */
!function(e){var t,n,r,i,o,u,l,a,s,c,f,d,p,h,g,m,y,v,w,b="sizzle"+1*new Date,N=e.document,C=0,x=0,S=ae(),E=ae(),A=ae(),D=ae(),T=function(e,t){return e===t&&(f=!0),0},L={}.hasOwnProperty,q=[],I=q.pop,B=q.push,R=q.push,k=q.slice,$=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return -1},H="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",P="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",z="\\["+M+"*("+P+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+P+"))|)"+M+"*\\]",F=":("+P+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+z+")*)|.*)\\)|)",O=new RegExp(M+"+","g"),j=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),G=new RegExp("^"+M+"*,"+M+"*"),U=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),V=new RegExp(M+"|>"),X=new RegExp(F),J=new RegExp("^"+P+"$"),K={ID:new RegExp("^#("+P+")"),CLASS:new RegExp("^\\.("+P+")"),TAG:new RegExp("^("+P+"|[*])"),ATTR:new RegExp("^"+z),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+H+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Q=/HTML$/i,W=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){d();},ue=ve(function(e){return !0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{R.apply(q=k.call(N.childNodes),N.childNodes),q[N.childNodes.length].nodeType;}catch(e){R={apply:q.length?function(e,t){B.apply(e,k.call(t));}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1;}};}function le(e,t,r,i){var o,l,s,c,f,h,y,v=t&&t.ownerDocument,N=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==N&&9!==N&&11!==N)return r;if(!i&&(d(t),t=t||p,g)){if(11!==N&&(f=_.exec(e)))if(o=f[1]){if(9===N){if(!(s=t.getElementById(o)))return r;if(s.id===o)return r.push(s),r}else if(v&&(s=v.getElementById(o))&&w(t,s)&&s.id===o)return r.push(s),r}else {if(f[2])return R.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return R.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!D[e+" "]&&(!m||!m.test(e))&&(1!==N||"object"!==t.nodeName.toLowerCase())){if(y=e,v=t,1===N&&(V.test(e)||U.test(e))){(v=ee.test(e)&&ge(t.parentNode)||t)===t&&n.scope||((c=t.getAttribute("id"))?c=c.replace(re,ie):t.setAttribute("id",c=b)),l=(h=u(e)).length;while(l--)h[l]=(c?"#"+c:":scope")+" "+ye(h[l]);y=h.join(",");}try{if(n.cssSupportsSelector&&!CSS.supports("selector(:is("+y+"))"))throw new Error;return R.apply(r,v.querySelectorAll(y)),r}catch(t){D(e,!0);}finally{c===b&&t.removeAttribute("id");}}}return a(e.replace(j,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ce(e){var t=p.createElement("fieldset");try{return !!e(t)}catch(e){return !1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null;}}function fe(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t;}function de(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return -1;return e?1:-1}function pe(e){return function(t){return "form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ue(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),u=o.length;while(u--)n[i=o[u]]&&(n[i]=!(r[i]=n[i]));})})}function ge(e){return e&&void 0!==e.getElementsByTagName&&e}n=le.support={},o=le.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return !Q.test(t||n&&n.nodeName||"HTML")},d=le.setDocument=function(e){var t,i,u=e?e.ownerDocument||e:N;return u!=p&&9===u.nodeType&&u.documentElement?(p=u,h=p.documentElement,g=!o(p),N!=p&&(i=p.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",oe,!1):i.attachEvent&&i.attachEvent("onunload",oe)),n.scope=ce(function(e){return h.appendChild(e).appendChild(p.createElement("div")),void 0!==e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),n.cssSupportsSelector=ce(function(){return CSS.supports("selector(*)")&&p.querySelectorAll(":is(:jqfake)")&&!CSS.supports("selector(:is(*,:jqfake))")}),n.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ce(function(e){return e.appendChild(p.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Z.test(p.getElementsByClassName),n.getById=ce(function(e){return h.appendChild(e).id=b,!p.getElementsByName||!p.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return [o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return [o]}return []}}),r.find.TAG=n.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&g)return t.getElementsByClassName(e)},y=[],m=[],(n.qsa=Z.test(p.querySelectorAll))&&(ce(function(e){var t;h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&m.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||m.push("\\["+M+"*(?:value|"+H+")"),e.querySelectorAll("[id~="+b+"-]").length||m.push("~="),(t=p.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||m.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||m.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||m.push(".#.+[+~]"),e.querySelectorAll("\\\f"),m.push("[\\r\\n\\f]");}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=p.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&m.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&m.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&m.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),m.push(",.*:");})),(n.matchesSelector=Z.test(v=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ce(function(e){n.disconnectedMatch=v.call(e,"*"),v.call(e,"[s!='']:x"),y.push("!=",F);}),n.cssSupportsSelector||m.push(":has"),m=m.length&&new RegExp(m.join("|")),y=y.length&&new RegExp(y.join("|")),t=Z.test(h.compareDocumentPosition),w=t||Z.test(h.contains)?function(e,t){var n=9===e.nodeType&&e.documentElement||e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return !0;return !1},T=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e==p||e.ownerDocument==N&&w(N,e)?-1:t==p||t.ownerDocument==N&&w(N,t)?1:c?$(c,e)-$(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,u=[e],l=[t];if(!i||!o)return e==p?-1:t==p?1:i?-1:o?1:c?$(c,e)-$(c,t):0;if(i===o)return de(e,t);n=e;while(n=n.parentNode)u.unshift(n);n=t;while(n=n.parentNode)l.unshift(n);while(u[r]===l[r])r++;return r?de(u[r],l[r]):u[r]==N?-1:l[r]==N?1:0},p):p},le.matches=function(e,t){return le(e,null,null,t)},le.matchesSelector=function(e,t){if(d(e),n.matchesSelector&&g&&!D[t+" "]&&(!y||!y.test(t))&&(!m||!m.test(t)))try{var r=v.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){D(t,!0);}return le(t,p,null,[e]).length>0},le.contains=function(e,t){return (e.ownerDocument||e)!=p&&d(e),w(e,t)},le.attr=function(e,t){(e.ownerDocument||e)!=p&&d(e);var i=r.attrHandle[t.toLowerCase()],o=i&&L.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},le.escape=function(e){return (e+"").replace(re,ie)},le.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},le.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(T),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1);}return c=null,e},i=le.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e);}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=le.selectors={cacheLength:50,createPseudo:se,match:K,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||le.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&le.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return K.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=u(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return "*"===e?function(){return !0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=S[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&S(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=le.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace(O," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),u="last"!==e.slice(-4),l="of-type"===t;return 1===r&&0===i?function(e){return !!e.parentNode}:function(t,n,a){var s,c,f,d,p,h,g=o!==u?"nextSibling":"previousSibling",m=t.parentNode,y=l&&t.nodeName.toLowerCase(),v=!a&&!l,w=!1;if(m){if(o){while(g){d=t;while(d=d[g])if(l?d.nodeName.toLowerCase()===y:1===d.nodeType)return !1;h=g="only"===e&&!h&&"nextSibling";}return !0}if(h=[u?m.firstChild:m.lastChild],u&&v){w=(p=(s=(c=(f=(d=m)[b]||(d[b]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]||[])[0]===C&&s[1])&&s[2],d=p&&m.childNodes[p];while(d=++p&&d&&d[g]||(w=p=0)||h.pop())if(1===d.nodeType&&++w&&d===t){c[e]=[C,p,w];break}}else if(v&&(w=p=(s=(c=(f=(d=t)[b]||(d[b]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]||[])[0]===C&&s[1]),!1===w)while(d=++p&&d&&d[g]||(w=p=0)||h.pop())if((l?d.nodeName.toLowerCase()===y:1===d.nodeType)&&++w&&(v&&((c=(f=d[b]||(d[b]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]=[C,w]),d===t))break;return (w-=i)===r||w%r==0&&w/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||le.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),u=o.length;while(u--)e[r=$(e,o[u])]=!(n[r]=o[u]);}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=l(e.replace(j,"$1"));return r[b]?se(function(e,t,n,i){var o,u=r(e,null,i,[]),l=e.length;while(l--)(o=u[l])&&(e[l]=!(t[l]=o));}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return le(e,t).length>0}}),contains:se(function(e){return e=e.replace(te,ne),function(t){return (t.textContent||i(t)).indexOf(e)>-1}}),lang:se(function(e){return J.test(e||"")||le.error("unsupported lang: "+e),e=e.replace(te,ne).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return (n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return !1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:pe(!1),disabled:pe(!0),checked:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return !1;return !0},parent:function(e){return !r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return W.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return "input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return [0]}),last:he(function(e,t){return [t-1]}),eq:he(function(e,t,n){return [n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in {radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=function(e){return function(t){return "input"===t.nodeName.toLowerCase()&&t.type===e}}(t);for(t in {submit:!0,reset:!0})r.pseudos[t]=function(e){return function(t){var n=t.nodeName.toLowerCase();return ("input"===n||"button"===n)&&t.type===e}}(t);function me(){}me.prototype=r.filters=r.pseudos,r.setFilters=new me,u=le.tokenize=function(e,t){var n,i,o,u,l,a,s,c=E[e+" "];if(c)return t?0:c.slice(0);l=e,a=[],s=r.preFilter;while(l){n&&!(i=G.exec(l))||(i&&(l=l.slice(i[0].length)||l),a.push(o=[])),n=!1,(i=U.exec(l))&&(n=i.shift(),o.push({value:n,type:i[0].replace(j," ")}),l=l.slice(n.length));for(u in r.filter)!(i=K[u].exec(l))||s[u]&&!(i=s[u](i))||(n=i.shift(),o.push({value:n,type:u,matches:i}),l=l.slice(n.length));if(!n)break}return t?l.length:l?le.error(e):E(e,a).slice(0)};function ye(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function ve(e,t,n){var r=t.dir,i=t.next,o=i||r,u=n&&"parentNode"===o,l=x++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||u)return e(t,n,i);return !1}:function(t,n,a){var s,c,f,d=[C,l];if(a){while(t=t[r])if((1===t.nodeType||u)&&e(t,n,a))return !0}else while(t=t[r])if(1===t.nodeType||u)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else {if((s=c[o])&&s[0]===C&&s[1]===l)return d[2]=s[2];if(c[o]=d,d[2]=e(t,n,a))return !0}return !1}}function we(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return !1;return !0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)le(e,t[r],n);return n}function Ne(e,t,n,r,i){for(var o,u=[],l=0,a=e.length,s=null!=t;l<a;l++)(o=e[l])&&(n&&!n(o,r,i)||(u.push(o),s&&t.push(l)));return u}function Ce(e,t,n,r,i,o){return r&&!r[b]&&(r=Ce(r)),i&&!i[b]&&(i=Ce(i,o)),se(function(o,u,l,a){var s,c,f,d=[],p=[],h=u.length,g=o||be(t||"*",l.nodeType?[l]:l,[]),m=!e||!o&&t?g:Ne(g,d,e,l,a),y=n?i||(o?e:h||r)?[]:u:m;if(n&&n(m,y,l,a),r){s=Ne(y,p),r(s,[],l,a),c=s.length;while(c--)(f=s[c])&&(y[p[c]]=!(m[p[c]]=f));}if(o){if(i||e){if(i){s=[],c=y.length;while(c--)(f=y[c])&&s.push(m[c]=f);i(null,y=[],s,a);}c=y.length;while(c--)(f=y[c])&&(s=i?$(o,f):d[c])>-1&&(o[s]=!(u[s]=f));}}else y=Ne(y===u?y.splice(h,y.length):y),i?i(null,u,y,a):R.apply(u,y);})}function xe(e){for(var t,n,i,o=e.length,u=r.relative[e[0].type],l=u||r.relative[" "],a=u?1:0,c=ve(function(e){return e===t},l,!0),f=ve(function(e){return $(t,e)>-1},l,!0),d=[function(e,n,r){var i=!u&&(r||n!==s)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];a<o;a++)if(n=r.relative[e[a].type])d=[ve(we(d),n)];else {if((n=r.filter[e[a].type].apply(null,e[a].matches))[b]){for(i=++a;i<o;i++)if(r.relative[e[i].type])break;return Ce(a>1&&we(d),a>1&&ye(e.slice(0,a-1).concat({value:" "===e[a-2].type?"*":""})).replace(j,"$1"),n,a<i&&xe(e.slice(a,i)),i<o&&xe(e=e.slice(i)),i<o&&ye(e))}d.push(n);}return we(d)}function Se(e,t){var n=t.length>0,i=e.length>0,o=function(o,u,l,a,c){var f,h,m,y=0,v="0",w=o&&[],b=[],N=s,x=o||i&&r.find.TAG("*",c),S=C+=null==N?1:Math.random()||.1,E=x.length;for(c&&(s=u==p||u||c);v!==E&&null!=(f=x[v]);v++){if(i&&f){h=0,u||f.ownerDocument==p||(d(f),l=!g);while(m=e[h++])if(m(f,u||p,l)){a.push(f);break}c&&(C=S);}n&&((f=!m&&f)&&y--,o&&w.push(f));}if(y+=v,n&&v!==y){h=0;while(m=t[h++])m(w,b,u,l);if(o){if(y>0)while(v--)w[v]||b[v]||(b[v]=I.call(a));b=Ne(b);}R.apply(a,b),c&&!o&&b.length>0&&y+t.length>1&&le.uniqueSort(a);}return c&&(C=S,s=N),w};return n?se(o):o}l=le.compile=function(e,t){var n,r=[],i=[],o=A[e+" "];if(!o){t||(t=u(e)),n=t.length;while(n--)(o=xe(t[n]))[b]?r.push(o):i.push(o);(o=A(e,Se(i,r))).selector=e;}return o},a=le.select=function(e,t,n,i){var o,a,s,c,f,d="function"==typeof e&&e,p=!i&&u(e=d.selector||e);if(n=n||[],1===p.length){if((a=p[0]=p[0].slice(0)).length>2&&"ID"===(s=a[0]).type&&9===t.nodeType&&g&&r.relative[a[1].type]){if(!(t=(r.find.ID(s.matches[0].replace(te,ne),t)||[])[0]))return n;d&&(t=t.parentNode),e=e.slice(a.shift().value.length);}o=K.needsContext.test(e)?0:a.length;while(o--){if(s=a[o],r.relative[c=s.type])break;if((f=r.find[c])&&(i=f(s.matches[0].replace(te,ne),ee.test(a[0].type)&&ge(t.parentNode)||t))){if(a.splice(o,1),!(e=i.length&&ye(a)))return R.apply(n,i),n;break}}}return (d||l(e,p))(i,t,!g,n,!t||ee.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(T).join("")===b,n.detectDuplicates=!!f,d(),n.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(p.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(H,function(e,t,n){var r;if(!n)return !0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null});var Ee=e.Sizzle;le.noConflict=function(){return e.Sizzle===le&&(e.Sizzle=Ee),le},"function"==typeof define&&define.amd?define(function(){return le}):"undefined"!=typeof module&&module.exports?module.exports=le:e.Sizzle=le;}(window);
//# sourceMappingURL=sizzle.min.map

return module.exports;
})();

function matches(selector, elm) {
  const r = Sizzle.matches(selector, [elm]);
  return r.length > 0;
}
function selectOne(selector, elm) {
  const r = Sizzle(selector, elm);
  return r[0] || null;
}
function selectAll(selector, elm) {
  return Sizzle(selector, elm);
}

function serializeNodeToHtml(elm, opts = {}) {
  const output = {
    currentLineWidth: 0,
    indent: 0,
    isWithinBody: false,
    text: [],
  };
  if (opts.prettyHtml) {
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 2;
    }
    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = true;
    }
    opts.approximateLineWidth = -1;
  }
  else {
    opts.prettyHtml = false;
    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = false;
    }
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 0;
    }
  }
  if (typeof opts.approximateLineWidth !== 'number') {
    opts.approximateLineWidth = -1;
  }
  if (typeof opts.removeEmptyAttributes !== 'boolean') {
    opts.removeEmptyAttributes = true;
  }
  if (typeof opts.removeAttributeQuotes !== 'boolean') {
    opts.removeAttributeQuotes = false;
  }
  if (typeof opts.removeBooleanAttributeQuotes !== 'boolean') {
    opts.removeBooleanAttributeQuotes = false;
  }
  if (typeof opts.removeHtmlComments !== 'boolean') {
    opts.removeHtmlComments = false;
  }
  if (typeof opts.serializeShadowRoot !== 'boolean') {
    opts.serializeShadowRoot = false;
  }
  if (opts.outerHtml) {
    serializeToHtml(elm, opts, output, false);
  }
  else {
    for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
      serializeToHtml(elm.childNodes[i], opts, output, false);
    }
  }
  if (output.text[0] === '\n') {
    output.text.shift();
  }
  if (output.text[output.text.length - 1] === '\n') {
    output.text.pop();
  }
  return output.text.join('');
}
function serializeToHtml(node, opts, output, isShadowRoot) {
  if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ || isShadowRoot) {
    const tagName = isShadowRoot ? 'mock:shadow-root' : getTagName(node);
    if (tagName === 'body') {
      output.isWithinBody = true;
    }
    const ignoreTag = opts.excludeTags != null && opts.excludeTags.includes(tagName);
    if (ignoreTag === false) {
      const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
      if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
        output.text.push('\n');
        output.currentLineWidth = 0;
      }
      if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
        for (let i = 0; i < output.indent; i++) {
          output.text.push(' ');
        }
        output.currentLineWidth += output.indent;
      }
      output.text.push('<' + tagName);
      output.currentLineWidth += tagName.length + 1;
      const attrsLength = node.attributes.length;
      const attributes = opts.prettyHtml && attrsLength > 1
        ? cloneAttributes(node.attributes, true)
        : node.attributes;
      for (let i = 0; i < attrsLength; i++) {
        const attr = attributes.item(i);
        const attrName = attr.name;
        if (attrName === 'style') {
          continue;
        }
        let attrValue = attr.value;
        if (opts.removeEmptyAttributes && attrValue === '' && REMOVE_EMPTY_ATTR.has(attrName)) {
          continue;
        }
        const attrNamespaceURI = attr.namespaceURI;
        if (attrNamespaceURI == null) {
          output.currentLineWidth += attrName.length + 1;
          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            output.text.push('\n' + attrName);
            output.currentLineWidth = 0;
          }
          else {
            output.text.push(' ' + attrName);
          }
        }
        else if (attrNamespaceURI === 'http://www.w3.org/XML/1998/namespace') {
          output.text.push(' xml:' + attrName);
          output.currentLineWidth += attrName.length + 5;
        }
        else if (attrNamespaceURI === 'http://www.w3.org/2000/xmlns/') {
          if (attrName !== 'xmlns') {
            output.text.push(' xmlns:' + attrName);
            output.currentLineWidth += attrName.length + 7;
          }
          else {
            output.text.push(' ' + attrName);
            output.currentLineWidth += attrName.length + 1;
          }
        }
        else if (attrNamespaceURI === XLINK_NS) {
          output.text.push(' xlink:' + attrName);
          output.currentLineWidth += attrName.length + 7;
        }
        else {
          output.text.push(' ' + attrNamespaceURI + ':' + attrName);
          output.currentLineWidth += attrNamespaceURI.length + attrName.length + 2;
        }
        if (opts.prettyHtml && attrName === 'class') {
          attrValue = attr.value = attrValue
            .split(' ')
            .filter((t) => t !== '')
            .sort()
            .join(' ')
            .trim();
        }
        if (attrValue === '') {
          if (opts.removeBooleanAttributeQuotes && BOOLEAN_ATTR.has(attrName)) {
            continue;
          }
          if (opts.removeEmptyAttributes && attrName.startsWith('data-')) {
            continue;
          }
        }
        if (opts.removeAttributeQuotes && CAN_REMOVE_ATTR_QUOTES.test(attrValue)) {
          output.text.push('=' + escapeString(attrValue, true));
          output.currentLineWidth += attrValue.length + 1;
        }
        else {
          output.text.push('="' + escapeString(attrValue, true) + '"');
          output.currentLineWidth += attrValue.length + 3;
        }
      }
      if (node.hasAttribute('style')) {
        const cssText = node.style.cssText;
        if (opts.approximateLineWidth > 0 &&
          output.currentLineWidth + cssText.length + 10 > opts.approximateLineWidth) {
          output.text.push(`\nstyle="${cssText}">`);
          output.currentLineWidth = 0;
        }
        else {
          output.text.push(` style="${cssText}">`);
          output.currentLineWidth += cssText.length + 10;
        }
      }
      else {
        output.text.push('>');
        output.currentLineWidth += 1;
      }
    }
    if (EMPTY_ELEMENTS.has(tagName) === false) {
      if (opts.serializeShadowRoot && node.shadowRoot != null) {
        output.indent = output.indent + opts.indentSpaces;
        serializeToHtml(node.shadowRoot, opts, output, true);
        output.indent = output.indent - opts.indentSpaces;
        if (opts.newLines &&
          (node.childNodes.length === 0 ||
            (node.childNodes.length === 1 &&
              node.childNodes[0].nodeType === 3 /* NODE_TYPES.TEXT_NODE */ &&
              node.childNodes[0].nodeValue.trim() === ''))) {
          output.text.push('\n');
          output.currentLineWidth = 0;
          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }
      }
      if (opts.excludeTagContent == null || opts.excludeTagContent.includes(tagName) === false) {
        const childNodes = tagName === 'template' ? node.content.childNodes : node.childNodes;
        const childNodeLength = childNodes.length;
        if (childNodeLength > 0) {
          if (childNodeLength === 1 &&
            childNodes[0].nodeType === 3 /* NODE_TYPES.TEXT_NODE */ &&
            (typeof childNodes[0].nodeValue !== 'string' || childNodes[0].nodeValue.trim() === '')) ;
          else {
            const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
            if (!isWithinWhitespaceSensitiveNode && opts.indentSpaces > 0 && ignoreTag === false) {
              output.indent = output.indent + opts.indentSpaces;
            }
            for (let i = 0; i < childNodeLength; i++) {
              serializeToHtml(childNodes[i], opts, output, false);
            }
            if (ignoreTag === false) {
              if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
                output.text.push('\n');
                output.currentLineWidth = 0;
              }
              if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
                output.indent = output.indent - opts.indentSpaces;
                for (let i = 0; i < output.indent; i++) {
                  output.text.push(' ');
                }
                output.currentLineWidth += output.indent;
              }
            }
          }
        }
        if (ignoreTag === false) {
          output.text.push('</' + tagName + '>');
          output.currentLineWidth += tagName.length + 3;
        }
      }
    }
    if (opts.approximateLineWidth > 0 && STRUCTURE_ELEMENTS.has(tagName)) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }
    if (tagName === 'body') {
      output.isWithinBody = false;
    }
  }
  else if (node.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
    let textContent = node.nodeValue;
    if (typeof textContent === 'string') {
      const trimmedTextContent = textContent.trim();
      if (trimmedTextContent === '') {
        // this text node is whitespace only
        if (isWithinWhitespaceSensitive(node)) {
          // whitespace matters within this element
          // just add the exact text we were given
          output.text.push(textContent);
          output.currentLineWidth += textContent.length;
        }
        else if (opts.approximateLineWidth > 0 && !output.isWithinBody) ;
        else if (!opts.prettyHtml) {
          // this text node is only whitespace, and it's not
          // within a whitespace sensitive element like <pre> or <code>
          // so replace the entire white space with a single new line
          output.currentLineWidth += 1;
          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            // good enough for a new line
            // for perf these are all just estimates
            // we don't care to ensure exact line lengths
            output.text.push('\n');
            output.currentLineWidth = 0;
          }
          else {
            // let's keep it all on the same line yet
            output.text.push(' ');
          }
        }
      }
      else {
        // this text node has text content
        const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 || opts.prettyHtml ? isWithinWhitespaceSensitive(node) : false;
        if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
          output.text.push('\n');
          output.currentLineWidth = 0;
        }
        if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }
        let textContentLength = textContent.length;
        if (textContentLength > 0) {
          // this text node has text content
          const parentTagName = node.parentNode != null && node.parentNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */
            ? node.parentNode.nodeName
            : null;
          if (NON_ESCAPABLE_CONTENT.has(parentTagName)) {
            // this text node cannot have its content escaped since it's going
            // into an element like <style> or <script>
            if (isWithinWhitespaceSensitive(node)) {
              output.text.push(textContent);
            }
            else {
              output.text.push(trimmedTextContent);
              textContentLength = trimmedTextContent.length;
            }
            output.currentLineWidth += textContentLength;
          }
          else {
            // this text node is going into a normal element and html can be escaped
            if (opts.prettyHtml && !isWithinWhitespaceSensitiveNode) {
              // pretty print the text node
              output.text.push(escapeString(textContent.replace(/\s\s+/g, ' ').trim(), false));
              output.currentLineWidth += textContentLength;
            }
            else {
              // not pretty printing the text node
              if (isWithinWhitespaceSensitive(node)) {
                output.currentLineWidth += textContentLength;
              }
              else {
                // this element is not a whitespace sensitive one, like <pre> or <code> so
                // any whitespace at the start and end can be cleaned up to just be one space
                if (/\s/.test(textContent.charAt(0))) {
                  textContent = ' ' + textContent.trimLeft();
                }
                textContentLength = textContent.length;
                if (textContentLength > 1) {
                  if (/\s/.test(textContent.charAt(textContentLength - 1))) {
                    if (opts.approximateLineWidth > 0 &&
                      output.currentLineWidth + textContentLength > opts.approximateLineWidth) {
                      textContent = textContent.trimRight() + '\n';
                      output.currentLineWidth = 0;
                    }
                    else {
                      textContent = textContent.trimRight() + ' ';
                    }
                  }
                }
                output.currentLineWidth += textContentLength;
              }
              output.text.push(escapeString(textContent, false));
            }
          }
        }
      }
    }
  }
  else if (node.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */) {
    const nodeValue = node.nodeValue;
    if (opts.removeHtmlComments) {
      const isHydrateAnnotation = nodeValue.startsWith(CONTENT_REF_ID + '.') ||
        nodeValue.startsWith(ORG_LOCATION_ID + '.') ||
        nodeValue.startsWith(SLOT_NODE_ID + '.') ||
        nodeValue.startsWith(TEXT_NODE_ID + '.');
      if (!isHydrateAnnotation) {
        return;
      }
    }
    const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
    if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }
    if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
      for (let i = 0; i < output.indent; i++) {
        output.text.push(' ');
      }
      output.currentLineWidth += output.indent;
    }
    output.text.push('<!--' + nodeValue + '-->');
    output.currentLineWidth += nodeValue.length + 7;
  }
  else if (node.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */) {
    output.text.push('<!doctype html>');
  }
}
const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const CAN_REMOVE_ATTR_QUOTES = /^[^ \t\n\f\r"'`=<>\/\\-]+$/;
function getTagName(element) {
  if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return element.nodeName.toLowerCase();
  }
  else {
    return element.nodeName;
  }
}
function escapeString(str, attrMode) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');
  if (attrMode) {
    return str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  }
  return str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
}
function isWithinWhitespaceSensitive(node) {
  while (node != null) {
    if (WHITESPACE_SENSITIVE.has(node.nodeName)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
/*@__PURE__*/ const NON_ESCAPABLE_CONTENT = new Set([
  'STYLE',
  'SCRIPT',
  'IFRAME',
  'NOSCRIPT',
  'XMP',
  'NOEMBED',
  'NOFRAMES',
  'PLAINTEXT',
]);
/*@__PURE__*/ const WHITESPACE_SENSITIVE = new Set([
  'CODE',
  'OUTPUT',
  'PLAINTEXT',
  'PRE',
  'SCRIPT',
  'TEMPLATE',
  'TEXTAREA',
]);
/*@__PURE__*/ const EMPTY_ELEMENTS = new Set([
  'area',
  'base',
  'basefont',
  'bgsound',
  'br',
  'col',
  'embed',
  'frame',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'trace',
  'wbr',
]);
/*@__PURE__*/ const REMOVE_EMPTY_ATTR = new Set(['class', 'dir', 'id', 'lang', 'name', 'title']);
/*@__PURE__*/ const BOOLEAN_ATTR = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'compact',
  'controls',
  'declare',
  'default',
  'defaultchecked',
  'defaultmuted',
  'defaultselected',
  'defer',
  'disabled',
  'enabled',
  'formnovalidate',
  'hidden',
  'indeterminate',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nohref',
  'nomodule',
  'noresize',
  'noshade',
  'novalidate',
  'nowrap',
  'open',
  'pauseonexit',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'seamless',
  'selected',
  'sortable',
  'truespeed',
  'typemustmatch',
  'visible',
]);
/*@__PURE__*/ const STRUCTURE_ELEMENTS = new Set([
  'html',
  'body',
  'head',
  'iframe',
  'meta',
  'link',
  'base',
  'title',
  'script',
  'style',
]);

class MockNode {
  constructor(ownerDocument, nodeType, nodeName, nodeValue) {
    this.ownerDocument = ownerDocument;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this._nodeValue = nodeValue;
    this.parentNode = null;
    this.childNodes = [];
  }
  appendChild(newNode) {
    if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
      const nodes = newNode.childNodes.slice();
      for (const child of nodes) {
        this.appendChild(child);
      }
    }
    else {
      newNode.remove();
      newNode.parentNode = this;
      this.childNodes.push(newNode);
      connectNode(this.ownerDocument, newNode);
    }
    return newNode;
  }
  append(...items) {
    items.forEach((item) => {
      const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
      this.appendChild(isNode ? item : this.ownerDocument.createTextNode(String(item)));
    });
  }
  prepend(...items) {
    const firstChild = this.firstChild;
    items.forEach((item) => {
      const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
      if (firstChild) {
        this.insertBefore(isNode ? item : this.ownerDocument.createTextNode(String(item)), firstChild);
      }
    });
  }
  cloneNode(deep) {
    throw new Error(`invalid node type to clone: ${this.nodeType}, deep: ${deep}`);
  }
  compareDocumentPosition(_other) {
    // unimplemented
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
    return -1;
  }
  get firstChild() {
    return this.childNodes[0] || null;
  }
  insertBefore(newNode, referenceNode) {
    if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
      for (let i = 0, ii = newNode.childNodes.length; i < ii; i++) {
        insertBefore(this, newNode.childNodes[i], referenceNode);
      }
    }
    else {
      insertBefore(this, newNode, referenceNode);
    }
    return newNode;
  }
  get isConnected() {
    let node = this;
    while (node != null) {
      if (node.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */) {
        return true;
      }
      node = node.parentNode;
      if (node != null && node.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
        node = node.host;
      }
    }
    return false;
  }
  isSameNode(node) {
    return this === node;
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }
  get nextSibling() {
    if (this.parentNode != null) {
      const index = this.parentNode.childNodes.indexOf(this) + 1;
      return this.parentNode.childNodes[index] || null;
    }
    return null;
  }
  get nodeValue() {
    var _a;
    return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
  }
  set nodeValue(value) {
    this._nodeValue = value;
  }
  get parentElement() {
    return this.parentNode || null;
  }
  set parentElement(value) {
    this.parentNode = value;
  }
  get previousSibling() {
    if (this.parentNode != null) {
      const index = this.parentNode.childNodes.indexOf(this) - 1;
      return this.parentNode.childNodes[index] || null;
    }
    return null;
  }
  contains(otherNode) {
    if (otherNode === this) {
      return true;
    }
    const childNodes = Array.from(this.childNodes);
    if (childNodes.includes(otherNode)) {
      return true;
    }
    return childNodes.some((node) => this.contains.bind(node)(otherNode));
  }
  removeChild(childNode) {
    const index = this.childNodes.indexOf(childNode);
    if (index > -1) {
      this.childNodes.splice(index, 1);
      if (this.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        const wasConnected = this.isConnected;
        childNode.parentNode = null;
        if (wasConnected === true) {
          disconnectNode(childNode);
        }
      }
      else {
        childNode.parentNode = null;
      }
    }
    else {
      throw new Error(`node not found within childNodes during removeChild`);
    }
    return childNode;
  }
  remove() {
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }
  replaceChild(newChild, oldChild) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild);
      oldChild.remove();
      return newChild;
    }
    return null;
  }
  get textContent() {
    var _a;
    return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
  }
  set textContent(value) {
    this._nodeValue = String(value);
  }
}
MockNode.ELEMENT_NODE = 1;
MockNode.TEXT_NODE = 3;
MockNode.PROCESSING_INSTRUCTION_NODE = 7;
MockNode.COMMENT_NODE = 8;
MockNode.DOCUMENT_NODE = 9;
MockNode.DOCUMENT_TYPE_NODE = 10;
MockNode.DOCUMENT_FRAGMENT_NODE = 11;
class MockNodeList {
  constructor(ownerDocument, childNodes, length) {
    this.ownerDocument = ownerDocument;
    this.childNodes = childNodes;
    this.length = length;
  }
}
class MockElement extends MockNode {
  constructor(ownerDocument, nodeName) {
    super(ownerDocument, 1 /* NODE_TYPES.ELEMENT_NODE */, typeof nodeName === 'string' ? nodeName : null, null);
    this.namespaceURI = null;
    this.__shadowRoot = null;
    this.__attributeMap = null;
  }
  addEventListener(type, handler) {
    addEventListener(this, type, handler);
  }
  attachShadow(_opts) {
    const shadowRoot = this.ownerDocument.createDocumentFragment();
    this.shadowRoot = shadowRoot;
    return shadowRoot;
  }
  blur() {
    dispatchEvent(this, new MockFocusEvent('blur', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
  }
  get shadowRoot() {
    return this.__shadowRoot || null;
  }
  set shadowRoot(shadowRoot) {
    if (shadowRoot != null) {
      shadowRoot.host = this;
      this.__shadowRoot = shadowRoot;
    }
    else {
      delete this.__shadowRoot;
    }
  }
  get attributes() {
    if (this.__attributeMap == null) {
      const attrMap = createAttributeProxy(false);
      this.__attributeMap = attrMap;
      return attrMap;
    }
    return this.__attributeMap;
  }
  set attributes(attrs) {
    this.__attributeMap = attrs;
  }
  get children() {
    return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */);
  }
  get childElementCount() {
    return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */).length;
  }
  get className() {
    return this.getAttributeNS(null, 'class') || '';
  }
  set className(value) {
    this.setAttributeNS(null, 'class', value);
  }
  get classList() {
    return new MockClassList(this);
  }
  click() {
    dispatchEvent(this, new MockEvent('click', { bubbles: true, cancelable: true, composed: true }));
  }
  cloneNode(_deep) {
    // implemented on MockElement.prototype from within element.ts
    // @ts-ignore - implemented on MockElement.prototype from within element.ts
    return null;
  }
  closest(selector) {
    let elm = this;
    while (elm != null) {
      if (elm.matches(selector)) {
        return elm;
      }
      elm = elm.parentNode;
    }
    return null;
  }
  get dataset() {
    return dataset(this);
  }
  get dir() {
    return this.getAttributeNS(null, 'dir') || '';
  }
  set dir(value) {
    this.setAttributeNS(null, 'dir', value);
  }
  dispatchEvent(ev) {
    return dispatchEvent(this, ev);
  }
  get firstElementChild() {
    return this.children[0] || null;
  }
  focus(_options) {
    dispatchEvent(this, new MockFocusEvent('focus', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
  }
  getAttribute(attrName) {
    if (attrName === 'style') {
      if (this.__style != null && this.__style.length > 0) {
        return this.style.cssText;
      }
      return null;
    }
    const attr = this.attributes.getNamedItem(attrName);
    if (attr != null) {
      return attr.value;
    }
    return null;
  }
  getAttributeNS(namespaceURI, attrName) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
    if (attr != null) {
      return attr.value;
    }
    return null;
  }
  getBoundingClientRect() {
    return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 };
  }
  getRootNode(opts) {
    const isComposed = opts != null && opts.composed === true;
    let node = this;
    while (node.parentNode != null) {
      node = node.parentNode;
      if (isComposed === true && node.parentNode == null && node.host != null) {
        node = node.host;
      }
    }
    return node;
  }
  get draggable() {
    return this.getAttributeNS(null, 'draggable') === 'true';
  }
  set draggable(value) {
    this.setAttributeNS(null, 'draggable', value);
  }
  hasChildNodes() {
    return this.childNodes.length > 0;
  }
  get id() {
    return this.getAttributeNS(null, 'id') || '';
  }
  set id(value) {
    this.setAttributeNS(null, 'id', value);
  }
  get innerHTML() {
    if (this.childNodes.length === 0) {
      return '';
    }
    return serializeNodeToHtml(this, {
      newLines: false,
      indentSpaces: 0,
    });
  }
  set innerHTML(html) {
    var _a;
    if (NON_ESCAPABLE_CONTENT.has((_a = this.nodeName) !== null && _a !== void 0 ? _a : '') === true) {
      setTextContent(this, html);
    }
    else {
      for (let i = this.childNodes.length - 1; i >= 0; i--) {
        this.removeChild(this.childNodes[i]);
      }
      if (typeof html === 'string') {
        const frag = parseFragmentUtil(this.ownerDocument, html);
        while (frag.childNodes.length > 0) {
          this.appendChild(frag.childNodes[0]);
        }
      }
    }
  }
  get innerText() {
    const text = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }
  set innerText(value) {
    setTextContent(this, value);
  }
  insertAdjacentElement(position, elm) {
    if (position === 'beforebegin') {
      insertBefore(this.parentNode, elm, this);
    }
    else if (position === 'afterbegin') {
      this.prepend(elm);
    }
    else if (position === 'beforeend') {
      this.appendChild(elm);
    }
    else if (position === 'afterend') {
      insertBefore(this.parentNode, elm, this.nextSibling);
    }
    return elm;
  }
  insertAdjacentHTML(position, html) {
    const frag = parseFragmentUtil(this.ownerDocument, html);
    if (position === 'beforebegin') {
      while (frag.childNodes.length > 0) {
        insertBefore(this.parentNode, frag.childNodes[0], this);
      }
    }
    else if (position === 'afterbegin') {
      while (frag.childNodes.length > 0) {
        this.prepend(frag.childNodes[frag.childNodes.length - 1]);
      }
    }
    else if (position === 'beforeend') {
      while (frag.childNodes.length > 0) {
        this.appendChild(frag.childNodes[0]);
      }
    }
    else if (position === 'afterend') {
      while (frag.childNodes.length > 0) {
        insertBefore(this.parentNode, frag.childNodes[frag.childNodes.length - 1], this.nextSibling);
      }
    }
  }
  insertAdjacentText(position, text) {
    const elm = this.ownerDocument.createTextNode(text);
    if (position === 'beforebegin') {
      insertBefore(this.parentNode, elm, this);
    }
    else if (position === 'afterbegin') {
      this.prepend(elm);
    }
    else if (position === 'beforeend') {
      this.appendChild(elm);
    }
    else if (position === 'afterend') {
      insertBefore(this.parentNode, elm, this.nextSibling);
    }
  }
  hasAttribute(attrName) {
    if (attrName === 'style') {
      return this.__style != null && this.__style.length > 0;
    }
    return this.getAttribute(attrName) !== null;
  }
  hasAttributeNS(namespaceURI, name) {
    return this.getAttributeNS(namespaceURI, name) !== null;
  }
  get hidden() {
    return this.hasAttributeNS(null, 'hidden');
  }
  set hidden(isHidden) {
    if (isHidden === true) {
      this.setAttributeNS(null, 'hidden', '');
    }
    else {
      this.removeAttributeNS(null, 'hidden');
    }
  }
  get lang() {
    return this.getAttributeNS(null, 'lang') || '';
  }
  set lang(value) {
    this.setAttributeNS(null, 'lang', value);
  }
  get lastElementChild() {
    const children = this.children;
    return children[children.length - 1] || null;
  }
  matches(selector) {
    return matches(selector, this);
  }
  get nextElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null &&
      (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
        parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
        parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
      const children = parentElement.children;
      const index = children.indexOf(this) + 1;
      return parentElement.children[index] || null;
    }
    return null;
  }
  get outerHTML() {
    return serializeNodeToHtml(this, {
      newLines: false,
      outerHtml: true,
      indentSpaces: 0,
    });
  }
  get previousElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null &&
      (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
        parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
        parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
      const children = parentElement.children;
      const index = children.indexOf(this) - 1;
      return parentElement.children[index] || null;
    }
    return null;
  }
  getElementsByClassName(classNames) {
    const classes = classNames
      .trim()
      .split(' ')
      .filter((c) => c.length > 0);
    const results = [];
    getElementsByClassName(this, classes, results);
    return results;
  }
  getElementsByTagName(tagName) {
    const results = [];
    getElementsByTagName(this, tagName.toLowerCase(), results);
    return results;
  }
  querySelector(selector) {
    return selectOne(selector, this);
  }
  querySelectorAll(selector) {
    return selectAll(selector, this);
  }
  removeAttribute(attrName) {
    if (attrName === 'style') {
      delete this.__style;
    }
    else {
      const attr = this.attributes.getNamedItem(attrName);
      if (attr != null) {
        this.attributes.removeNamedItemNS(attr);
        if (checkAttributeChanged(this) === true) {
          attributeChanged(this, attrName, attr.value, null);
        }
      }
    }
  }
  removeAttributeNS(namespaceURI, attrName) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
    if (attr != null) {
      this.attributes.removeNamedItemNS(attr);
      if (checkAttributeChanged(this) === true) {
        attributeChanged(this, attrName, attr.value, null);
      }
    }
  }
  removeEventListener(type, handler) {
    removeEventListener(this, type, handler);
  }
  setAttribute(attrName, value) {
    if (attrName === 'style') {
      this.style = value;
    }
    else {
      const attributes = this.attributes;
      let attr = attributes.getNamedItem(attrName);
      const checkAttrChanged = checkAttributeChanged(this);
      if (attr != null) {
        if (checkAttrChanged === true) {
          const oldValue = attr.value;
          attr.value = value;
          if (oldValue !== attr.value) {
            attributeChanged(this, attr.name, oldValue, attr.value);
          }
        }
        else {
          attr.value = value;
        }
      }
      else {
        if (attributes.caseInsensitive) {
          attrName = attrName.toLowerCase();
        }
        attr = new MockAttr(attrName, value);
        attributes.__items.push(attr);
        if (checkAttrChanged === true) {
          attributeChanged(this, attrName, null, attr.value);
        }
      }
    }
  }
  setAttributeNS(namespaceURI, attrName, value) {
    const attributes = this.attributes;
    let attr = attributes.getNamedItemNS(namespaceURI, attrName);
    const checkAttrChanged = checkAttributeChanged(this);
    if (attr != null) {
      if (checkAttrChanged === true) {
        const oldValue = attr.value;
        attr.value = value;
        if (oldValue !== attr.value) {
          attributeChanged(this, attr.name, oldValue, attr.value);
        }
      }
      else {
        attr.value = value;
      }
    }
    else {
      attr = new MockAttr(attrName, value, namespaceURI);
      attributes.__items.push(attr);
      if (checkAttrChanged === true) {
        attributeChanged(this, attrName, null, attr.value);
      }
    }
  }
  get style() {
    if (this.__style == null) {
      this.__style = createCSSStyleDeclaration();
    }
    return this.__style;
  }
  set style(val) {
    if (typeof val === 'string') {
      if (this.__style == null) {
        this.__style = createCSSStyleDeclaration();
      }
      this.__style.cssText = val;
    }
    else {
      this.__style = val;
    }
  }
  get tabIndex() {
    return parseInt(this.getAttributeNS(null, 'tabindex') || '-1', 10);
  }
  set tabIndex(value) {
    this.setAttributeNS(null, 'tabindex', value);
  }
  get tagName() {
    var _a;
    return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
  }
  set tagName(value) {
    this.nodeName = value;
  }
  get textContent() {
    const text = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }
  set textContent(value) {
    setTextContent(this, value);
  }
  get title() {
    return this.getAttributeNS(null, 'title') || '';
  }
  set title(value) {
    this.setAttributeNS(null, 'title', value);
  }
  animate() {
    /**/
  }
  onanimationstart() {
    /**/
  }
  onanimationend() {
    /**/
  }
  onanimationiteration() {
    /**/
  }
  onabort() {
    /**/
  }
  onauxclick() {
    /**/
  }
  onbeforecopy() {
    /**/
  }
  onbeforecut() {
    /**/
  }
  onbeforepaste() {
    /**/
  }
  onblur() {
    /**/
  }
  oncancel() {
    /**/
  }
  oncanplay() {
    /**/
  }
  oncanplaythrough() {
    /**/
  }
  onchange() {
    /**/
  }
  onclick() {
    /**/
  }
  onclose() {
    /**/
  }
  oncontextmenu() {
    /**/
  }
  oncopy() {
    /**/
  }
  oncuechange() {
    /**/
  }
  oncut() {
    /**/
  }
  ondblclick() {
    /**/
  }
  ondrag() {
    /**/
  }
  ondragend() {
    /**/
  }
  ondragenter() {
    /**/
  }
  ondragleave() {
    /**/
  }
  ondragover() {
    /**/
  }
  ondragstart() {
    /**/
  }
  ondrop() {
    /**/
  }
  ondurationchange() {
    /**/
  }
  onemptied() {
    /**/
  }
  onended() {
    /**/
  }
  onerror() {
    /**/
  }
  onfocus() {
    /**/
  }
  onfocusin() {
    /**/
  }
  onfocusout() {
    /**/
  }
  onformdata() {
    /**/
  }
  onfullscreenchange() {
    /**/
  }
  onfullscreenerror() {
    /**/
  }
  ongotpointercapture() {
    /**/
  }
  oninput() {
    /**/
  }
  oninvalid() {
    /**/
  }
  onkeydown() {
    /**/
  }
  onkeypress() {
    /**/
  }
  onkeyup() {
    /**/
  }
  onload() {
    /**/
  }
  onloadeddata() {
    /**/
  }
  onloadedmetadata() {
    /**/
  }
  onloadstart() {
    /**/
  }
  onlostpointercapture() {
    /**/
  }
  onmousedown() {
    /**/
  }
  onmouseenter() {
    /**/
  }
  onmouseleave() {
    /**/
  }
  onmousemove() {
    /**/
  }
  onmouseout() {
    /**/
  }
  onmouseover() {
    /**/
  }
  onmouseup() {
    /**/
  }
  onmousewheel() {
    /**/
  }
  onpaste() {
    /**/
  }
  onpause() {
    /**/
  }
  onplay() {
    /**/
  }
  onplaying() {
    /**/
  }
  onpointercancel() {
    /**/
  }
  onpointerdown() {
    /**/
  }
  onpointerenter() {
    /**/
  }
  onpointerleave() {
    /**/
  }
  onpointermove() {
    /**/
  }
  onpointerout() {
    /**/
  }
  onpointerover() {
    /**/
  }
  onpointerup() {
    /**/
  }
  onprogress() {
    /**/
  }
  onratechange() {
    /**/
  }
  onreset() {
    /**/
  }
  onresize() {
    /**/
  }
  onscroll() {
    /**/
  }
  onsearch() {
    /**/
  }
  onseeked() {
    /**/
  }
  onseeking() {
    /**/
  }
  onselect() {
    /**/
  }
  onselectstart() {
    /**/
  }
  onstalled() {
    /**/
  }
  onsubmit() {
    /**/
  }
  onsuspend() {
    /**/
  }
  ontimeupdate() {
    /**/
  }
  ontoggle() {
    /**/
  }
  onvolumechange() {
    /**/
  }
  onwaiting() {
    /**/
  }
  onwebkitfullscreenchange() {
    /**/
  }
  onwebkitfullscreenerror() {
    /**/
  }
  onwheel() {
    /**/
  }
  requestFullscreen() {
    /**/
  }
  scrollBy() {
    /**/
  }
  scrollTo() {
    /**/
  }
  scrollIntoView() {
    /**/
  }
  toString(opts) {
    return serializeNodeToHtml(this, opts);
  }
}
function getElementsByClassName(elm, classNames, foundElms) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    for (let j = 0, jj = classNames.length; j < jj; j++) {
      if (childElm.classList.contains(classNames[j])) {
        foundElms.push(childElm);
      }
    }
    getElementsByClassName(childElm, classNames, foundElms);
  }
}
function getElementsByTagName(elm, tagName, foundElms) {
  var _a;
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (tagName === '*' || ((_a = childElm.nodeName) !== null && _a !== void 0 ? _a : '').toLowerCase() === tagName) {
      foundElms.push(childElm);
    }
    getElementsByTagName(childElm, tagName, foundElms);
  }
}
function resetElement(elm) {
  resetEventListeners(elm);
  delete elm.__attributeMap;
  delete elm.__shadowRoot;
  delete elm.__style;
}
function insertBefore(parentNode, newNode, referenceNode) {
  if (newNode !== referenceNode) {
    newNode.remove();
    newNode.parentNode = parentNode;
    newNode.ownerDocument = parentNode.ownerDocument;
    if (referenceNode != null) {
      const index = parentNode.childNodes.indexOf(referenceNode);
      if (index > -1) {
        parentNode.childNodes.splice(index, 0, newNode);
      }
      else {
        throw new Error(`referenceNode not found in parentNode.childNodes`);
      }
    }
    else {
      parentNode.childNodes.push(newNode);
    }
    connectNode(parentNode.ownerDocument, newNode);
  }
  return newNode;
}
class MockHTMLElement extends MockElement {
  constructor(ownerDocument, nodeName) {
    super(ownerDocument, typeof nodeName === 'string' ? nodeName.toUpperCase() : null);
    this.namespaceURI = 'http://www.w3.org/1999/xhtml';
  }
  get tagName() {
    var _a;
    return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
  }
  set tagName(value) {
    this.nodeName = value;
  }
  get attributes() {
    if (this.__attributeMap == null) {
      const attrMap = createAttributeProxy(true);
      this.__attributeMap = attrMap;
      return attrMap;
    }
    return this.__attributeMap;
  }
  set attributes(attrs) {
    this.__attributeMap = attrs;
  }
}
class MockTextNode extends MockNode {
  constructor(ownerDocument, text) {
    super(ownerDocument, 3 /* NODE_TYPES.TEXT_NODE */, "#text" /* NODE_NAMES.TEXT_NODE */, text);
  }
  cloneNode(_deep) {
    return new MockTextNode(null, this.nodeValue);
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(text) {
    this.nodeValue = text;
  }
  get data() {
    return this.nodeValue;
  }
  set data(text) {
    this.nodeValue = text;
  }
  get wholeText() {
    if (this.parentNode != null) {
      const text = [];
      for (let i = 0, ii = this.parentNode.childNodes.length; i < ii; i++) {
        const childNode = this.parentNode.childNodes[i];
        if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
          text.push(childNode.nodeValue);
        }
      }
      return text.join('');
    }
    return this.nodeValue;
  }
}
function getTextContent(childNodes, text) {
  for (let i = 0, ii = childNodes.length; i < ii; i++) {
    const childNode = childNodes[i];
    if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
      text.push(childNode.nodeValue);
    }
    else if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
      getTextContent(childNode.childNodes, text);
    }
  }
}
function setTextContent(elm, text) {
  for (let i = elm.childNodes.length - 1; i >= 0; i--) {
    elm.removeChild(elm.childNodes[i]);
  }
  const textNode = new MockTextNode(elm.ownerDocument, text);
  elm.appendChild(textNode);
}

class MockComment extends MockNode {
  constructor(ownerDocument, data) {
    super(ownerDocument, 8 /* NODE_TYPES.COMMENT_NODE */, "#comment" /* NODE_NAMES.COMMENT_NODE */, data);
  }
  cloneNode(_deep) {
    return new MockComment(null, this.nodeValue);
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(text) {
    this.nodeValue = text;
  }
}

class MockDocumentFragment extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, null);
    this.nodeName = "#document-fragment" /* NODE_NAMES.DOCUMENT_FRAGMENT_NODE */;
    this.nodeType = 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */;
  }
  getElementById(id) {
    return getElementById(this, id);
  }
  cloneNode(deep) {
    const cloned = new MockDocumentFragment(null);
    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const childNode = this.childNodes[i];
        if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
          childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */ ||
          childNode.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */) {
          const clonedChildNode = this.childNodes[i].cloneNode(true);
          cloned.appendChild(clonedChildNode);
        }
      }
    }
    return cloned;
  }
}

class MockDocumentTypeNode extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, '!DOCTYPE');
    this.nodeType = 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */;
    this.setAttribute('html', '');
  }
}

class MockCSSRule {
  constructor(parentStyleSheet) {
    this.parentStyleSheet = parentStyleSheet;
    this.cssText = '';
    this.type = 0;
  }
}
class MockCSSStyleSheet {
  constructor(ownerNode) {
    this.type = 'text/css';
    this.parentStyleSheet = null;
    this.cssRules = [];
    this.ownerNode = ownerNode;
  }
  get rules() {
    return this.cssRules;
  }
  set rules(rules) {
    this.cssRules = rules;
  }
  deleteRule(index) {
    if (index >= 0 && index < this.cssRules.length) {
      this.cssRules.splice(index, 1);
      updateStyleTextNode(this.ownerNode);
    }
  }
  insertRule(rule, index = 0) {
    if (typeof index !== 'number') {
      index = 0;
    }
    if (index < 0) {
      index = 0;
    }
    if (index > this.cssRules.length) {
      index = this.cssRules.length;
    }
    const cssRule = new MockCSSRule(this);
    cssRule.cssText = rule;
    this.cssRules.splice(index, 0, cssRule);
    updateStyleTextNode(this.ownerNode);
    return index;
  }
}
function getStyleElementText(styleElm) {
  const output = [];
  for (let i = 0; i < styleElm.childNodes.length; i++) {
    output.push(styleElm.childNodes[i].nodeValue);
  }
  return output.join('');
}
function setStyleElementText(styleElm, text) {
  // keeping the innerHTML and the sheet.cssRules connected
  // is not technically correct, but since we're doing
  // SSR we'll need to turn any assigned cssRules into
  // real text, not just properties that aren't rendered
  const sheet = styleElm.sheet;
  sheet.cssRules.length = 0;
  sheet.insertRule(text);
  updateStyleTextNode(styleElm);
}
function updateStyleTextNode(styleElm) {
  const childNodeLen = styleElm.childNodes.length;
  if (childNodeLen > 1) {
    for (let i = childNodeLen - 1; i >= 1; i--) {
      styleElm.removeChild(styleElm.childNodes[i]);
    }
  }
  else if (childNodeLen < 1) {
    styleElm.appendChild(styleElm.ownerDocument.createTextNode(''));
  }
  const textNode = styleElm.childNodes[0];
  textNode.nodeValue = styleElm.sheet.cssRules.map((r) => r.cssText).join('\n');
}

function createElement(ownerDocument, tagName) {
  if (typeof tagName !== 'string' || tagName === '' || !/^[a-z0-9-_:]+$/i.test(tagName)) {
    throw new Error(`The tag name provided (${tagName}) is not a valid name.`);
  }
  tagName = tagName.toLowerCase();
  switch (tagName) {
    case 'a':
      return new MockAnchorElement(ownerDocument);
    case 'base':
      return new MockBaseElement(ownerDocument);
    case 'button':
      return new MockButtonElement(ownerDocument);
    case 'canvas':
      return new MockCanvasElement(ownerDocument);
    case 'form':
      return new MockFormElement(ownerDocument);
    case 'img':
      return new MockImageElement(ownerDocument);
    case 'input':
      return new MockInputElement(ownerDocument);
    case 'link':
      return new MockLinkElement(ownerDocument);
    case 'meta':
      return new MockMetaElement(ownerDocument);
    case 'script':
      return new MockScriptElement(ownerDocument);
    case 'style':
      return new MockStyleElement(ownerDocument);
    case 'template':
      return new MockTemplateElement(ownerDocument);
    case 'title':
      return new MockTitleElement(ownerDocument);
  }
  if (ownerDocument != null && tagName.includes('-')) {
    const win = ownerDocument.defaultView;
    if (win != null && win.customElements != null) {
      return createCustomElement(win.customElements, ownerDocument, tagName);
    }
  }
  return new MockHTMLElement(ownerDocument, tagName);
}
function createElementNS(ownerDocument, namespaceURI, tagName) {
  if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return createElement(ownerDocument, tagName);
  }
  else if (namespaceURI === 'http://www.w3.org/2000/svg') {
    switch (tagName.toLowerCase()) {
      case 'text':
      case 'tspan':
      case 'tref':
      case 'altglyph':
      case 'textpath':
        return new MockSVGTextContentElement(ownerDocument, tagName);
      case 'circle':
      case 'ellipse':
      case 'image':
      case 'line':
      case 'path':
      case 'polygon':
      case 'polyline':
      case 'rect':
      case 'use':
        return new MockSVGGraphicsElement(ownerDocument, tagName);
      case 'svg':
        return new MockSVGSVGElement(ownerDocument, tagName);
      default:
        return new MockSVGElement(ownerDocument, tagName);
    }
  }
  else {
    return new MockElement(ownerDocument, tagName);
  }
}
class MockAnchorElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'a');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
  get pathname() {
    return new URL(this.href).pathname;
  }
}
class MockButtonElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'button');
  }
}
patchPropAttributes(MockButtonElement.prototype, {
  type: String,
}, {
  type: 'submit',
});
class MockImageElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'img');
  }
  get draggable() {
    return this.getAttributeNS(null, 'draggable') !== 'false';
  }
  set draggable(value) {
    this.setAttributeNS(null, 'draggable', value);
  }
  get src() {
    return fullUrl(this, 'src');
  }
  set src(value) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockImageElement.prototype, {
  height: Number,
  width: Number,
});
class MockInputElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'input');
  }
  get list() {
    const listId = this.getAttribute('list');
    if (listId) {
      return this.ownerDocument.getElementById(listId);
    }
    return null;
  }
}
patchPropAttributes(MockInputElement.prototype, {
  accept: String,
  autocomplete: String,
  autofocus: Boolean,
  capture: String,
  checked: Boolean,
  disabled: Boolean,
  form: String,
  formaction: String,
  formenctype: String,
  formmethod: String,
  formnovalidate: String,
  formtarget: String,
  height: Number,
  inputmode: String,
  max: String,
  maxLength: Number,
  min: String,
  minLength: Number,
  multiple: Boolean,
  name: String,
  pattern: String,
  placeholder: String,
  required: Boolean,
  readOnly: Boolean,
  size: Number,
  spellCheck: Boolean,
  src: String,
  step: String,
  type: String,
  value: String,
  width: Number,
}, {
  type: 'text',
});
class MockFormElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'form');
  }
}
patchPropAttributes(MockFormElement.prototype, {
  name: String,
});
class MockLinkElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'link');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
}
patchPropAttributes(MockLinkElement.prototype, {
  crossorigin: String,
  media: String,
  rel: String,
  type: String,
});
class MockMetaElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'meta');
  }
}
patchPropAttributes(MockMetaElement.prototype, {
  charset: String,
  content: String,
  name: String,
});
class MockScriptElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'script');
  }
  get src() {
    return fullUrl(this, 'src');
  }
  set src(value) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockScriptElement.prototype, {
  type: String,
});
class MockDOMMatrix {
  constructor() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    this.m11 = 1;
    this.m12 = 0;
    this.m13 = 0;
    this.m14 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.m23 = 0;
    this.m24 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
    this.m34 = 0;
    this.m41 = 0;
    this.m42 = 0;
    this.m43 = 0;
    this.m44 = 1;
    this.is2D = true;
    this.isIdentity = true;
  }
  static fromMatrix() {
    return new MockDOMMatrix();
  }
  inverse() {
    return new MockDOMMatrix();
  }
  flipX() {
    return new MockDOMMatrix();
  }
  flipY() {
    return new MockDOMMatrix();
  }
  multiply() {
    return new MockDOMMatrix();
  }
  rotate() {
    return new MockDOMMatrix();
  }
  rotateAxisAngle() {
    return new MockDOMMatrix();
  }
  rotateFromVector() {
    return new MockDOMMatrix();
  }
  scale() {
    return new MockDOMMatrix();
  }
  scaleNonUniform() {
    return new MockDOMMatrix();
  }
  skewX() {
    return new MockDOMMatrix();
  }
  skewY() {
    return new MockDOMMatrix();
  }
  toJSON() { }
  toString() { }
  transformPoint() {
    return new MockDOMPoint();
  }
  translate() {
    return new MockDOMMatrix();
  }
}
class MockDOMPoint {
  constructor() {
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
  toJSON() { }
  matrixTransform() {
    return new MockDOMMatrix();
  }
}
class MockSVGRect {
  constructor() {
    this.height = 10;
    this.width = 10;
    this.x = 0;
    this.y = 0;
  }
}
class MockStyleElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'style');
    this.sheet = new MockCSSStyleSheet(this);
  }
  get innerHTML() {
    return getStyleElementText(this);
  }
  set innerHTML(value) {
    setStyleElementText(this, value);
  }
  get innerText() {
    return getStyleElementText(this);
  }
  set innerText(value) {
    setStyleElementText(this, value);
  }
  get textContent() {
    return getStyleElementText(this);
  }
  set textContent(value) {
    setStyleElementText(this, value);
  }
}
class MockSVGElement extends MockElement {
  // SVGElement properties and methods
  get ownerSVGElement() {
    return null;
  }
  get viewportElement() {
    return null;
  }
  onunload() {
    /**/
  }
  // SVGGeometryElement properties and methods
  get pathLength() {
    return 0;
  }
  isPointInFill(_pt) {
    return false;
  }
  isPointInStroke(_pt) {
    return false;
  }
  getTotalLength() {
    return 0;
  }
}
class MockSVGGraphicsElement extends MockSVGElement {
  getBBox(_options) {
    return new MockSVGRect();
  }
  getCTM() {
    return new MockDOMMatrix();
  }
  getScreenCTM() {
    return new MockDOMMatrix();
  }
}
class MockSVGSVGElement extends MockSVGGraphicsElement {
  createSVGPoint() {
    return new MockDOMPoint();
  }
}
class MockSVGTextContentElement extends MockSVGGraphicsElement {
  getComputedTextLength() {
    return 0;
  }
}
class MockBaseElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'base');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
}
class MockTemplateElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'template');
    this.content = new MockDocumentFragment(ownerDocument);
  }
  get innerHTML() {
    return this.content.innerHTML;
  }
  set innerHTML(html) {
    this.content.innerHTML = html;
  }
  cloneNode(deep) {
    const cloned = new MockTemplateElement(null);
    cloned.attributes = cloneAttributes(this.attributes);
    const styleCssText = this.getAttribute('style');
    if (styleCssText != null && styleCssText.length > 0) {
      cloned.setAttribute('style', styleCssText);
    }
    cloned.content = this.content.cloneNode(deep);
    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const clonedChildNode = this.childNodes[i].cloneNode(true);
        cloned.appendChild(clonedChildNode);
      }
    }
    return cloned;
  }
}
class MockTitleElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'title');
  }
  get text() {
    return this.textContent;
  }
  set text(value) {
    this.textContent = value;
  }
}
class MockCanvasElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'canvas');
  }
  getContext() {
    return {
      fillRect() {
        return;
      },
      clearRect() { },
      getImageData: function (_, __, w, h) {
        return {
          data: new Array(w * h * 4),
        };
      },
      putImageData() { },
      createImageData: function () {
        return [];
      },
      setTransform() { },
      drawImage() { },
      save() { },
      fillText() { },
      restore() { },
      beginPath() { },
      moveTo() { },
      lineTo() { },
      closePath() { },
      stroke() { },
      translate() { },
      scale() { },
      rotate() { },
      arc() { },
      fill() { },
      measureText() {
        return { width: 0 };
      },
      transform() { },
      rect() { },
      clip() { },
    };
  }
}
function fullUrl(elm, attrName) {
  const val = elm.getAttribute(attrName) || '';
  if (elm.ownerDocument != null) {
    const win = elm.ownerDocument.defaultView;
    if (win != null) {
      const loc = win.location;
      if (loc != null) {
        try {
          const url = new URL(val, loc.href);
          return url.href;
        }
        catch (e) { }
      }
    }
  }
  return val.replace(/\'|\"/g, '').trim();
}
function patchPropAttributes(prototype, attrs, defaults = {}) {
  Object.keys(attrs).forEach((propName) => {
    const attr = attrs[propName];
    const defaultValue = defaults[propName];
    if (attr === Boolean) {
      Object.defineProperty(prototype, propName, {
        get() {
          return this.hasAttribute(propName);
        },
        set(value) {
          if (value) {
            this.setAttribute(propName, '');
          }
          else {
            this.removeAttribute(propName);
          }
        },
      });
    }
    else if (attr === Number) {
      Object.defineProperty(prototype, propName, {
        get() {
          const value = this.getAttribute(propName);
          return value ? parseInt(value, 10) : defaultValue === undefined ? 0 : defaultValue;
        },
        set(value) {
          this.setAttribute(propName, value);
        },
      });
    }
    else {
      Object.defineProperty(prototype, propName, {
        get() {
          return this.hasAttribute(propName) ? this.getAttribute(propName) : defaultValue || '';
        },
        set(value) {
          this.setAttribute(propName, value);
        },
      });
    }
  });
}
MockElement.prototype.cloneNode = function (deep) {
  // because we're creating elements, which extending specific HTML base classes there
  // is a MockElement circular reference that bundling has trouble dealing with so
  // the fix is to add cloneNode() to MockElement's prototype after the HTML classes
  const cloned = createElement(this.ownerDocument, this.nodeName);
  cloned.attributes = cloneAttributes(this.attributes);
  const styleCssText = this.getAttribute('style');
  if (styleCssText != null && styleCssText.length > 0) {
    cloned.setAttribute('style', styleCssText);
  }
  if (deep) {
    for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
      const clonedChildNode = this.childNodes[i].cloneNode(true);
      cloned.appendChild(clonedChildNode);
    }
  }
  return cloned;
};

let sharedDocument;
function parseHtmlToDocument(html, ownerDocument = null) {
  if (ownerDocument == null) {
    if (sharedDocument == null) {
      sharedDocument = new MockDocument();
    }
    ownerDocument = sharedDocument;
  }
  return parseDocumentUtil(ownerDocument, html);
}
function parseHtmlToFragment(html, ownerDocument = null) {
  if (ownerDocument == null) {
    if (sharedDocument == null) {
      sharedDocument = new MockDocument();
    }
    ownerDocument = sharedDocument;
  }
  return parseFragmentUtil(ownerDocument, html);
}

const consoleNoop = () => {
  /**/
};
function createConsole() {
  return {
    debug: consoleNoop,
    error: consoleNoop,
    info: consoleNoop,
    log: consoleNoop,
    warn: consoleNoop,
    dir: consoleNoop,
    dirxml: consoleNoop,
    table: consoleNoop,
    trace: consoleNoop,
    group: consoleNoop,
    groupCollapsed: consoleNoop,
    groupEnd: consoleNoop,
    clear: consoleNoop,
    count: consoleNoop,
    countReset: consoleNoop,
    assert: consoleNoop,
    profile: consoleNoop,
    profileEnd: consoleNoop,
    time: consoleNoop,
    timeLog: consoleNoop,
    timeEnd: consoleNoop,
    timeStamp: consoleNoop,
    context: consoleNoop,
    memory: consoleNoop,
  };
}

class MockHeaders {
  constructor(init) {
    this._values = [];
    if (typeof init === 'object') {
      if (typeof init[Symbol.iterator] === 'function') {
        const kvs = [];
        for (const kv of init) {
          if (typeof kv[Symbol.iterator] === 'function') {
            kvs.push([...kv]);
          }
        }
        for (const kv of kvs) {
          this.append(kv[0], kv[1]);
        }
      }
      else {
        for (const key in init) {
          this.append(key, init[key]);
        }
      }
    }
  }
  append(key, value) {
    this._values.push([key, value + '']);
  }
  delete(key) {
    key = key.toLowerCase();
    for (let i = this._values.length - 1; i >= 0; i--) {
      if (this._values[i][0].toLowerCase() === key) {
        this._values.splice(i, 1);
      }
    }
  }
  entries() {
    const entries = [];
    for (const kv of this.keys()) {
      entries.push([kv, this.get(kv)]);
    }
    let index = -1;
    return {
      next() {
        index++;
        return {
          value: entries[index],
          done: !entries[index],
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  forEach(cb) {
    for (const kv of this.entries()) {
      cb(kv[1], kv[0]);
    }
  }
  get(key) {
    const rtn = [];
    key = key.toLowerCase();
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key) {
        rtn.push(kv[1]);
      }
    }
    return rtn.length > 0 ? rtn.join(', ') : null;
  }
  has(key) {
    key = key.toLowerCase();
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key) {
        return true;
      }
    }
    return false;
  }
  keys() {
    const keys = [];
    for (const kv of this._values) {
      const key = kv[0].toLowerCase();
      if (!keys.includes(key)) {
        keys.push(key);
      }
    }
    let index = -1;
    return {
      next() {
        index++;
        return {
          value: keys[index],
          done: !keys[index],
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  set(key, value) {
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key.toLowerCase()) {
        kv[1] = value + '';
        return;
      }
    }
    this.append(key, value);
  }
  values() {
    const values = this._values;
    let index = -1;
    return {
      next() {
        index++;
        const done = !values[index];
        return {
          value: done ? undefined : values[index][1],
          done,
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}

class MockDOMParser {
  parseFromString(htmlToParse, mimeType) {
    if (mimeType !== 'text/html') {
      console.error('XML parsing not implemented yet, continuing as html');
    }
    return parseHtmlToDocument(htmlToParse);
  }
}

class MockRequest {
  constructor(input, init = {}) {
    this._method = 'GET';
    this._url = '/';
    this.bodyUsed = false;
    this.cache = 'default';
    this.credentials = 'same-origin';
    this.integrity = '';
    this.keepalive = false;
    this.mode = 'cors';
    this.redirect = 'follow';
    this.referrer = 'about:client';
    this.referrerPolicy = '';
    if (typeof input === 'string') {
      this.url = input;
    }
    else if (input) {
      Object.assign(this, input);
      this.headers = new MockHeaders(input.headers);
    }
    Object.assign(this, init);
    if (init.headers) {
      this.headers = new MockHeaders(init.headers);
    }
    if (!this.headers) {
      this.headers = new MockHeaders();
    }
  }
  get url() {
    if (typeof this._url === 'string') {
      return new URL(this._url, location.href).href;
    }
    return new URL('/', location.href).href;
  }
  set url(value) {
    this._url = value;
  }
  get method() {
    if (typeof this._method === 'string') {
      return this._method.toUpperCase();
    }
    return 'GET';
  }
  set method(value) {
    this._method = value;
  }
  clone() {
    const clone = { ...this };
    clone.headers = new MockHeaders(this.headers);
    return new MockRequest(clone);
  }
}
class MockResponse {
  constructor(body, init = {}) {
    this.ok = true;
    this.status = 200;
    this.statusText = '';
    this.type = 'default';
    this.url = '';
    this._body = body;
    if (init) {
      Object.assign(this, init);
    }
    this.headers = new MockHeaders(init.headers);
  }
  async json() {
    return JSON.parse(this._body);
  }
  async text() {
    return this._body;
  }
  clone() {
    const initClone = { ...this };
    initClone.headers = new MockHeaders(this.headers);
    return new MockResponse(this._body, initClone);
  }
}

function setupGlobal(gbl) {
  if (gbl.window == null) {
    const win = (gbl.window = new MockWindow());
    WINDOW_FUNCTIONS.forEach((fnName) => {
      if (!(fnName in gbl)) {
        gbl[fnName] = win[fnName].bind(win);
      }
    });
    WINDOW_PROPS.forEach((propName) => {
      if (!(propName in gbl)) {
        Object.defineProperty(gbl, propName, {
          get() {
            return win[propName];
          },
          set(val) {
            win[propName] = val;
          },
          configurable: true,
          enumerable: true,
        });
      }
    });
    GLOBAL_CONSTRUCTORS.forEach(([cstrName]) => {
      gbl[cstrName] = win[cstrName];
    });
  }
  return gbl.window;
}
function teardownGlobal(gbl) {
  const win = gbl.window;
  if (win && typeof win.close === 'function') {
    win.close();
  }
}
function patchWindow(winToBePatched) {
  const mockWin = new MockWindow(false);
  WINDOW_FUNCTIONS.forEach((fnName) => {
    if (typeof winToBePatched[fnName] !== 'function') {
      winToBePatched[fnName] = mockWin[fnName].bind(mockWin);
    }
  });
  WINDOW_PROPS.forEach((propName) => {
    if (winToBePatched === undefined) {
      Object.defineProperty(winToBePatched, propName, {
        get() {
          return mockWin[propName];
        },
        set(val) {
          mockWin[propName] = val;
        },
        configurable: true,
        enumerable: true,
      });
    }
  });
}
function addGlobalsToWindowPrototype(mockWinPrototype) {
  GLOBAL_CONSTRUCTORS.forEach(([cstrName, Cstr]) => {
    Object.defineProperty(mockWinPrototype, cstrName, {
      get() {
        return this['__' + cstrName] || Cstr;
      },
      set(cstr) {
        this['__' + cstrName] = cstr;
      },
      configurable: true,
      enumerable: true,
    });
  });
}
const WINDOW_FUNCTIONS = [
  'addEventListener',
  'alert',
  'blur',
  'cancelAnimationFrame',
  'cancelIdleCallback',
  'clearInterval',
  'clearTimeout',
  'close',
  'confirm',
  'dispatchEvent',
  'focus',
  'getComputedStyle',
  'matchMedia',
  'open',
  'prompt',
  'removeEventListener',
  'requestAnimationFrame',
  'requestIdleCallback',
  'URL',
];
const WINDOW_PROPS = [
  'customElements',
  'devicePixelRatio',
  'document',
  'history',
  'innerHeight',
  'innerWidth',
  'localStorage',
  'location',
  'navigator',
  'pageXOffset',
  'pageYOffset',
  'performance',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scrollX',
  'scrollY',
  'sessionStorage',
  'CSS',
  'CustomEvent',
  'Event',
  'Element',
  'HTMLElement',
  'Node',
  'NodeList',
  'FocusEvent',
  'KeyboardEvent',
  'MouseEvent',
];
const GLOBAL_CONSTRUCTORS = [
  ['CustomEvent', MockCustomEvent],
  ['Event', MockEvent],
  ['Headers', MockHeaders],
  ['FocusEvent', MockFocusEvent],
  ['KeyboardEvent', MockKeyboardEvent],
  ['MouseEvent', MockMouseEvent],
  ['Request', MockRequest],
  ['Response', MockResponse],
  ['DOMParser', MockDOMParser],
  ['HTMLAnchorElement', MockAnchorElement],
  ['HTMLBaseElement', MockBaseElement],
  ['HTMLButtonElement', MockButtonElement],
  ['HTMLCanvasElement', MockCanvasElement],
  ['HTMLFormElement', MockFormElement],
  ['HTMLImageElement', MockImageElement],
  ['HTMLInputElement', MockInputElement],
  ['HTMLLinkElement', MockLinkElement],
  ['HTMLMetaElement', MockMetaElement],
  ['HTMLScriptElement', MockScriptElement],
  ['HTMLStyleElement', MockStyleElement],
  ['HTMLTemplateElement', MockTemplateElement],
  ['HTMLTitleElement', MockTitleElement],
];

class MockHistory {
  constructor() {
    this.items = [];
  }
  get length() {
    return this.items.length;
  }
  back() {
    this.go(-1);
  }
  forward() {
    this.go(1);
  }
  go(_value) {
    //
  }
  pushState(_state, _title, _url) {
    //
  }
  replaceState(_state, _title, _url) {
    //
  }
}

class MockIntersectionObserver {
  constructor() {
    /**/
  }
  disconnect() {
    /**/
  }
  observe() {
    /**/
  }
  takeRecords() {
    return [];
  }
  unobserve() {
    /**/
  }
}

class MockLocation {
  constructor() {
    this.ancestorOrigins = null;
    this.protocol = '';
    this.host = '';
    this.hostname = '';
    this.port = '';
    this.pathname = '';
    this.search = '';
    this.hash = '';
    this.username = '';
    this.password = '';
    this.origin = '';
    this._href = '';
  }
  get href() {
    return this._href;
  }
  set href(value) {
    const url = new URL(value, 'http://mockdoc.stenciljs.com');
    this._href = url.href;
    this.protocol = url.protocol;
    this.host = url.host;
    this.hostname = url.hostname;
    this.port = url.port;
    this.pathname = url.pathname;
    this.search = url.search;
    this.hash = url.hash;
    this.username = url.username;
    this.password = url.password;
    this.origin = url.origin;
  }
  assign(_url) {
    //
  }
  reload(_forcedReload) {
    //
  }
  replace(_url) {
    //
  }
  toString() {
    return this.href;
  }
}

class MockNavigator {
  constructor() {
    this.appCodeName = 'MockNavigator';
    this.appName = 'MockNavigator';
    this.appVersion = 'MockNavigator';
    this.platform = 'MockNavigator';
    this.userAgent = 'MockNavigator';
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
class MockPerformance {
  constructor() {
    this.timeOrigin = Date.now();
    this.eventCounts = new Map();
  }
  addEventListener() {
    //
  }
  clearMarks() {
    //
  }
  clearMeasures() {
    //
  }
  clearResourceTimings() {
    //
  }
  dispatchEvent() {
    return true;
  }
  getEntries() {
    return [];
  }
  getEntriesByName() {
    return [];
  }
  getEntriesByType() {
    return [];
  }
  // Stencil's implementation of `mark` is non-compliant with the `Performance` interface. Because Stencil will
  // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
  // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
  // associated errors returned by the type checker)
  // @ts-ignore
  mark() {
    //
  }
  // Stencil's implementation of `measure` is non-compliant with the `Performance` interface. Because Stencil will
  // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
  // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
  // associated errors returned by the type checker)
  // @ts-ignore
  measure() {
    //
  }
  get navigation() {
    return {};
  }
  now() {
    return Date.now() - this.timeOrigin;
  }
  get onresourcetimingbufferfull() {
    return null;
  }
  removeEventListener() {
    //
  }
  setResourceTimingBufferSize() {
    //
  }
  get timing() {
    return {};
  }
  toJSON() {
    //
  }
}
function resetPerformance(perf) {
  if (perf != null) {
    try {
      perf.timeOrigin = Date.now();
    }
    catch (e) { }
  }
}

class MockStorage {
  constructor() {
    this.items = new Map();
  }
  key(_value) {
    //
  }
  getItem(key) {
    key = String(key);
    if (this.items.has(key)) {
      return this.items.get(key);
    }
    return null;
  }
  setItem(key, value) {
    if (value == null) {
      value = 'null';
    }
    this.items.set(String(key), String(value));
  }
  removeItem(key) {
    this.items.delete(String(key));
  }
  clear() {
    this.items.clear();
  }
}

const nativeClearInterval = clearInterval;
const nativeClearTimeout = clearTimeout;
const nativeSetInterval = setInterval;
const nativeSetTimeout = setTimeout;
const nativeURL = URL;
class MockWindow {
  constructor(html = null) {
    if (html !== false) {
      this.document = new MockDocument(html, this);
    }
    else {
      this.document = null;
    }
    this.performance = new MockPerformance();
    this.customElements = new MockCustomElementRegistry(this);
    this.console = createConsole();
    resetWindowDefaults(this);
    resetWindowDimensions(this);
  }
  addEventListener(type, handler) {
    addEventListener(this, type, handler);
  }
  alert(msg) {
    if (this.console) {
      this.console.debug(msg);
    }
    else {
      console.debug(msg);
    }
  }
  blur() {
    /**/
  }
  cancelAnimationFrame(id) {
    this.__clearTimeout(id);
  }
  cancelIdleCallback(id) {
    this.__clearTimeout(id);
  }
  get CharacterData() {
    if (this.__charDataCstr == null) {
      const ownerDocument = this.document;
      this.__charDataCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct CharacterData');
        }
      };
    }
    return this.__charDataCstr;
  }
  set CharacterData(charDataCstr) {
    this.__charDataCstr = charDataCstr;
  }
  clearInterval(id) {
    this.__clearInterval(id);
  }
  clearTimeout(id) {
    this.__clearTimeout(id);
  }
  close() {
    resetWindow(this);
  }
  confirm() {
    return false;
  }
  get CSS() {
    return {
      supports: () => true,
    };
  }
  get Document() {
    if (this.__docCstr == null) {
      const win = this;
      this.__docCstr = class extends MockDocument {
        constructor() {
          super(false, win);
          throw new Error('Illegal constructor: cannot construct Document');
        }
      };
    }
    return this.__docCstr;
  }
  set Document(docCstr) {
    this.__docCstr = docCstr;
  }
  get DocumentFragment() {
    if (this.__docFragCstr == null) {
      const ownerDocument = this.document;
      this.__docFragCstr = class extends MockDocumentFragment {
        constructor() {
          super(ownerDocument);
          throw new Error('Illegal constructor: cannot construct DocumentFragment');
        }
      };
    }
    return this.__docFragCstr;
  }
  set DocumentFragment(docFragCstr) {
    this.__docFragCstr = docFragCstr;
  }
  get DocumentType() {
    if (this.__docTypeCstr == null) {
      const ownerDocument = this.document;
      this.__docTypeCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct DocumentType');
        }
      };
    }
    return this.__docTypeCstr;
  }
  set DocumentType(docTypeCstr) {
    this.__docTypeCstr = docTypeCstr;
  }
  get DOMTokenList() {
    if (this.__domTokenListCstr == null) {
      this.__domTokenListCstr = class MockDOMTokenList {
      };
    }
    return this.__domTokenListCstr;
  }
  set DOMTokenList(domTokenListCstr) {
    this.__domTokenListCstr = domTokenListCstr;
  }
  dispatchEvent(ev) {
    return dispatchEvent(this, ev);
  }
  get Element() {
    if (this.__elementCstr == null) {
      const ownerDocument = this.document;
      this.__elementCstr = class extends MockElement {
        constructor() {
          super(ownerDocument, '');
          throw new Error('Illegal constructor: cannot construct Element');
        }
      };
    }
    return this.__elementCstr;
  }
  fetch(input, init) {
    if (typeof fetch === 'function') {
      return fetch(input, init);
    }
    throw new Error(`fetch() not implemented`);
  }
  focus() {
    /**/
  }
  getComputedStyle(_) {
    return {
      cssText: '',
      length: 0,
      parentRule: null,
      getPropertyPriority() {
        return null;
      },
      getPropertyValue() {
        return '';
      },
      item() {
        return null;
      },
      removeProperty() {
        return null;
      },
      setProperty() {
        return null;
      },
    };
  }
  get globalThis() {
    return this;
  }
  get history() {
    if (this.__history == null) {
      this.__history = new MockHistory();
    }
    return this.__history;
  }
  set history(hsty) {
    this.__history = hsty;
  }
  get JSON() {
    return JSON;
  }
  get HTMLElement() {
    if (this.__htmlElementCstr == null) {
      const ownerDocument = this.document;
      this.__htmlElementCstr = class extends MockHTMLElement {
        constructor() {
          super(ownerDocument, '');
          const observedAttributes = this.constructor.observedAttributes;
          if (Array.isArray(observedAttributes) && typeof this.attributeChangedCallback === 'function') {
            observedAttributes.forEach((attrName) => {
              const attrValue = this.getAttribute(attrName);
              if (attrValue != null) {
                this.attributeChangedCallback(attrName, null, attrValue);
              }
            });
          }
        }
      };
    }
    return this.__htmlElementCstr;
  }
  set HTMLElement(htmlElementCstr) {
    this.__htmlElementCstr = htmlElementCstr;
  }
  get IntersectionObserver() {
    return MockIntersectionObserver;
  }
  get localStorage() {
    if (this.__localStorage == null) {
      this.__localStorage = new MockStorage();
    }
    return this.__localStorage;
  }
  set localStorage(locStorage) {
    this.__localStorage = locStorage;
  }
  get location() {
    if (this.__location == null) {
      this.__location = new MockLocation();
    }
    return this.__location;
  }
  set location(val) {
    if (typeof val === 'string') {
      if (this.__location == null) {
        this.__location = new MockLocation();
      }
      this.__location.href = val;
    }
    else {
      this.__location = val;
    }
  }
  matchMedia() {
    return {
      matches: false,
    };
  }
  get Node() {
    if (this.__nodeCstr == null) {
      const ownerDocument = this.document;
      this.__nodeCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct Node');
        }
      };
    }
    return this.__nodeCstr;
  }
  get NodeList() {
    if (this.__nodeListCstr == null) {
      const ownerDocument = this.document;
      this.__nodeListCstr = class extends MockNodeList {
        constructor() {
          super(ownerDocument, [], 0);
          throw new Error('Illegal constructor: cannot construct NodeList');
        }
      };
    }
    return this.__nodeListCstr;
  }
  get navigator() {
    if (this.__navigator == null) {
      this.__navigator = new MockNavigator();
    }
    return this.__navigator;
  }
  set navigator(nav) {
    this.__navigator = nav;
  }
  get parent() {
    return null;
  }
  prompt() {
    return '';
  }
  open() {
    return null;
  }
  get origin() {
    return this.location.origin;
  }
  removeEventListener(type, handler) {
    removeEventListener(this, type, handler);
  }
  requestAnimationFrame(callback) {
    return this.setTimeout(() => {
      callback(Date.now());
    }, 0);
  }
  requestIdleCallback(callback) {
    return this.setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => 0,
      });
    }, 0);
  }
  scroll(_x, _y) {
    /**/
  }
  scrollBy(_x, _y) {
    /**/
  }
  scrollTo(_x, _y) {
    /**/
  }
  get self() {
    return this;
  }
  get sessionStorage() {
    if (this.__sessionStorage == null) {
      this.__sessionStorage = new MockStorage();
    }
    return this.__sessionStorage;
  }
  set sessionStorage(locStorage) {
    this.__sessionStorage = locStorage;
  }
  setInterval(callback, ms, ...args) {
    if (this.__timeouts == null) {
      this.__timeouts = new Set();
    }
    ms = Math.min(ms, this.__maxTimeout);
    if (this.__allowInterval) {
      const intervalId = this.__setInterval(() => {
        if (this.__timeouts) {
          this.__timeouts.delete(intervalId);
          try {
            callback(...args);
          }
          catch (e) {
            if (this.console) {
              this.console.error(e);
            }
            else {
              console.error(e);
            }
          }
        }
      }, ms);
      if (this.__timeouts) {
        this.__timeouts.add(intervalId);
      }
      return intervalId;
    }
    const timeoutId = this.__setTimeout(() => {
      if (this.__timeouts) {
        this.__timeouts.delete(timeoutId);
        try {
          callback(...args);
        }
        catch (e) {
          if (this.console) {
            this.console.error(e);
          }
          else {
            console.error(e);
          }
        }
      }
    }, ms);
    if (this.__timeouts) {
      this.__timeouts.add(timeoutId);
    }
    return timeoutId;
  }
  setTimeout(callback, ms, ...args) {
    if (this.__timeouts == null) {
      this.__timeouts = new Set();
    }
    ms = Math.min(ms, this.__maxTimeout);
    const timeoutId = this.__setTimeout(() => {
      if (this.__timeouts) {
        this.__timeouts.delete(timeoutId);
        try {
          callback(...args);
        }
        catch (e) {
          if (this.console) {
            this.console.error(e);
          }
          else {
            console.error(e);
          }
        }
      }
    }, ms);
    if (this.__timeouts) {
      this.__timeouts.add(timeoutId);
    }
    return timeoutId;
  }
  get top() {
    return this;
  }
  get window() {
    return this;
  }
  onanimationstart() {
    /**/
  }
  onanimationend() {
    /**/
  }
  onanimationiteration() {
    /**/
  }
  onabort() {
    /**/
  }
  onauxclick() {
    /**/
  }
  onbeforecopy() {
    /**/
  }
  onbeforecut() {
    /**/
  }
  onbeforepaste() {
    /**/
  }
  onblur() {
    /**/
  }
  oncancel() {
    /**/
  }
  oncanplay() {
    /**/
  }
  oncanplaythrough() {
    /**/
  }
  onchange() {
    /**/
  }
  onclick() {
    /**/
  }
  onclose() {
    /**/
  }
  oncontextmenu() {
    /**/
  }
  oncopy() {
    /**/
  }
  oncuechange() {
    /**/
  }
  oncut() {
    /**/
  }
  ondblclick() {
    /**/
  }
  ondrag() {
    /**/
  }
  ondragend() {
    /**/
  }
  ondragenter() {
    /**/
  }
  ondragleave() {
    /**/
  }
  ondragover() {
    /**/
  }
  ondragstart() {
    /**/
  }
  ondrop() {
    /**/
  }
  ondurationchange() {
    /**/
  }
  onemptied() {
    /**/
  }
  onended() {
    /**/
  }
  onerror() {
    /**/
  }
  onfocus() {
    /**/
  }
  onfocusin() {
    /**/
  }
  onfocusout() {
    /**/
  }
  onformdata() {
    /**/
  }
  onfullscreenchange() {
    /**/
  }
  onfullscreenerror() {
    /**/
  }
  ongotpointercapture() {
    /**/
  }
  oninput() {
    /**/
  }
  oninvalid() {
    /**/
  }
  onkeydown() {
    /**/
  }
  onkeypress() {
    /**/
  }
  onkeyup() {
    /**/
  }
  onload() {
    /**/
  }
  onloadeddata() {
    /**/
  }
  onloadedmetadata() {
    /**/
  }
  onloadstart() {
    /**/
  }
  onlostpointercapture() {
    /**/
  }
  onmousedown() {
    /**/
  }
  onmouseenter() {
    /**/
  }
  onmouseleave() {
    /**/
  }
  onmousemove() {
    /**/
  }
  onmouseout() {
    /**/
  }
  onmouseover() {
    /**/
  }
  onmouseup() {
    /**/
  }
  onmousewheel() {
    /**/
  }
  onpaste() {
    /**/
  }
  onpause() {
    /**/
  }
  onplay() {
    /**/
  }
  onplaying() {
    /**/
  }
  onpointercancel() {
    /**/
  }
  onpointerdown() {
    /**/
  }
  onpointerenter() {
    /**/
  }
  onpointerleave() {
    /**/
  }
  onpointermove() {
    /**/
  }
  onpointerout() {
    /**/
  }
  onpointerover() {
    /**/
  }
  onpointerup() {
    /**/
  }
  onprogress() {
    /**/
  }
  onratechange() {
    /**/
  }
  onreset() {
    /**/
  }
  onresize() {
    /**/
  }
  onscroll() {
    /**/
  }
  onsearch() {
    /**/
  }
  onseeked() {
    /**/
  }
  onseeking() {
    /**/
  }
  onselect() {
    /**/
  }
  onselectstart() {
    /**/
  }
  onstalled() {
    /**/
  }
  onsubmit() {
    /**/
  }
  onsuspend() {
    /**/
  }
  ontimeupdate() {
    /**/
  }
  ontoggle() {
    /**/
  }
  onvolumechange() {
    /**/
  }
  onwaiting() {
    /**/
  }
  onwebkitfullscreenchange() {
    /**/
  }
  onwebkitfullscreenerror() {
    /**/
  }
  onwheel() {
    /**/
  }
}
addGlobalsToWindowPrototype(MockWindow.prototype);
function resetWindowDefaults(win) {
  win.__clearInterval = nativeClearInterval;
  win.__clearTimeout = nativeClearTimeout;
  win.__setInterval = nativeSetInterval;
  win.__setTimeout = nativeSetTimeout;
  win.__maxTimeout = 30000;
  win.__allowInterval = true;
  win.URL = nativeURL;
}
function cloneWindow(srcWin, opts = {}) {
  if (srcWin == null) {
    return null;
  }
  const clonedWin = new MockWindow(false);
  if (!opts.customElementProxy) {
    // TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
    // @ts-ignore
    srcWin.customElements = null;
  }
  if (srcWin.document != null) {
    const clonedDoc = new MockDocument(false, clonedWin);
    clonedWin.document = clonedDoc;
    clonedDoc.documentElement = srcWin.document.documentElement.cloneNode(true);
  }
  else {
    clonedWin.document = new MockDocument(null, clonedWin);
  }
  return clonedWin;
}
function cloneDocument(srcDoc) {
  if (srcDoc == null) {
    return null;
  }
  const dstWin = cloneWindow(srcDoc.defaultView);
  return dstWin.document;
}
// TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
/**
 * Constrain setTimeout() to 1ms, but still async. Also
 * only allow setInterval() to fire once, also constrained to 1ms.
 * @param win the mock window instance to update
 */
function constrainTimeouts(win) {
  win.__allowInterval = false;
  win.__maxTimeout = 0;
}
function resetWindow(win) {
  if (win != null) {
    if (win.__timeouts) {
      win.__timeouts.forEach((timeoutId) => {
        nativeClearInterval(timeoutId);
        nativeClearTimeout(timeoutId);
      });
      win.__timeouts.clear();
    }
    if (win.customElements && win.customElements.clear) {
      win.customElements.clear();
    }
    resetDocument(win.document);
    resetPerformance(win.performance);
    for (const key in win) {
      if (win.hasOwnProperty(key) && key !== 'document' && key !== 'performance' && key !== 'customElements') {
        delete win[key];
      }
    }
    resetWindowDefaults(win);
    resetWindowDimensions(win);
    resetEventListeners(win);
    if (win.document != null) {
      try {
        win.document.defaultView = win;
      }
      catch (e) { }
    }
    // ensure we don't hold onto nodeFetch values
    win.fetch = null;
    win.Headers = null;
    win.Request = null;
    win.Response = null;
    win.FetchError = null;
  }
}
function resetWindowDimensions(win) {
  try {
    win.devicePixelRatio = 1;
    win.innerHeight = 768;
    win.innerWidth = 1366;
    win.pageXOffset = 0;
    win.pageYOffset = 0;
    win.screenLeft = 0;
    win.screenTop = 0;
    win.screenX = 0;
    win.screenY = 0;
    win.scrollX = 0;
    win.scrollY = 0;
    win.screen = {
      availHeight: win.innerHeight,
      availLeft: 0,
      availTop: 0,
      availWidth: win.innerWidth,
      colorDepth: 24,
      height: win.innerHeight,
      keepAwake: false,
      orientation: {
        angle: 0,
        type: 'portrait-primary',
      },
      pixelDepth: 24,
      width: win.innerWidth,
    };
  }
  catch (e) { }
}

class MockDocument extends MockHTMLElement {
  constructor(html = null, win = null) {
    super(null, null);
    this.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
    this.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
    this.defaultView = win;
    this.cookie = '';
    this.referrer = '';
    this.appendChild(this.createDocumentTypeNode());
    if (typeof html === 'string') {
      const parsedDoc = parseDocumentUtil(this, html);
      const documentElement = parsedDoc.children.find((elm) => elm.nodeName === 'HTML');
      if (documentElement != null) {
        this.appendChild(documentElement);
        setOwnerDocument(documentElement, this);
      }
    }
    else if (html !== false) {
      const documentElement = new MockHTMLElement(this, 'html');
      this.appendChild(documentElement);
      documentElement.appendChild(new MockHTMLElement(this, 'head'));
      documentElement.appendChild(new MockHTMLElement(this, 'body'));
    }
  }
  get dir() {
    return this.documentElement.dir;
  }
  set dir(value) {
    this.documentElement.dir = value;
  }
  get location() {
    if (this.defaultView != null) {
      return this.defaultView.location;
    }
    return null;
  }
  set location(val) {
    if (this.defaultView != null) {
      this.defaultView.location = val;
    }
  }
  get baseURI() {
    const baseNode = this.head.childNodes.find((node) => node.nodeName === 'BASE');
    if (baseNode) {
      return baseNode.href;
    }
    return this.URL;
  }
  get URL() {
    return this.location.href;
  }
  get styleSheets() {
    return this.querySelectorAll('style');
  }
  get scripts() {
    return this.querySelectorAll('script');
  }
  get forms() {
    return this.querySelectorAll('form');
  }
  get images() {
    return this.querySelectorAll('img');
  }
  get scrollingElement() {
    return this.documentElement;
  }
  get documentElement() {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeName === 'HTML') {
        return this.childNodes[i];
      }
    }
    const documentElement = new MockHTMLElement(this, 'html');
    this.appendChild(documentElement);
    return documentElement;
  }
  set documentElement(documentElement) {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeType !== 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */) {
        this.childNodes[i].remove();
      }
    }
    if (documentElement != null) {
      this.appendChild(documentElement);
      setOwnerDocument(documentElement, this);
    }
  }
  get head() {
    const documentElement = this.documentElement;
    for (let i = 0; i < documentElement.childNodes.length; i++) {
      if (documentElement.childNodes[i].nodeName === 'HEAD') {
        return documentElement.childNodes[i];
      }
    }
    const head = new MockHTMLElement(this, 'head');
    documentElement.insertBefore(head, documentElement.firstChild);
    return head;
  }
  set head(head) {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'HEAD') {
        documentElement.childNodes[i].remove();
      }
    }
    if (head != null) {
      documentElement.insertBefore(head, documentElement.firstChild);
      setOwnerDocument(head, this);
    }
  }
  get body() {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'BODY') {
        return documentElement.childNodes[i];
      }
    }
    const body = new MockHTMLElement(this, 'body');
    documentElement.appendChild(body);
    return body;
  }
  set body(body) {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'BODY') {
        documentElement.childNodes[i].remove();
      }
    }
    if (body != null) {
      documentElement.appendChild(body);
      setOwnerDocument(body, this);
    }
  }
  appendChild(newNode) {
    newNode.remove();
    newNode.parentNode = this;
    this.childNodes.push(newNode);
    return newNode;
  }
  createComment(data) {
    return new MockComment(this, data);
  }
  createAttribute(attrName) {
    return new MockAttr(attrName.toLowerCase(), '');
  }
  createAttributeNS(namespaceURI, attrName) {
    return new MockAttr(attrName, '', namespaceURI);
  }
  createElement(tagName) {
    if (tagName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
      const doc = new MockDocument(false);
      doc.nodeName = tagName;
      doc.parentNode = null;
      return doc;
    }
    return createElement(this, tagName);
  }
  createElementNS(namespaceURI, tagName) {
    const elmNs = createElementNS(this, namespaceURI, tagName);
    elmNs.namespaceURI = namespaceURI;
    return elmNs;
  }
  createTextNode(text) {
    return new MockTextNode(this, text);
  }
  createDocumentFragment() {
    return new MockDocumentFragment(this);
  }
  createDocumentTypeNode() {
    return new MockDocumentTypeNode(this);
  }
  getElementById(id) {
    return getElementById(this, id);
  }
  getElementsByName(elmName) {
    return getElementsByName(this, elmName.toLowerCase());
  }
  get title() {
    const title = this.head.childNodes.find((elm) => elm.nodeName === 'TITLE');
    if (title != null && typeof title.textContent === 'string') {
      return title.textContent.trim();
    }
    return '';
  }
  set title(value) {
    const head = this.head;
    let title = head.childNodes.find((elm) => elm.nodeName === 'TITLE');
    if (title == null) {
      title = this.createElement('title');
      head.appendChild(title);
    }
    title.textContent = value;
  }
}
function createDocument(html = null) {
  return new MockWindow(html).document;
}
function createFragment(html) {
  return parseHtmlToFragment(html, null);
}
function resetDocument(doc) {
  if (doc != null) {
    resetEventListeners(doc);
    const documentElement = doc.documentElement;
    if (documentElement != null) {
      resetElement(documentElement);
      for (let i = 0, ii = documentElement.childNodes.length; i < ii; i++) {
        const childNode = documentElement.childNodes[i];
        resetElement(childNode);
        childNode.childNodes.length = 0;
      }
    }
    for (const key in doc) {
      if (doc.hasOwnProperty(key) && !DOC_KEY_KEEPERS.has(key)) {
        delete doc[key];
      }
    }
    try {
      doc.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
    }
    catch (e) { }
    try {
      doc.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
    }
    catch (e) { }
    try {
      doc.cookie = '';
    }
    catch (e) { }
    try {
      doc.referrer = '';
    }
    catch (e) { }
  }
}
const DOC_KEY_KEEPERS = new Set([
  'nodeName',
  'nodeType',
  'nodeValue',
  'ownerDocument',
  'parentNode',
  'childNodes',
  '_shadowRoot',
]);
function getElementById(elm, id) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (childElm.id === id) {
      return childElm;
    }
    const childElmFound = getElementById(childElm, id);
    if (childElmFound != null) {
      return childElmFound;
    }
  }
  return null;
}
function getElementsByName(elm, elmName, foundElms = []) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (childElm.name && childElm.name.toLowerCase() === elmName) {
      foundElms.push(childElm);
    }
    getElementsByName(childElm, elmName, foundElms);
  }
  return foundElms;
}
function setOwnerDocument(elm, ownerDocument) {
  for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
    elm.childNodes[i].ownerDocument = ownerDocument;
    if (elm.childNodes[i].nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
      setOwnerDocument(elm.childNodes[i], ownerDocument);
    }
  }
}

function hydrateFactory($stencilWindow, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve) {
  var globalThis = $stencilWindow;
  var self = $stencilWindow;
  var top = $stencilWindow;
  var parent = $stencilWindow;

  var addEventListener = $stencilWindow.addEventListener.bind($stencilWindow);
  var alert = $stencilWindow.alert.bind($stencilWindow);
  var blur = $stencilWindow.blur.bind($stencilWindow);
  var cancelAnimationFrame = $stencilWindow.cancelAnimationFrame.bind($stencilWindow);
  var cancelIdleCallback = $stencilWindow.cancelIdleCallback.bind($stencilWindow);
  var clearInterval = $stencilWindow.clearInterval.bind($stencilWindow);
  var clearTimeout = $stencilWindow.clearTimeout.bind($stencilWindow);
  var close = () => {};
  var confirm = $stencilWindow.confirm.bind($stencilWindow);
  var dispatchEvent = $stencilWindow.dispatchEvent.bind($stencilWindow);
  var focus = $stencilWindow.focus.bind($stencilWindow);
  var getComputedStyle = $stencilWindow.getComputedStyle.bind($stencilWindow);
  var matchMedia = $stencilWindow.matchMedia.bind($stencilWindow);
  var open = $stencilWindow.open.bind($stencilWindow);
  var prompt = $stencilWindow.prompt.bind($stencilWindow);
  var removeEventListener = $stencilWindow.removeEventListener.bind($stencilWindow);
  var requestAnimationFrame = $stencilWindow.requestAnimationFrame.bind($stencilWindow);
  var requestIdleCallback = $stencilWindow.requestIdleCallback.bind($stencilWindow);
  var setInterval = $stencilWindow.setInterval.bind($stencilWindow);
  var setTimeout = $stencilWindow.setTimeout.bind($stencilWindow);

  var CharacterData = $stencilWindow.CharacterData;
  var CSS = $stencilWindow.CSS;
  var CustomEvent = $stencilWindow.CustomEvent;
  var Document = $stencilWindow.Document;
  var DocumentFragment = $stencilWindow.DocumentFragment;
  var DocumentType = $stencilWindow.DocumentType;
  var DOMTokenList = $stencilWindow.DOMTokenList;
  var Element = $stencilWindow.Element;
  var Event = $stencilWindow.Event;
  var HTMLAnchorElement = $stencilWindow.HTMLAnchorElement;
  var HTMLBaseElement = $stencilWindow.HTMLBaseElement;
  var HTMLButtonElement = $stencilWindow.HTMLButtonElement;
  var HTMLCanvasElement = $stencilWindow.HTMLCanvasElement;
  var HTMLElement = $stencilWindow.HTMLElement;
  var HTMLFormElement = $stencilWindow.HTMLFormElement;
  var HTMLImageElement = $stencilWindow.HTMLImageElement;
  var HTMLInputElement = $stencilWindow.HTMLInputElement;
  var HTMLLinkElement = $stencilWindow.HTMLLinkElement;
  var HTMLMetaElement = $stencilWindow.HTMLMetaElement;
  var HTMLScriptElement = $stencilWindow.HTMLScriptElement;
  var HTMLStyleElement = $stencilWindow.HTMLStyleElement;
  var HTMLTemplateElement = $stencilWindow.HTMLTemplateElement;
  var HTMLTitleElement = $stencilWindow.HTMLTitleElement;
  var IntersectionObserver = $stencilWindow.IntersectionObserver;
  var KeyboardEvent = $stencilWindow.KeyboardEvent;
  var MouseEvent = $stencilWindow.MouseEvent;
  var Node = $stencilWindow.Node;
  var NodeList = $stencilWindow.NodeList;
  var URL = $stencilWindow.URL;

  var console = $stencilWindow.console;
  var customElements = $stencilWindow.customElements;
  var history = $stencilWindow.history;
  var localStorage = $stencilWindow.localStorage;
  var location = $stencilWindow.location;
  var navigator = $stencilWindow.navigator;
  var performance = $stencilWindow.performance;
  var sessionStorage = $stencilWindow.sessionStorage;

  var devicePixelRatio = $stencilWindow.devicePixelRatio;
  var innerHeight = $stencilWindow.innerHeight;
  var innerWidth = $stencilWindow.innerWidth;
  var origin = $stencilWindow.origin;
  var pageXOffset = $stencilWindow.pageXOffset;
  var pageYOffset = $stencilWindow.pageYOffset;
  var screen = $stencilWindow.screen;
  var screenLeft = $stencilWindow.screenLeft;
  var screenTop = $stencilWindow.screenTop;
  var screenX = $stencilWindow.screenX;
  var screenY = $stencilWindow.screenY;
  var scrollX = $stencilWindow.scrollX;
  var scrollY = $stencilWindow.scrollY;
  var exports = {};

  var fetch, FetchError, Headers, Request, Response;

  if (typeof $stencilWindow.fetch === 'function') {
  fetch = $stencilWindow.fetch;
  } else {
  fetch = $stencilWindow.fetch = function() { throw new Error('fetch() is not implemented'); };
  }

  if (typeof $stencilWindow.FetchError === 'function') {
  FetchError = $stencilWindow.FetchError;
  } else {
  FetchError = $stencilWindow.FetchError = class FetchError { constructor() { throw new Error('FetchError is not implemented'); } };
  }

  if (typeof $stencilWindow.Headers === 'function') {
  Headers = $stencilWindow.Headers;
  } else {
  Headers = $stencilWindow.Headers = class Headers { constructor() { throw new Error('Headers is not implemented'); } };
  }

  if (typeof $stencilWindow.Request === 'function') {
  Request = $stencilWindow.Request;
  } else {
  Request = $stencilWindow.Request = class Request { constructor() { throw new Error('Request is not implemented'); } };
  }

  if (typeof $stencilWindow.Response === 'function') {
  Response = $stencilWindow.Response;
  } else {
  Response = $stencilWindow.Response = class Response { constructor() { throw new Error('Response is not implemented'); } };
  }

  function hydrateAppClosure($stencilWindow) {
  const window = $stencilWindow;
  const document = $stencilWindow.document;
  /*hydrateAppClosure start*/


const NAMESPACE = 'estimtest-core';
const BUILD = /* estimtest-core */ { allRenderFn: true, appendChildSlotFix: false, asyncLoading: true, attachStyles: true, cloneNodeFix: false, cmpDidLoad: false, cmpDidRender: false, cmpDidUnload: false, cmpDidUpdate: false, cmpShouldUpdate: false, cmpWillLoad: true, cmpWillRender: false, cmpWillUpdate: false, connectedCallback: false, constructableCSS: false, cssAnnotations: true, cssVarShim: false, devTools: false, disconnectedCallback: false, dynamicImportShim: false, element: false, event: false, hasRenderFn: true, hostListener: false, hostListenerTarget: false, hostListenerTargetBody: false, hostListenerTargetDocument: false, hostListenerTargetParent: false, hostListenerTargetWindow: false, hotModuleReplacement: false, hydrateClientSide: true, hydrateServerSide: true, hydratedAttribute: false, hydratedClass: true, isDebug: false, isDev: false, isTesting: false, lazyLoad: true, lifecycle: true, lifecycleDOMEvents: false, member: true, method: true, mode: false, observeAttribute: true, profile: false, prop: true, propBoolean: true, propMutable: false, propNumber: false, propString: false, reflect: false, safari10: false, scoped: false, scriptDataOpts: false, shadowDelegatesFocus: false, shadowDom: true, shadowDomShim: true, slot: false, slotChildNodesFix: false, slotRelocation: true, state: true, style: true, svg: true, taskQueue: true, updatable: true, vdomAttribute: true, vdomClass: true, vdomFunctional: true, vdomKey: true, vdomListener: true, vdomPropOrAttr: true, vdomRef: true, vdomRender: true, vdomStyle: true, vdomText: true, vdomXlink: false, watchCallback: true };

function queryNonceMetaTagContent(e) {
 var t, o, n;
 return null !== (n = null === (o = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="csp-nonce"]')) || void 0 === o ? void 0 : o.getAttribute("content")) && void 0 !== n ? n : void 0;
}

function componentOnReady() {
 return getHostRef(this).$onReadyPromise$;
}

function forceUpdate() {}

function hydrateApp(e, t, o, n, s) {
 function l() {
  if (global.clearTimeout(p), i.clear(), r.clear(), !h) {
   h = !0;
   try {
    t.clientHydrateAnnotations && insertVdomAnnotations(e.document, t.staticComponents), 
    e.dispatchEvent(new e.Event("DOMContentLoaded")), e.document.createElement = c, 
    e.document.createElementNS = $;
   } catch (e) {
    renderCatchError(t, o, e);
   }
  }
  n(e, t, o, s);
 }
 function a(e) {
  renderCatchError(t, o, e), l();
 }
 const r = new Set, i = new Set, d = new Set, c = e.document.createElement, $ = e.document.createElementNS, m = Promise.resolve();
 let p, h = !1;
 try {
  function u() {
   return g(this);
  }
  function f(e) {
   if (isValidComponent(e, t) && !getHostRef(e)) {
    const t = loadModule({
     $tagName$: e.nodeName.toLowerCase(),
     $flags$: null
    });
    null != t && null != t.cmpMeta && (i.add(e), e.connectedCallback = u, registerHost(e, t.cmpMeta), 
    function o(e, t) {
     if ("function" != typeof e.componentOnReady && (e.componentOnReady = componentOnReady), 
     "function" != typeof e.forceUpdate && (e.forceUpdate = forceUpdate), 1 & t.$flags$ && (e.shadowRoot = e), 
     null != t.$members$) {
      const o = getHostRef(e);
      Object.entries(t.$members$).forEach((([n, s]) => {
       const l = s[0];
       if (31 & l) {
        const a = s[1] || n, r = e.getAttribute(a);
        if (null != r) {
         const e = parsePropertyValue(r, l);
         o.$instanceValues$.set(n, e);
        }
        const i = e[n];
        void 0 !== i && (o.$instanceValues$.set(n, i), delete e[n]), Object.defineProperty(e, n, {
         get() {
          return getValue(this, n);
         },
         set(e) {
          setValue(this, n, e, t);
         },
         configurable: !0,
         enumerable: !0
        });
       } else 64 & l && Object.defineProperty(e, n, {
        value(...e) {
         const t = getHostRef(this);
         return t.$onInstancePromise$.then((() => t.$lazyInstance$[n](...e))).catch(consoleError);
        }
       });
      }));
     }
    }(e, t.cmpMeta));
   }
  }
  function g(n) {
   return i.delete(n), isValidComponent(n, t) && o.hydratedCount < t.maxHydrateCount && !r.has(n) && shouldHydrate(n) ? (r.add(n), 
   async function s(e, t, o, n, l) {
    o = o.toLowerCase();
    const a = loadModule({
     $tagName$: o,
     $flags$: null
    });
    if (null != a && null != a.cmpMeta) {
     l.add(n);
     try {
      connectedCallback(n), await n.componentOnReady(), t.hydratedCount++;
      const e = getHostRef(n), s = e.$modeName$ ? e.$modeName$ : "$";
      t.components.some((e => e.tag === o && e.mode === s)) || t.components.push({
       tag: o,
       mode: s,
       count: 0,
       depth: -1
      });
     } catch (t) {
      e.console.error(t);
     }
     l.delete(n);
    }
   }(e, o, n.nodeName, n, d)) : m;
  }
  e.document.createElement = function t(o) {
   const n = c.call(e.document, o);
   return f(n), n;
  }, e.document.createElementNS = function t(o, n) {
   const s = $.call(e.document, o, n);
   return f(s), s;
  }, p = global.setTimeout((function L() {
   a(`Hydrate exceeded timeout${function e(t) {
    return Array.from(t).map(waitingOnElementMsg);
   }(d)}`);
  }), t.timeout), plt.$resourcesUrl$ = new URL(t.resourcesUrl || "./", doc.baseURI).href, 
  function e(t) {
   if (null != t && 1 === t.nodeType) {
    f(t);
    const o = t.children;
    for (let t = 0, n = o.length; t < n; t++) e(o[t]);
   }
  }(e.document.body), function e() {
   const t = Array.from(i).filter((e => e.parentElement));
   return t.length > 0 ? Promise.all(t.map(g)).then(e) : m;
  }().then(l).catch(a);
 } catch (y) {
  a(y);
 }
}

function isValidComponent(e, t) {
 if (null != e && 1 === e.nodeType) {
  const o = e.nodeName;
  if ("string" == typeof o && o.includes("-")) return !t.excludeComponents.includes(o.toLowerCase());
 }
 return !1;
}

function shouldHydrate(e) {
 if (9 === e.nodeType) return !0;
 if (NO_HYDRATE_TAGS.has(e.nodeName)) return !1;
 if (e.hasAttribute("no-prerender")) return !1;
 const t = e.parentNode;
 return null == t || shouldHydrate(t);
}

function renderCatchError(e, t, o) {
 const n = {
  level: "error",
  type: "build",
  header: "Hydrate Error",
  messageText: "",
  relFilePath: null,
  absFilePath: null,
  lines: []
 };
 if (e.url) try {
  const t = new URL(e.url);
  "/" !== t.pathname && (n.header += ": " + t.pathname);
 } catch (e) {}
 null != o && (null != o.stack ? n.messageText = o.stack.toString() : null != o.message ? n.messageText = o.message.toString() : n.messageText = o.toString()), 
 t.diagnostics.push(n);
}

function printTag(e) {
 let t = `<${e.nodeName.toLowerCase()}`;
 if (Array.isArray(e.attributes)) for (let o = 0; o < e.attributes.length; o++) {
  const n = e.attributes[o];
  t += ` ${n.name}`, "" !== n.value && (t += `="${n.value}"`);
 }
 return t += ">", t;
}

function waitingOnElementMsg(e) {
 let t = "";
 if (e) {
  const o = [];
  t = " - waiting on:";
  let n = e;
  for (;n && 9 !== n.nodeType && "BODY" !== n.nodeName; ) o.unshift(printTag(n)), 
  n = n.parentElement;
  let s = "";
  for (const e of o) s += "  ", t += `\n${s}${e}`;
 }
 return t;
}

const createTime = (e, t = "") => {
 return () => {};
}, EMPTY_OBJ = {}, isComplexType = e => "object" == (e = typeof e) || "function" === e, isPromise = e => !!e && ("object" == typeof e || "function" == typeof e) && "function" == typeof e.then, h = (e, t, ...o) => {
 let n = null, s = null, l = null, a = !1, r = !1;
 const i = [], d = t => {
  for (let o = 0; o < t.length; o++) n = t[o], Array.isArray(n) ? d(n) : null != n && "boolean" != typeof n && ((a = "function" != typeof e && !isComplexType(n)) ? n = String(n) : BUILD.isDev  , 
  a && r ? i[i.length - 1].$text$ += n : i.push(a ? newVNode(null, n) : n), r = a);
 };
 if (d(o), t && (t.key && (s = t.key), 
 t.name && (l = t.name), BUILD.vdomClass)) {
  const e = t.className || t.class;
  e && (t.class = "object" != typeof e ? e : Object.keys(e).filter((t => e[t])).join(" "));
 }
 if ("function" == typeof e) return e(null === t ? {} : t, i, vdomFnUtils);
 const c = newVNode(e, null);
 return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), (c.$key$ = s), 
 (c.$name$ = l), c;
}, newVNode = (e, t) => {
 const o = {
  $flags$: 0,
  $tag$: e,
  $text$: t,
  $elm$: null,
  $children$: null
 };
 return (o.$attrs$ = null), (o.$key$ = null), 
 (o.$name$ = null), o;
}, Host = {}, isHost = e => e && e.$tag$ === Host, vdomFnUtils = {
 forEach: (e, t) => e.map(convertToPublic).forEach(t),
 map: (e, t) => e.map(convertToPublic).map(t).map(convertToPrivate)
}, convertToPublic = e => ({
 vattrs: e.$attrs$,
 vchildren: e.$children$,
 vkey: e.$key$,
 vname: e.$name$,
 vtag: e.$tag$,
 vtext: e.$text$
}), convertToPrivate = e => {
 if ("function" == typeof e.vtag) {
  const t = {
   ...e.vattrs
  };
  return e.vkey && (t.key = e.vkey), e.vname && (t.name = e.vname), h(e.vtag, t, ...e.vchildren || []);
 }
 const t = newVNode(e.vtag, e.vtext);
 return t.$attrs$ = e.vattrs, t.$children$ = e.vchildren, t.$key$ = e.vkey, t.$name$ = e.vname, 
 t;
}, clientHydrate = (e, t, o, n, s, l, a) => {
 let r, i, d, c;
 if (1 === l.nodeType) {
  for (r = l.getAttribute("c-id"), r && (i = r.split("."), i[0] !== a && "0" !== i[0] || (d = {
   $flags$: 0,
   $hostId$: i[0],
   $nodeId$: i[1],
   $depth$: i[2],
   $index$: i[3],
   $tag$: l.tagName.toLowerCase(),
   $elm$: l,
   $attrs$: null,
   $children$: null,
   $key$: null,
   $name$: null,
   $text$: null
  }, t.push(d), l.removeAttribute("c-id"), e.$children$ || (e.$children$ = []), e.$children$[d.$index$] = d, 
  e = d, n && "0" === d.$depth$ && (n[d.$index$] = d.$elm$))), c = l.childNodes.length - 1; c >= 0; c--) clientHydrate(e, t, o, n, s, l.childNodes[c], a);
  if (l.shadowRoot) for (c = l.shadowRoot.childNodes.length - 1; c >= 0; c--) clientHydrate(e, t, o, n, s, l.shadowRoot.childNodes[c], a);
 } else if (8 === l.nodeType) i = l.nodeValue.split("."), i[1] !== a && "0" !== i[1] || (r = i[0], 
 d = {
  $flags$: 0,
  $hostId$: i[1],
  $nodeId$: i[2],
  $depth$: i[3],
  $index$: i[4],
  $elm$: l,
  $attrs$: null,
  $children$: null,
  $key$: null,
  $name$: null,
  $tag$: null,
  $text$: null
 }, "t" === r ? (d.$elm$ = l.nextSibling, d.$elm$ && 3 === d.$elm$.nodeType && (d.$text$ = d.$elm$.textContent, 
 t.push(d), l.remove(), e.$children$ || (e.$children$ = []), e.$children$[d.$index$] = d, 
 n && "0" === d.$depth$ && (n[d.$index$] = d.$elm$))) : d.$hostId$ === a && ("s" === r ? (d.$tag$ = "slot", 
 i[5] ? l["s-sn"] = d.$name$ = i[5] : l["s-sn"] = "", l["s-sr"] = !0, n && (d.$elm$ = doc.createElement(d.$tag$), 
 d.$name$ && d.$elm$.setAttribute("name", d.$name$), l.parentNode.insertBefore(d.$elm$, l), 
 l.remove(), "0" === d.$depth$ && (n[d.$index$] = d.$elm$)), o.push(d), e.$children$ || (e.$children$ = []), 
 e.$children$[d.$index$] = d) : "r" === r && (n ? l.remove() : (s["s-cr"] = l, 
 l["s-cn"] = !0)))); else if (e && "style" === e.$tag$) {
  const t = newVNode(null, l.textContent);
  t.$elm$ = l, t.$index$ = "0", e.$children$ = [ t ];
 }
}, initializeDocumentHydrate = (e, t) => {
 if (1 === e.nodeType) {
  let o = 0;
  for (;o < e.childNodes.length; o++) initializeDocumentHydrate(e.childNodes[o], t);
  if (e.shadowRoot) for (o = 0; o < e.shadowRoot.childNodes.length; o++) initializeDocumentHydrate(e.shadowRoot.childNodes[o], t);
 } else if (8 === e.nodeType) {
  const o = e.nodeValue.split(".");
  "o" === o[0] && (t.set(o[1] + "." + o[2], e), e.nodeValue = "", e["s-en"] = o[3]);
 }
}, parsePropertyValue = (e, t) => null == e || isComplexType(e) ? e : 4 & t ? "false" !== e && ("" === e || !!e) : e, getElement = e => getHostRef(e).$hostElement$ , emitEvent = (e, t, o) => {
 const n = plt.ce(t, o);
 return e.dispatchEvent(n), n;
}, rootAppliedStyles = new WeakMap, registerStyle = (e, t, o) => {
 let n = styles.get(e);
 n = t, styles.set(e, n);
}, addStyle = (e, t, o, n) => {
 var s;
 let l = getScopeId(t);
 const a = styles.get(l);
 if (e = 11 === e.nodeType ? e : doc, a) if ("string" == typeof a) {
  e = e.head || e;
  let o, r = rootAppliedStyles.get(e);
  if (r || rootAppliedStyles.set(e, r = new Set), !r.has(l)) {
   if (e.host && (o = e.querySelector(`[sty-id="${l}"]`))) o.innerHTML = a; else {
    o = doc.createElement("style"), o.innerHTML = a;
    const i = null !== (s = plt.$nonce$) && void 0 !== s ? s : queryNonceMetaTagContent(doc);
    null != i && o.setAttribute("nonce", i), o.setAttribute("sty-id", l), 
    e.insertBefore(o, e.querySelector("link"));
   }
   r && r.add(l);
  }
 }
 return l;
}, attachStyles = e => {
 const t = e.$cmpMeta$, o = e.$hostElement$, n = t.$flags$, s = createTime("attachStyles", t.$tagName$), l = addStyle(o.getRootNode(), t);
 10 & n && (o["s-sc"] = l, 
 o.classList.add(l + "-h"), BUILD.scoped  ), 
 s();
}, getScopeId = (e, t) => "sc-" + (e.$tagName$), setAccessor = (e, t, o, n, s, l) => {
 if (o !== n) {
  let a = isMemberInElement(e, t), r = t.toLowerCase();
  if ("class" === t) {
   const t = e.classList, s = parseClassList(o), l = parseClassList(n);
   t.remove(...s.filter((e => e && !l.includes(e)))), t.add(...l.filter((e => e && !s.includes(e))));
  } else if ("style" === t) {
   for (const t in o) n && null != n[t] || (e.style[t] = "");
   for (const t in n) o && n[t] === o[t] || (e.style[t] = n[t]);
  } else if ("key" === t) ; else if ("ref" === t) n && n(e); else if ((a ) || "o" !== t[0] || "n" !== t[1]) {
   {
    const i = isComplexType(n);
    if ((a || i && null !== n) && !s) try {
     if (e.tagName.includes("-")) e[t] = n; else {
      const s = null == n ? "" : n;
      "list" === t ? a = !1 : null != o && e[t] == s || (e[t] = s);
     }
    } catch (e) {}
    null == n || !1 === n ? !1 === n && "" !== e.getAttribute(t) || (e.removeAttribute(t)) : (!a || 4 & l || s) && !i && (n = !0 === n ? "" : n, 
    e.setAttribute(t, n));
   }
  } else t = "-" === t[2] ? t.slice(3) : isMemberInElement(win, r) ? r.slice(2) : r[2] + t.slice(3), 
  o && plt.rel(e, t, o, !1), n && plt.ael(e, t, n, !1);
 }
}, parseClassListRegex = /\s/, parseClassList = e => e ? e.split(parseClassListRegex) : [], updateElement = (e, t, o, n) => {
 const s = 11 === t.$elm$.nodeType && t.$elm$.host ? t.$elm$.host : t.$elm$, l = e && e.$attrs$ || EMPTY_OBJ, a = t.$attrs$ || EMPTY_OBJ;
 for (n in l) n in a || setAccessor(s, n, l[n], void 0, o, t.$flags$);
 for (n in a) setAccessor(s, n, l[n], a[n], o, t.$flags$);
};

let scopeId, contentRef, hostTagName, useNativeShadowDom = !1, checkSlotFallbackVisibility = !1, checkSlotRelocate = !1, isSvgMode = !1;

const createElm = (e, t, o, n) => {
 const s = t.$children$[o];
 let l, a, r, i = 0;
 if (!useNativeShadowDom && (checkSlotRelocate = !0, "slot" === s.$tag$ && (scopeId && n.classList.add(scopeId + "-s"), 
 s.$flags$ |= s.$children$ ? 2 : 1)), null !== s.$text$) l = s.$elm$ = doc.createTextNode(s.$text$); else if (1 & s.$flags$) l = s.$elm$ = slotReferenceDebugNode(s) ; else {
  if (!isSvgMode && (isSvgMode = "svg" === s.$tag$), l = s.$elm$ = doc.createElementNS(isSvgMode ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml", 2 & s.$flags$ ? "slot-fb" : s.$tag$) , 
  isSvgMode && "foreignObject" === s.$tag$ && (isSvgMode = !1), updateElement(null, s, isSvgMode), 
  null != scopeId && l["s-si"] !== scopeId && l.classList.add(l["s-si"] = scopeId), 
  s.$children$) for (i = 0; i < s.$children$.length; ++i) a = createElm(e, s, i, l), 
  a && l.appendChild(a);
  ("svg" === s.$tag$ ? isSvgMode = !1 : "foreignObject" === l.tagName && (isSvgMode = !0));
 }
 return (l["s-hn"] = hostTagName, 3 & s.$flags$ && (l["s-sr"] = !0, 
 l["s-cr"] = contentRef, l["s-sn"] = s.$name$ || "", r = e && e.$children$ && e.$children$[o], 
 r && r.$tag$ === s.$tag$ && e.$elm$ && putBackInOriginalLocation(e.$elm$, !1))), 
 l;
}, putBackInOriginalLocation = (e, t) => {
 plt.$flags$ |= 1;
 const o = e.childNodes;
 for (let e = o.length - 1; e >= 0; e--) {
  const n = o[e];
  n["s-hn"] !== hostTagName && n["s-ol"] && (parentReferenceNode(n).insertBefore(n, referenceNode(n)), 
  n["s-ol"].remove(), n["s-ol"] = void 0, checkSlotRelocate = !0), t && putBackInOriginalLocation(n, t);
 }
 plt.$flags$ &= -2;
}, addVnodes = (e, t, o, n, s, l) => {
 let a, r = e["s-cr"] && e["s-cr"].parentNode || e;
 for (r.shadowRoot && r.tagName === hostTagName && (r = r.shadowRoot); s <= l; ++s) n[s] && (a = createElm(null, o, s, e), 
 a && (n[s].$elm$ = a, r.insertBefore(a, referenceNode(t) )));
}, removeVnodes = (e, t, o, n, s) => {
 for (;t <= o; ++t) (n = e[t]) && (s = n.$elm$, callNodeRefs(n), (checkSlotFallbackVisibility = !0, 
 s["s-ol"] ? s["s-ol"].remove() : putBackInOriginalLocation(s, !0)), s.remove());
}, isSameVnode = (e, t) => e.$tag$ === t.$tag$ && ("slot" === e.$tag$ ? e.$name$ === t.$name$ : e.$key$ === t.$key$), referenceNode = e => e && e["s-ol"] || e, parentReferenceNode = e => (e["s-ol"] ? e["s-ol"] : e).parentNode, patch = (e, t) => {
 const o = t.$elm$ = e.$elm$, n = e.$children$, s = t.$children$, l = t.$tag$, a = t.$text$;
 let r;
 null !== a ? (r = o["s-cr"]) ? r.parentNode.textContent = a : e.$text$ !== a && (o.data = a) : ((isSvgMode = "svg" === l || "foreignObject" !== l && isSvgMode), 
 (updateElement(e, t, isSvgMode)), 
 null !== n && null !== s ? ((e, t, o, n) => {
  let s, l, a = 0, r = 0, i = 0, d = 0, c = t.length - 1, $ = t[0], m = t[c], p = n.length - 1, h = n[0], u = n[p];
  for (;a <= c && r <= p; ) if (null == $) $ = t[++a]; else if (null == m) m = t[--c]; else if (null == h) h = n[++r]; else if (null == u) u = n[--p]; else if (isSameVnode($, h)) patch($, h), 
  $ = t[++a], h = n[++r]; else if (isSameVnode(m, u)) patch(m, u), m = t[--c], u = n[--p]; else if (isSameVnode($, u)) "slot" !== $.$tag$ && "slot" !== u.$tag$ || putBackInOriginalLocation($.$elm$.parentNode, !1), 
  patch($, u), e.insertBefore($.$elm$, m.$elm$.nextSibling), $ = t[++a], u = n[--p]; else if (isSameVnode(m, h)) "slot" !== $.$tag$ && "slot" !== u.$tag$ || putBackInOriginalLocation(m.$elm$.parentNode, !1), 
  patch(m, h), e.insertBefore(m.$elm$, $.$elm$), m = t[--c], h = n[++r]; else {
   if (i = -1, BUILD.vdomKey) for (d = a; d <= c; ++d) if (t[d] && null !== t[d].$key$ && t[d].$key$ === h.$key$) {
    i = d;
    break;
   }
   i >= 0 ? (l = t[i], l.$tag$ !== h.$tag$ ? s = createElm(t && t[r], o, i, e) : (patch(l, h), 
   t[i] = void 0, s = l.$elm$), h = n[++r]) : (s = createElm(t && t[r], o, r, e), h = n[++r]), 
   s && (parentReferenceNode($.$elm$).insertBefore(s, referenceNode($.$elm$)) );
  }
  a > c ? addVnodes(e, null == n[p + 1] ? null : n[p + 1].$elm$, o, n, r, p) : r > p && removeVnodes(t, a, c);
 })(o, n, t, s) : null !== s ? (null !== e.$text$ && (o.textContent = ""), 
 addVnodes(o, null, t, s, 0, s.length - 1)) : null !== n && removeVnodes(n, 0, n.length - 1), 
 isSvgMode && "svg" === l && (isSvgMode = !1));
}, updateFallbackSlotVisibility = e => {
 const t = e.childNodes;
 let o, n, s, l, a, r;
 for (n = 0, s = t.length; n < s; n++) if (o = t[n], 1 === o.nodeType) {
  if (o["s-sr"]) for (a = o["s-sn"], o.hidden = !1, l = 0; l < s; l++) if (r = t[l].nodeType, 
  t[l]["s-hn"] !== o["s-hn"] || "" !== a) {
   if (1 === r && a === t[l].getAttribute("slot")) {
    o.hidden = !0;
    break;
   }
  } else if (1 === r || 3 === r && "" !== t[l].textContent.trim()) {
   o.hidden = !0;
   break;
  }
  updateFallbackSlotVisibility(o);
 }
}, relocateNodes = [], relocateSlotContent = e => {
 let t, o, n, s, l, a, r = 0;
 const i = e.childNodes, d = i.length;
 for (;r < d; r++) {
  if (t = i[r], t["s-sr"] && (o = t["s-cr"]) && o.parentNode) for (n = o.parentNode.childNodes, 
  s = t["s-sn"], a = n.length - 1; a >= 0; a--) o = n[a], o["s-cn"] || o["s-nr"] || o["s-hn"] === t["s-hn"] || (isNodeLocatedInSlot(o, s) ? (l = relocateNodes.find((e => e.$nodeToRelocate$ === o)), 
  checkSlotFallbackVisibility = !0, o["s-sn"] = o["s-sn"] || s, l ? l.$slotRefNode$ = t : relocateNodes.push({
   $slotRefNode$: t,
   $nodeToRelocate$: o
  }), o["s-sr"] && relocateNodes.map((e => {
   isNodeLocatedInSlot(e.$nodeToRelocate$, o["s-sn"]) && (l = relocateNodes.find((e => e.$nodeToRelocate$ === o)), 
   l && !e.$slotRefNode$ && (e.$slotRefNode$ = l.$slotRefNode$));
  }))) : relocateNodes.some((e => e.$nodeToRelocate$ === o)) || relocateNodes.push({
   $nodeToRelocate$: o
  }));
  1 === t.nodeType && relocateSlotContent(t);
 }
}, isNodeLocatedInSlot = (e, t) => 1 === e.nodeType ? null === e.getAttribute("slot") && "" === t || e.getAttribute("slot") === t : e["s-sn"] === t || "" === t, callNodeRefs = e => {
 (e.$attrs$ && e.$attrs$.ref && e.$attrs$.ref(null), e.$children$ && e.$children$.map(callNodeRefs));
}, renderVdom = (e, t) => {
 const o = e.$hostElement$, s = e.$vnode$ || newVNode(null, null), l = isHost(t) ? t : h(null, null, t);
 if (hostTagName = o.tagName, BUILD.isDev  ) ;
 if (l.$tag$ = null, l.$flags$ |= 4, e.$vnode$ = l, l.$elm$ = s.$elm$ = o.shadowRoot || o, 
 (scopeId = o["s-sc"]), (contentRef = o["s-cr"], 
 useNativeShadowDom = supportsShadow, checkSlotFallbackVisibility = !1), patch(s, l), 
 BUILD.slotRelocation) {
  if (plt.$flags$ |= 1, checkSlotRelocate) {
   let e, t, o, n, s, a;
   relocateSlotContent(l.$elm$);
   let r = 0;
   for (;r < relocateNodes.length; r++) e = relocateNodes[r], t = e.$nodeToRelocate$, 
   t["s-ol"] || (o = originalLocationDebugNode(t) , 
   o["s-nr"] = t, t.parentNode.insertBefore(t["s-ol"] = o, t));
   for (r = 0; r < relocateNodes.length; r++) if (e = relocateNodes[r], t = e.$nodeToRelocate$, 
   e.$slotRefNode$) {
    for (n = e.$slotRefNode$.parentNode, s = e.$slotRefNode$.nextSibling, o = t["s-ol"]; o = o.previousSibling; ) if (a = o["s-nr"], 
    a && a["s-sn"] === t["s-sn"] && n === a.parentNode && (a = a.nextSibling, !a || !a["s-nr"])) {
     s = a;
     break;
    }
    (!s && n !== t.parentNode || t.nextSibling !== s) && t !== s && (!t["s-hn"] && t["s-ol"] && (t["s-hn"] = t["s-ol"].parentNode.nodeName), 
    n.insertBefore(t, s));
   } else 1 === t.nodeType && (t.hidden = !0);
  }
  checkSlotFallbackVisibility && updateFallbackSlotVisibility(l.$elm$), plt.$flags$ &= -2, 
  relocateNodes.length = 0;
 }
}, slotReferenceDebugNode = e => doc.createComment(`<slot${e.$name$ ? ' name="' + e.$name$ + '"' : ""}> (host=${hostTagName.toLowerCase()})`), originalLocationDebugNode = e => doc.createComment("org-location for " + (e.localName ? `<${e.localName}> (host=${e["s-hn"]})` : `[${e.textContent}]`)), attachToAncestor = (e, t) => {
 t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((t => e.$onRenderResolve$ = t)));
}, scheduleUpdate = (e, t) => {
 if ((e.$flags$ |= 16), 4 & e.$flags$) return void (e.$flags$ |= 512);
 attachToAncestor(e, e.$ancestorComponent$);
 const o = () => dispatchHooks(e, t);
 return writeTask(o) ;
}, dispatchHooks = (e, t) => {
 const n = createTime("scheduleUpdate", e.$cmpMeta$.$tagName$), s = e.$lazyInstance$ ;
 let l;
 return t ? ((l = safeCall(s, "componentWillLoad"))) : (BUILD.cmpWillUpdate ), n(), then(l, (() => updateComponent(e, s, t)));
}, updateComponent = async (e, t, o) => {
 const n = e.$hostElement$, s = createTime("update", e.$cmpMeta$.$tagName$), l = n["s-rc"];
 o && attachStyles(e);
 const a = createTime("render", e.$cmpMeta$.$tagName$);
 if (await callRender(e, t) , 
 BUILD.hydrateServerSide) try {
  serverSideConnected(n), o && (1 & e.$cmpMeta$.$flags$ ? n["s-en"] = "" : 2 & e.$cmpMeta$.$flags$ && (n["s-en"] = "c"));
 } catch (e) {
  consoleError(e, n);
 }
 if (l && (l.map((e => e())), n["s-rc"] = void 0), a(), s(), 
 BUILD.asyncLoading) {
  const t = n["s-p"], o = () => postUpdateComponent(e);
  0 === t.length ? o() : (Promise.all(t).then(o), e.$flags$ |= 4, t.length = 0);
 }
};

const callRender = (e, t, o) => {
 try {
  if (t = t.render(), (e.$flags$ &= -17), 
  (e.$flags$ |= 2), BUILD.hasRenderFn ) {
   return Promise.resolve(t).then((t => renderVdom(e, t)));
  }
 } catch (t) {
  consoleError(t, e.$hostElement$);
 }
 return null;
}, postUpdateComponent = e => {
 const t = e.$cmpMeta$.$tagName$, o = e.$hostElement$, n = createTime("postUpdate", t), l = e.$ancestorComponent$;
 64 & e.$flags$ ? (n()) : (e.$flags$ |= 64, addHydratedFlag(o), 
 n(), (e.$onReadyResolve$(o), l || appDidLoad())), e.$onInstanceResolve$(o), (e.$onRenderResolve$ && (e.$onRenderResolve$(), 
 e.$onRenderResolve$ = void 0), 512 & e.$flags$ && nextTick((() => scheduleUpdate(e, !1))), 
 e.$flags$ &= -517);
}, appDidLoad = e => {
 addHydratedFlag(doc.documentElement), nextTick((() => emitEvent(win, "appload", {
  detail: {
   namespace: NAMESPACE
  }
 }))), BUILD.profile  ;
}, safeCall = (e, t, o) => {
 if (e && e[t]) try {
  return e[t](o);
 } catch (e) {
  consoleError(e);
 }
}, then = (e, t) => e && e.then ? e.then(t) : t(), addHydratedFlag = e => e.classList.add("hydrated") , serverSideConnected = e => {
 const t = e.children;
 if (null != t) for (let e = 0, o = t.length; e < o; e++) {
  const o = t[e];
  "function" == typeof o.connectedCallback && o.connectedCallback(), serverSideConnected(o);
 }
}, getValue = (e, t) => getHostRef(e).$instanceValues$.get(t), setValue = (e, t, o, n) => {
 const s = getHostRef(e), l = s.$hostElement$ , a = s.$instanceValues$.get(t), r = s.$flags$, i = s.$lazyInstance$ ;
 o = parsePropertyValue(o, n.$members$[t][0]);
 const d = Number.isNaN(a) && Number.isNaN(o), c = o !== a && !d;
 if ((!(8 & r) || void 0 === a) && c && (s.$instanceValues$.set(t, o), 
 i)) {
  if (n.$watchers$ && 128 & r) {
   const e = n.$watchers$[t];
   e && e.map((e => {
    try {
     i[e](o, a, t);
    } catch (e) {
     consoleError(e, l);
    }
   }));
  }
  if (2 == (18 & r)) {
   scheduleUpdate(s, !1);
  }
 }
}, proxyComponent = (e, t, o) => {
 if (t.$members$) {
  e.watchers && (t.$watchers$ = e.watchers);
  const n = Object.entries(t.$members$), s = e.prototype;
  if (n.map((([e, [n]]) => {
   (31 & n || (2 & o) && 32 & n) ? Object.defineProperty(s, e, {
    get() {
     return getValue(this, e);
    },
    set(s) {
     setValue(this, e, s, t);
    },
    configurable: !0,
    enumerable: !0
   }) : 1 & o && 64 & n && Object.defineProperty(s, e, {
    value(...t) {
     const o = getHostRef(this);
     return o.$onInstancePromise$.then((() => o.$lazyInstance$[e](...t)));
    }
   });
  })), (1 & o)) {
   const o = new Map;
   s.attributeChangedCallback = function(e, t, n) {
    plt.jmp((() => {
     const t = o.get(e);
     if (this.hasOwnProperty(t)) n = this[t], delete this[t]; else if (s.hasOwnProperty(t) && "number" == typeof this[t] && this[t] == n) return;
     this[t] = (null !== n || "boolean" != typeof this[t]) && n;
    }));
   }, e.observedAttributes = n.filter((([e, t]) => 15 & t[0])).map((([e, n]) => {
    const s = n[1] || e;
    return o.set(s, e), s;
   }));
  }
 }
 return e;
}, initializeComponent = async (e, t, o, n, s) => {
 if (0 == (32 & t.$flags$)) {
  {
   if (t.$flags$ |= 32, (s = loadModule(o)).then) {
    const e = (() => {});
    s = await s, e();
   }
   !s.isProxied && ((o.$watchers$ = s.watchers), 
   proxyComponent(s, o, 2), s.isProxied = !0);
   const e = createTime("createInstance", o.$tagName$);
   (t.$flags$ |= 8);
   try {
    new s(t);
   } catch (e) {
    consoleError(e);
   }
   (t.$flags$ &= -9), (t.$flags$ |= 128), e(), 
   fireConnectedCallback();
  }
  if (s.style) {
   let n = s.style;
   const l = getScopeId(o);
   if (!styles.has(l)) {
    const e = createTime("registerStyles", o.$tagName$);
    registerStyle(l, n), e();
   }
  }
 }
 const r = t.$ancestorComponent$, i = () => scheduleUpdate(t, !0);
 r && r["s-rc"] ? r["s-rc"].push(i) : i();
}, fireConnectedCallback = e => {
}, connectedCallback = e => {
 if (0 == (1 & plt.$flags$)) {
  const t = getHostRef(e), o = t.$cmpMeta$, n = createTime("connectedCallback", o.$tagName$);
  if (1 & t.$flags$) ; else {
   let n;
   if (t.$flags$ |= 1, (n = e.getAttribute("s-id"), n)) {
    ((e, t, o, n) => {
     const s = createTime("hydrateClient", t), l = e.shadowRoot, a = [], r = l ? [] : null, i = n.$vnode$ = newVNode(t, null);
     plt.$orgLocNodes$ || initializeDocumentHydrate(doc.body, plt.$orgLocNodes$ = new Map), 
     e["s-id"] = o, e.removeAttribute("s-id"), clientHydrate(i, a, [], r, e, e, o), a.map((e => {
      const o = e.$hostId$ + "." + e.$nodeId$, n = plt.$orgLocNodes$.get(o), s = e.$elm$;
      n && supportsShadow && "" === n["s-en"] && n.parentNode.insertBefore(s, n.nextSibling), 
      l || (s["s-hn"] = t, n && (s["s-ol"] = n, s["s-ol"]["s-nr"] = s)), plt.$orgLocNodes$.delete(o);
     })), l && r.map((e => {
      e && l.appendChild(e);
     })), s();
    })(e, o.$tagName$, n, t);
   }
   if (!n && (BUILD.hydrateServerSide ) && setContentReference(e), 
   BUILD.asyncLoading) {
    let o = e;
    for (;o = o.parentNode || o.host; ) if (1 === o.nodeType && o.hasAttribute("s-id") && o["s-p"] || o["s-p"]) {
     attachToAncestor(t, t.$ancestorComponent$ = o);
     break;
    }
   }
   initializeComponent(e, t, o);
  }
  n();
 }
}, setContentReference = e => {
 const t = e["s-cr"] = doc.createComment("");
 t["s-cn"] = !0, e.insertBefore(t, e.firstChild);
}, Fragment = (e, t) => t, insertVdomAnnotations = (e, t) => {
 if (null != e) {
  const o = {
   hostIds: 0,
   rootLevelIds: 0,
   staticComponents: new Set(t)
  }, n = [];
  parseVNodeAnnotations(e, e.body, o, n), n.forEach((t => {
   if (null != t) {
    const n = t["s-nr"];
    let s = n["s-host-id"], l = n["s-node-id"], a = `${s}.${l}`;
    if (null == s) if (s = 0, o.rootLevelIds++, l = o.rootLevelIds, a = `${s}.${l}`, 
    1 === n.nodeType) n.setAttribute("c-id", a); else if (3 === n.nodeType) {
     if (0 === s && "" === n.nodeValue.trim()) return void t.remove();
     const o = e.createComment(a);
     o.nodeValue = `t.${a}`, n.parentNode.insertBefore(o, n);
    }
    let r = `o.${a}`;
    const i = t.parentElement;
    i && ("" === i["s-en"] ? r += "." : "c" === i["s-en"] && (r += ".c")), t.nodeValue = r;
   }
  }));
 }
}, parseVNodeAnnotations = (e, t, o, n) => {
 null != t && (null != t["s-nr"] && n.push(t), 1 === t.nodeType && t.childNodes.forEach((t => {
  const s = getHostRef(t);
  if (null != s && !o.staticComponents.has(t.nodeName.toLowerCase())) {
   const n = {
    nodeIds: 0
   };
   insertVNodeAnnotations(e, t, s.$vnode$, o, n);
  }
  parseVNodeAnnotations(e, t, o, n);
 })));
}, insertVNodeAnnotations = (e, t, o, n, s) => {
 if (null != o) {
  const l = ++n.hostIds;
  if (t.setAttribute("s-id", l), null != t["s-cr"] && (t["s-cr"].nodeValue = `r.${l}`), 
  null != o.$children$) {
   const t = 0;
   o.$children$.forEach(((o, n) => {
    insertChildVNodeAnnotations(e, o, s, l, t, n);
   }));
  }
  if (t && o && o.$elm$ && !t.hasAttribute("c-id")) {
   const e = t.parentElement;
   if (e && e.childNodes) {
    const n = Array.from(e.childNodes), s = n.find((e => 8 === e.nodeType && e["s-sr"]));
    if (s) {
     const e = n.indexOf(t) - 1;
     o.$elm$.setAttribute("c-id", `${s["s-host-id"]}.${s["s-node-id"]}.0.${e}`);
    }
   }
  }
 }
}, insertChildVNodeAnnotations = (e, t, o, n, s, l) => {
 const a = t.$elm$;
 if (null == a) return;
 const r = o.nodeIds++, i = `${n}.${r}.${s}.${l}`;
 if (a["s-host-id"] = n, a["s-node-id"] = r, 1 === a.nodeType) a.setAttribute("c-id", i); else if (3 === a.nodeType) {
  const t = a.parentNode, o = t.nodeName;
  if ("STYLE" !== o && "SCRIPT" !== o) {
   const o = `t.${i}`, n = e.createComment(o);
   t.insertBefore(n, a);
  }
 } else if (8 === a.nodeType && a["s-sr"]) {
  const e = `s.${i}.${a["s-sn"] || ""}`;
  a.nodeValue = e;
 }
 if (null != t.$children$) {
  const l = s + 1;
  t.$children$.forEach(((t, s) => {
   insertChildVNodeAnnotations(e, t, o, n, l, s);
  }));
 }
}, hAsync = (e, t, ...o) => {
 if (Array.isArray(o) && o.length > 0) {
  const n = o.flat(1 / 0);
  return n.some(isPromise) ? Promise.all(n).then((o => h(e, t, ...o))).catch((o => h(e, t))) : h(e, t, ...o);
 }
 return h(e, t);
}, NO_HYDRATE_TAGS = new Set([ "CODE", "HEAD", "IFRAME", "INPUT", "OBJECT", "OUTPUT", "NOSCRIPT", "PRE", "SCRIPT", "SELECT", "STYLE", "TEMPLATE", "TEXTAREA" ]);

const cmpModules = new Map, getModule = e => {
 if ("string" == typeof e) {
  e = e.toLowerCase();
  const t = cmpModules.get(e);
  if (null != t) return t[e];
 }
 return null;
}, loadModule = (e, t, o) => getModule(e.$tagName$), isMemberInElement = (e, t) => {
 if (null != e) {
  if (t in e) return !0;
  const o = getModule(e.nodeName);
  if (null != o) {
   const e = o;
   if (null != e && null != e.cmpMeta && null != e.cmpMeta.$members$) return t in e.cmpMeta.$members$;
  }
 }
 return !1;
}, registerComponents = e => {
 for (const t of e) {
  const e = t.cmpMeta.$tagName$;
  cmpModules.set(e, {
   [e]: t
  });
 }
}, win = window, doc = win.document, writeTask = e => {
 process.nextTick((() => {
  try {
   e();
  } catch (e) {
   consoleError(e);
  }
 }));
}, resolved = Promise.resolve(), nextTick = e => resolved.then(e), defaultConsoleError = e => {
 null != e && console.error(e.stack || e.message || e);
}, consoleError = (e, t) => (defaultConsoleError)(e, t), plt = {
 $flags$: 0,
 $resourcesUrl$: "",
 jmp: e => e(),
 raf: e => requestAnimationFrame(e),
 ael: (e, t, o, n) => e.addEventListener(t, o, n),
 rel: (e, t, o, n) => e.removeEventListener(t, o, n),
 ce: (e, t) => new win.CustomEvent(e, t)
}, supportsShadow = !1, hostRefs = new WeakMap, getHostRef = e => hostRefs.get(e), registerInstance = (e, t) => hostRefs.set(t.$lazyInstance$ = e, t), registerHost = (e, t) => {
 const o = {
  $flags$: 0,
  $cmpMeta$: t,
  $hostElement$: e,
  $instanceValues$: new Map,
  $renderCount$: 0
 };
 return o.$onInstancePromise$ = new Promise((e => o.$onInstanceResolve$ = e)), o.$onReadyPromise$ = new Promise((e => o.$onReadyResolve$ = e)), 
 e["s-p"] = [], e["s-rc"] = [], hostRefs.set(e, o);
}, styles = new Map;

const defaultEstimtestConfig = {
  experiments: [
    {
      name: 'Large Font Size',
      description: 'Many users have difficulty reading text at the default size. Users often solve this issue by increasing the browser\'s font size. To accommodate these users, it is suggested to use `rem` instead of `px` for `font-size`.',
      fontSize: 24,
    },
    {
      name: 'Deuteranomaly Color Blind',
      description: 'Deuteranomaly color blindness effects around 5% of men. People with Deuteranomaly often have difficulty distinguishing red and green colors.',
      colorBlind: 'deuteranomaly',
    },
    {
      name: 'Keyboard Navigation',
      description: `
Many users may use keyboard navigation for a variety of reasons such as: Motor impairment, saving time, and more.\\
Here is a list of useful shortcuts for Chromium.

---
**Browse clickable items moving forward**\\
\`Tab\`\\
**Browse clickable items moving backward**\\
\`Shift + Tab\`\\
**Scroll down a webpage, a screen at a time**\\
\`Space\`\\
**Scroll up a webpage, a screen at a time**\\
\`Shift + Space\`
			`,
      keyboardOnly: true,
    },
  ],
};

const sleep = async (milliseconds = 0) => {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
};

const autoResizeTextarea = async (element) => {
  if (element instanceof HTMLElement) {
    // Wait an event loop until it's hydrated fully
    if (element.scrollHeight === 0)
      await sleep();
    // Account for padding on the textarea
    const paddingTop = parseFloat(getComputedStyle(element).paddingTop.replace(/\p\x/g, ''));
    const paddingBottom = parseFloat(getComputedStyle(element).paddingBottom.replace(/\p\x/g, ''));
    // Resets scroll height to zero to have text dictate it
    element.style.setProperty('height', '0px');
    element.style.setProperty('height', `${element.scrollHeight - paddingTop - paddingBottom}px`);
  }
};
/**
 * Retrieves the value from input and change events.
 */
const getEventValue = (event) => {
  const target = event.target;
  return target.value;
};
const conditionallySetInert = (condition) => {
  return (element) => {
    if (!condition)
      element.setAttribute('inert', 'inert');
    else
      element.removeAttribute('inert');
  };
};
const transferChildren = (oldParent, newParent, filter) => {
  const nodes = [];
  oldParent === null || oldParent === void 0 ? void 0 : oldParent.childNodes.forEach((e) => nodes.push(e));
  nodes.forEach((node) => {
    if (filter(node))
      return;
    node.parentNode.removeChild(node);
    newParent.appendChild(node);
  });
};

/**
 * Idea and colorblindness values come from {@link https://github.com/hail2u/color-blindness-emulation}
 */
const activateColorBlind = (wrapper, test) => {
  const commonColorblindness = {
    protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
    protanomaly: [[0.817, 0.183, 0], [0.333, 0.667, 0], [0, 0.125, 0.875]],
    deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
    deuteranomaly: [[0.8, 0.2, 0], [0.258, 0.742, 0], [0, 0.142, 0.858]],
    tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
    tritanomaly: [[0.967, 0.033, 0], [0, 0.733, 0.267], [0, 0.183, 0.817]],
    achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]],
    achromatomaly: [[0.618, 0.320, 0.062], [0.163, 0.775, 0.062], [0.163, 0.320, 0.516]],
  };
  let matrix;
  if (typeof test.colorBlind === 'string') {
    matrix = commonColorblindness[test.colorBlind];
  }
  else {
    matrix = test.colorBlind;
  }
  const colorBlindFilter = `\
		<svg xmlns='http://www.w3.org/2000/svg'>\
			<filter id='estimtest-filter-color-blind'>\
				<feColorMatrix in='SourceGraphic' type='matrix' values='${matrix.map(e => `${e.join(' ')} 0 0`).join(' ')} 0 0 0 1 0'>\
				</feColorMatrix>\
			</filter>\
		</svg>\
	`;
  wrapper.content.style.setProperty('filter', `url("data:image/svg+xml,${colorBlindFilter}#estimtest-filter-color-blind")`);
};

const activateFontSize = (wrapper, test) => {
  wrapper.content.style.setProperty('font-size', `${test.fontSize}px`);
};

const activateKeyboardOnly = (wrapper, _) => {
  wrapper.content.style.setProperty('pointer-events', 'none');
};

const resetTest = (hostElement) => {
  const parent = hostElement.parentElement;
  let container = parent.querySelector(':scope > #estimtest-container');
  let content = parent.querySelector(':scope > #estimtest-container > #estimtest-content');
  if (content) {
    transferChildren(content, hostElement.parentElement, (node) => { var _a; return (_a = node.id) === null || _a === void 0 ? void 0 : _a.startsWith('estimtest'); });
    container.remove();
  }
};
const performTest = (hostElement, test) => {
  resetTest(hostElement);
  // Create wrapper element
  const container = document.createElement('div');
  container.id = 'estimtest-container';
  hostElement.before(container);
  const content = document.createElement('div');
  content.id = 'estimtest-content';
  container.appendChild(content);
  transferChildren(hostElement.parentElement, content, (node) => { var _a; return ((_a = node.id) === null || _a === void 0 ? void 0 : _a.startsWith('estimtest')) || node.tagName === 'ESTIMTEST-CORE'; });
  const elements = {
    container: container,
    content: content,
  };
  if (test.fontSize !== undefined)
    activateFontSize(elements, test);
  if (test.keyboardOnly === true)
    activateKeyboardOnly(elements);
  if (test.colorBlind !== undefined)
    activateColorBlind(elements, test);
};

function isContainer(node) {
    switch (node._type) {
        case "document":
        case "block_quote":
        case "list":
        case "item":
        case "paragraph":
        case "heading":
        case "emph":
        case "strong":
        case "link":
        case "image":
        case "custom_inline":
        case "custom_block":
            return true;
        default:
            return false;
    }
}

var resumeAt = function(node, entering) {
    this.current = node;
    this.entering = entering === true;
};

var next = function() {
    var cur = this.current;
    var entering = this.entering;

    if (cur === null) {
        return null;
    }

    var container = isContainer(cur);

    if (entering && container) {
        if (cur._firstChild) {
            this.current = cur._firstChild;
            this.entering = true;
        } else {
            // stay on node but exit
            this.entering = false;
        }
    } else if (cur === this.root) {
        this.current = null;
    } else if (cur._next === null) {
        this.current = cur._parent;
        this.entering = false;
    } else {
        this.current = cur._next;
        this.entering = true;
    }

    return { entering: entering, node: cur };
};

var NodeWalker = function(root) {
    return {
        current: root,
        root: root,
        entering: true,
        next: next,
        resumeAt: resumeAt
    };
};

var Node = function(nodeType, sourcepos) {
    this._type = nodeType;
    this._parent = null;
    this._firstChild = null;
    this._lastChild = null;
    this._prev = null;
    this._next = null;
    this._sourcepos = sourcepos;
    this._lastLineBlank = false;
    this._lastLineChecked = false;
    this._open = true;
    this._string_content = null;
    this._literal = null;
    this._listData = {};
    this._info = null;
    this._destination = null;
    this._title = null;
    this._isFenced = false;
    this._fenceChar = null;
    this._fenceLength = 0;
    this._fenceOffset = null;
    this._level = null;
    this._onEnter = null;
    this._onExit = null;
};

var proto = Node.prototype;

Object.defineProperty(proto, "isContainer", {
    get: function() {
        return isContainer(this);
    }
});

Object.defineProperty(proto, "type", {
    get: function() {
        return this._type;
    }
});

Object.defineProperty(proto, "firstChild", {
    get: function() {
        return this._firstChild;
    }
});

Object.defineProperty(proto, "lastChild", {
    get: function() {
        return this._lastChild;
    }
});

Object.defineProperty(proto, "next", {
    get: function() {
        return this._next;
    }
});

Object.defineProperty(proto, "prev", {
    get: function() {
        return this._prev;
    }
});

Object.defineProperty(proto, "parent", {
    get: function() {
        return this._parent;
    }
});

Object.defineProperty(proto, "sourcepos", {
    get: function() {
        return this._sourcepos;
    }
});

Object.defineProperty(proto, "literal", {
    get: function() {
        return this._literal;
    },
    set: function(s) {
        this._literal = s;
    }
});

Object.defineProperty(proto, "destination", {
    get: function() {
        return this._destination;
    },
    set: function(s) {
        this._destination = s;
    }
});

Object.defineProperty(proto, "title", {
    get: function() {
        return this._title;
    },
    set: function(s) {
        this._title = s;
    }
});

Object.defineProperty(proto, "info", {
    get: function() {
        return this._info;
    },
    set: function(s) {
        this._info = s;
    }
});

Object.defineProperty(proto, "level", {
    get: function() {
        return this._level;
    },
    set: function(s) {
        this._level = s;
    }
});

Object.defineProperty(proto, "listType", {
    get: function() {
        return this._listData.type;
    },
    set: function(t) {
        this._listData.type = t;
    }
});

Object.defineProperty(proto, "listTight", {
    get: function() {
        return this._listData.tight;
    },
    set: function(t) {
        this._listData.tight = t;
    }
});

Object.defineProperty(proto, "listStart", {
    get: function() {
        return this._listData.start;
    },
    set: function(n) {
        this._listData.start = n;
    }
});

Object.defineProperty(proto, "listDelimiter", {
    get: function() {
        return this._listData.delimiter;
    },
    set: function(delim) {
        this._listData.delimiter = delim;
    }
});

Object.defineProperty(proto, "onEnter", {
    get: function() {
        return this._onEnter;
    },
    set: function(s) {
        this._onEnter = s;
    }
});

Object.defineProperty(proto, "onExit", {
    get: function() {
        return this._onExit;
    },
    set: function(s) {
        this._onExit = s;
    }
});

Node.prototype.appendChild = function(child) {
    child.unlink();
    child._parent = this;
    if (this._lastChild) {
        this._lastChild._next = child;
        child._prev = this._lastChild;
        this._lastChild = child;
    } else {
        this._firstChild = child;
        this._lastChild = child;
    }
};

Node.prototype.prependChild = function(child) {
    child.unlink();
    child._parent = this;
    if (this._firstChild) {
        this._firstChild._prev = child;
        child._next = this._firstChild;
        this._firstChild = child;
    } else {
        this._firstChild = child;
        this._lastChild = child;
    }
};

Node.prototype.unlink = function() {
    if (this._prev) {
        this._prev._next = this._next;
    } else if (this._parent) {
        this._parent._firstChild = this._next;
    }
    if (this._next) {
        this._next._prev = this._prev;
    } else if (this._parent) {
        this._parent._lastChild = this._prev;
    }
    this._parent = null;
    this._next = null;
    this._prev = null;
};

Node.prototype.insertAfter = function(sibling) {
    sibling.unlink();
    sibling._next = this._next;
    if (sibling._next) {
        sibling._next._prev = sibling;
    }
    sibling._prev = this;
    this._next = sibling;
    sibling._parent = this._parent;
    if (!sibling._next) {
        sibling._parent._lastChild = sibling;
    }
};

Node.prototype.insertBefore = function(sibling) {
    sibling.unlink();
    sibling._prev = this._prev;
    if (sibling._prev) {
        sibling._prev._next = sibling;
    }
    sibling._next = this;
    this._prev = sibling;
    sibling._parent = this._parent;
    if (!sibling._prev) {
        sibling._parent._firstChild = sibling;
    }
};

Node.prototype.walker = function() {
    var walker = new NodeWalker(this);
    return walker;
};

/* Example of use of walker:

 var walker = w.walker();
 var event;

 while (event = walker.next()) {
 console.log(event.entering, event.node.type);
 }

 */

var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);

    if (/^[0-9a-z]$/i.test(ch)) {
      // always allow unencoded alphanumeric characters
      cache.push(ch);
    } else {
      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
    }
  }

  for (i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode$1(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
      result = '';

  if (typeof exclude !== 'string') {
    // encode(string, keepEscaped)
    keepEscaped  = exclude;
    exclude = encode$1.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
    keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
    code = string.charCodeAt(i);

    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }

    if (code < 128) {
      result += cache[code];
      continue;
    }

    if (code >= 0xD800 && code <= 0xDFFF) {
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
        nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += '%EF%BF%BD';
      continue;
    }

    result += encodeURIComponent(string[i]);
  }

  return result;
}

encode$1.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode$1.componentChars = "-_.!~*'()";


var encode_1 = encode$1;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire();
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

const Aacute$1 = "Á";
const aacute$1 = "á";
const Abreve = "Ă";
const abreve = "ă";
const ac = "∾";
const acd = "∿";
const acE = "∾̳";
const Acirc$1 = "Â";
const acirc$1 = "â";
const acute$1 = "´";
const Acy = "А";
const acy = "а";
const AElig$1 = "Æ";
const aelig$1 = "æ";
const af = "⁡";
const Afr = "𝔄";
const afr = "𝔞";
const Agrave$1 = "À";
const agrave$1 = "à";
const alefsym = "ℵ";
const aleph = "ℵ";
const Alpha = "Α";
const alpha = "α";
const Amacr = "Ā";
const amacr = "ā";
const amalg = "⨿";
const amp$2 = "&";
const AMP$1 = "&";
const andand = "⩕";
const And = "⩓";
const and = "∧";
const andd = "⩜";
const andslope = "⩘";
const andv = "⩚";
const ang = "∠";
const ange = "⦤";
const angle = "∠";
const angmsdaa = "⦨";
const angmsdab = "⦩";
const angmsdac = "⦪";
const angmsdad = "⦫";
const angmsdae = "⦬";
const angmsdaf = "⦭";
const angmsdag = "⦮";
const angmsdah = "⦯";
const angmsd = "∡";
const angrt = "∟";
const angrtvb = "⊾";
const angrtvbd = "⦝";
const angsph = "∢";
const angst = "Å";
const angzarr = "⍼";
const Aogon = "Ą";
const aogon = "ą";
const Aopf = "𝔸";
const aopf = "𝕒";
const apacir = "⩯";
const ap = "≈";
const apE = "⩰";
const ape = "≊";
const apid = "≋";
const apos$1 = "'";
const ApplyFunction = "⁡";
const approx = "≈";
const approxeq = "≊";
const Aring$1 = "Å";
const aring$1 = "å";
const Ascr = "𝒜";
const ascr = "𝒶";
const Assign = "≔";
const ast = "*";
const asymp = "≈";
const asympeq = "≍";
const Atilde$1 = "Ã";
const atilde$1 = "ã";
const Auml$1 = "Ä";
const auml$1 = "ä";
const awconint = "∳";
const awint = "⨑";
const backcong = "≌";
const backepsilon = "϶";
const backprime = "‵";
const backsim = "∽";
const backsimeq = "⋍";
const Backslash = "∖";
const Barv = "⫧";
const barvee = "⊽";
const barwed = "⌅";
const Barwed = "⌆";
const barwedge = "⌅";
const bbrk = "⎵";
const bbrktbrk = "⎶";
const bcong = "≌";
const Bcy = "Б";
const bcy = "б";
const bdquo = "„";
const becaus = "∵";
const because = "∵";
const Because = "∵";
const bemptyv = "⦰";
const bepsi = "϶";
const bernou = "ℬ";
const Bernoullis = "ℬ";
const Beta = "Β";
const beta = "β";
const beth = "ℶ";
const between = "≬";
const Bfr = "𝔅";
const bfr = "𝔟";
const bigcap = "⋂";
const bigcirc = "◯";
const bigcup = "⋃";
const bigodot = "⨀";
const bigoplus = "⨁";
const bigotimes = "⨂";
const bigsqcup = "⨆";
const bigstar = "★";
const bigtriangledown = "▽";
const bigtriangleup = "△";
const biguplus = "⨄";
const bigvee = "⋁";
const bigwedge = "⋀";
const bkarow = "⤍";
const blacklozenge = "⧫";
const blacksquare = "▪";
const blacktriangle = "▴";
const blacktriangledown = "▾";
const blacktriangleleft = "◂";
const blacktriangleright = "▸";
const blank = "␣";
const blk12 = "▒";
const blk14 = "░";
const blk34 = "▓";
const block = "█";
const bne = "=⃥";
const bnequiv = "≡⃥";
const bNot = "⫭";
const bnot = "⌐";
const Bopf = "𝔹";
const bopf = "𝕓";
const bot = "⊥";
const bottom = "⊥";
const bowtie = "⋈";
const boxbox = "⧉";
const boxdl = "┐";
const boxdL = "╕";
const boxDl = "╖";
const boxDL = "╗";
const boxdr = "┌";
const boxdR = "╒";
const boxDr = "╓";
const boxDR = "╔";
const boxh = "─";
const boxH = "═";
const boxhd = "┬";
const boxHd = "╤";
const boxhD = "╥";
const boxHD = "╦";
const boxhu = "┴";
const boxHu = "╧";
const boxhU = "╨";
const boxHU = "╩";
const boxminus = "⊟";
const boxplus = "⊞";
const boxtimes = "⊠";
const boxul = "┘";
const boxuL = "╛";
const boxUl = "╜";
const boxUL = "╝";
const boxur = "└";
const boxuR = "╘";
const boxUr = "╙";
const boxUR = "╚";
const boxv = "│";
const boxV = "║";
const boxvh = "┼";
const boxvH = "╪";
const boxVh = "╫";
const boxVH = "╬";
const boxvl = "┤";
const boxvL = "╡";
const boxVl = "╢";
const boxVL = "╣";
const boxvr = "├";
const boxvR = "╞";
const boxVr = "╟";
const boxVR = "╠";
const bprime = "‵";
const breve = "˘";
const Breve = "˘";
const brvbar$1 = "¦";
const bscr = "𝒷";
const Bscr = "ℬ";
const bsemi = "⁏";
const bsim = "∽";
const bsime = "⋍";
const bsolb = "⧅";
const bsol = "\\";
const bsolhsub = "⟈";
const bull = "•";
const bullet = "•";
const bump = "≎";
const bumpE = "⪮";
const bumpe = "≏";
const Bumpeq = "≎";
const bumpeq = "≏";
const Cacute = "Ć";
const cacute = "ć";
const capand = "⩄";
const capbrcup = "⩉";
const capcap = "⩋";
const cap = "∩";
const Cap = "⋒";
const capcup = "⩇";
const capdot = "⩀";
const CapitalDifferentialD = "ⅅ";
const caps = "∩︀";
const caret = "⁁";
const caron = "ˇ";
const Cayleys = "ℭ";
const ccaps = "⩍";
const Ccaron = "Č";
const ccaron = "č";
const Ccedil$1 = "Ç";
const ccedil$1 = "ç";
const Ccirc = "Ĉ";
const ccirc = "ĉ";
const Cconint = "∰";
const ccups = "⩌";
const ccupssm = "⩐";
const Cdot = "Ċ";
const cdot = "ċ";
const cedil$1 = "¸";
const Cedilla = "¸";
const cemptyv = "⦲";
const cent$1 = "¢";
const centerdot = "·";
const CenterDot = "·";
const cfr = "𝔠";
const Cfr = "ℭ";
const CHcy = "Ч";
const chcy = "ч";
const check = "✓";
const checkmark = "✓";
const Chi = "Χ";
const chi = "χ";
const circ = "ˆ";
const circeq = "≗";
const circlearrowleft = "↺";
const circlearrowright = "↻";
const circledast = "⊛";
const circledcirc = "⊚";
const circleddash = "⊝";
const CircleDot = "⊙";
const circledR = "®";
const circledS = "Ⓢ";
const CircleMinus = "⊖";
const CirclePlus = "⊕";
const CircleTimes = "⊗";
const cir = "○";
const cirE = "⧃";
const cire = "≗";
const cirfnint = "⨐";
const cirmid = "⫯";
const cirscir = "⧂";
const ClockwiseContourIntegral = "∲";
const CloseCurlyDoubleQuote = "”";
const CloseCurlyQuote = "’";
const clubs = "♣";
const clubsuit = "♣";
const colon = ":";
const Colon = "∷";
const Colone = "⩴";
const colone = "≔";
const coloneq = "≔";
const comma = ",";
const commat = "@";
const comp = "∁";
const compfn = "∘";
const complement = "∁";
const complexes = "ℂ";
const cong = "≅";
const congdot = "⩭";
const Congruent = "≡";
const conint = "∮";
const Conint = "∯";
const ContourIntegral = "∮";
const copf = "𝕔";
const Copf = "ℂ";
const coprod = "∐";
const Coproduct = "∐";
const copy$1 = "©";
const COPY$1 = "©";
const copysr = "℗";
const CounterClockwiseContourIntegral = "∳";
const crarr = "↵";
const cross = "✗";
const Cross = "⨯";
const Cscr = "𝒞";
const cscr = "𝒸";
const csub = "⫏";
const csube = "⫑";
const csup = "⫐";
const csupe = "⫒";
const ctdot = "⋯";
const cudarrl = "⤸";
const cudarrr = "⤵";
const cuepr = "⋞";
const cuesc = "⋟";
const cularr = "↶";
const cularrp = "⤽";
const cupbrcap = "⩈";
const cupcap = "⩆";
const CupCap = "≍";
const cup = "∪";
const Cup = "⋓";
const cupcup = "⩊";
const cupdot = "⊍";
const cupor = "⩅";
const cups = "∪︀";
const curarr = "↷";
const curarrm = "⤼";
const curlyeqprec = "⋞";
const curlyeqsucc = "⋟";
const curlyvee = "⋎";
const curlywedge = "⋏";
const curren$1 = "¤";
const curvearrowleft = "↶";
const curvearrowright = "↷";
const cuvee = "⋎";
const cuwed = "⋏";
const cwconint = "∲";
const cwint = "∱";
const cylcty = "⌭";
const dagger = "†";
const Dagger = "‡";
const daleth = "ℸ";
const darr = "↓";
const Darr = "↡";
const dArr = "⇓";
const dash = "‐";
const Dashv = "⫤";
const dashv = "⊣";
const dbkarow = "⤏";
const dblac = "˝";
const Dcaron = "Ď";
const dcaron = "ď";
const Dcy = "Д";
const dcy = "д";
const ddagger = "‡";
const ddarr = "⇊";
const DD = "ⅅ";
const dd = "ⅆ";
const DDotrahd = "⤑";
const ddotseq = "⩷";
const deg$1 = "°";
const Del = "∇";
const Delta = "Δ";
const delta = "δ";
const demptyv = "⦱";
const dfisht = "⥿";
const Dfr = "𝔇";
const dfr = "𝔡";
const dHar = "⥥";
const dharl = "⇃";
const dharr = "⇂";
const DiacriticalAcute = "´";
const DiacriticalDot = "˙";
const DiacriticalDoubleAcute = "˝";
const DiacriticalGrave = "`";
const DiacriticalTilde = "˜";
const diam = "⋄";
const diamond = "⋄";
const Diamond = "⋄";
const diamondsuit = "♦";
const diams = "♦";
const die = "¨";
const DifferentialD = "ⅆ";
const digamma = "ϝ";
const disin = "⋲";
const div = "÷";
const divide$1 = "÷";
const divideontimes = "⋇";
const divonx = "⋇";
const DJcy = "Ђ";
const djcy = "ђ";
const dlcorn = "⌞";
const dlcrop = "⌍";
const dollar = "$";
const Dopf = "𝔻";
const dopf = "𝕕";
const Dot = "¨";
const dot = "˙";
const DotDot = "⃜";
const doteq = "≐";
const doteqdot = "≑";
const DotEqual = "≐";
const dotminus = "∸";
const dotplus = "∔";
const dotsquare = "⊡";
const doublebarwedge = "⌆";
const DoubleContourIntegral = "∯";
const DoubleDot = "¨";
const DoubleDownArrow = "⇓";
const DoubleLeftArrow = "⇐";
const DoubleLeftRightArrow = "⇔";
const DoubleLeftTee = "⫤";
const DoubleLongLeftArrow = "⟸";
const DoubleLongLeftRightArrow = "⟺";
const DoubleLongRightArrow = "⟹";
const DoubleRightArrow = "⇒";
const DoubleRightTee = "⊨";
const DoubleUpArrow = "⇑";
const DoubleUpDownArrow = "⇕";
const DoubleVerticalBar = "∥";
const DownArrowBar = "⤓";
const downarrow = "↓";
const DownArrow = "↓";
const Downarrow = "⇓";
const DownArrowUpArrow = "⇵";
const DownBreve = "̑";
const downdownarrows = "⇊";
const downharpoonleft = "⇃";
const downharpoonright = "⇂";
const DownLeftRightVector = "⥐";
const DownLeftTeeVector = "⥞";
const DownLeftVectorBar = "⥖";
const DownLeftVector = "↽";
const DownRightTeeVector = "⥟";
const DownRightVectorBar = "⥗";
const DownRightVector = "⇁";
const DownTeeArrow = "↧";
const DownTee = "⊤";
const drbkarow = "⤐";
const drcorn = "⌟";
const drcrop = "⌌";
const Dscr = "𝒟";
const dscr = "𝒹";
const DScy = "Ѕ";
const dscy = "ѕ";
const dsol = "⧶";
const Dstrok = "Đ";
const dstrok = "đ";
const dtdot = "⋱";
const dtri = "▿";
const dtrif = "▾";
const duarr = "⇵";
const duhar = "⥯";
const dwangle = "⦦";
const DZcy = "Џ";
const dzcy = "џ";
const dzigrarr = "⟿";
const Eacute$1 = "É";
const eacute$1 = "é";
const easter = "⩮";
const Ecaron = "Ě";
const ecaron = "ě";
const Ecirc$1 = "Ê";
const ecirc$1 = "ê";
const ecir = "≖";
const ecolon = "≕";
const Ecy = "Э";
const ecy = "э";
const eDDot = "⩷";
const Edot = "Ė";
const edot = "ė";
const eDot = "≑";
const ee = "ⅇ";
const efDot = "≒";
const Efr = "𝔈";
const efr = "𝔢";
const eg = "⪚";
const Egrave$1 = "È";
const egrave$1 = "è";
const egs = "⪖";
const egsdot = "⪘";
const el = "⪙";
const Element = "∈";
const elinters = "⏧";
const ell = "ℓ";
const els = "⪕";
const elsdot = "⪗";
const Emacr = "Ē";
const emacr = "ē";
const empty = "∅";
const emptyset = "∅";
const EmptySmallSquare = "◻";
const emptyv = "∅";
const EmptyVerySmallSquare = "▫";
const emsp13 = " ";
const emsp14 = " ";
const emsp = " ";
const ENG = "Ŋ";
const eng = "ŋ";
const ensp = " ";
const Eogon = "Ę";
const eogon = "ę";
const Eopf = "𝔼";
const eopf = "𝕖";
const epar = "⋕";
const eparsl = "⧣";
const eplus = "⩱";
const epsi = "ε";
const Epsilon = "Ε";
const epsilon = "ε";
const epsiv = "ϵ";
const eqcirc = "≖";
const eqcolon = "≕";
const eqsim = "≂";
const eqslantgtr = "⪖";
const eqslantless = "⪕";
const Equal = "⩵";
const equals = "=";
const EqualTilde = "≂";
const equest = "≟";
const Equilibrium = "⇌";
const equiv = "≡";
const equivDD = "⩸";
const eqvparsl = "⧥";
const erarr = "⥱";
const erDot = "≓";
const escr = "ℯ";
const Escr = "ℰ";
const esdot = "≐";
const Esim = "⩳";
const esim = "≂";
const Eta = "Η";
const eta = "η";
const ETH$1 = "Ð";
const eth$1 = "ð";
const Euml$1 = "Ë";
const euml$1 = "ë";
const euro = "€";
const excl = "!";
const exist = "∃";
const Exists = "∃";
const expectation = "ℰ";
const exponentiale = "ⅇ";
const ExponentialE = "ⅇ";
const fallingdotseq = "≒";
const Fcy = "Ф";
const fcy = "ф";
const female = "♀";
const ffilig = "ﬃ";
const fflig = "ﬀ";
const ffllig = "ﬄ";
const Ffr = "𝔉";
const ffr = "𝔣";
const filig = "ﬁ";
const FilledSmallSquare = "◼";
const FilledVerySmallSquare = "▪";
const fjlig = "fj";
const flat = "♭";
const fllig = "ﬂ";
const fltns = "▱";
const fnof = "ƒ";
const Fopf = "𝔽";
const fopf = "𝕗";
const forall = "∀";
const ForAll = "∀";
const fork = "⋔";
const forkv = "⫙";
const Fouriertrf = "ℱ";
const fpartint = "⨍";
const frac12$1 = "½";
const frac13 = "⅓";
const frac14$1 = "¼";
const frac15 = "⅕";
const frac16 = "⅙";
const frac18 = "⅛";
const frac23 = "⅔";
const frac25 = "⅖";
const frac34$1 = "¾";
const frac35 = "⅗";
const frac38 = "⅜";
const frac45 = "⅘";
const frac56 = "⅚";
const frac58 = "⅝";
const frac78 = "⅞";
const frasl = "⁄";
const frown = "⌢";
const fscr = "𝒻";
const Fscr = "ℱ";
const gacute = "ǵ";
const Gamma = "Γ";
const gamma = "γ";
const Gammad = "Ϝ";
const gammad = "ϝ";
const gap = "⪆";
const Gbreve = "Ğ";
const gbreve = "ğ";
const Gcedil = "Ģ";
const Gcirc = "Ĝ";
const gcirc = "ĝ";
const Gcy = "Г";
const gcy = "г";
const Gdot = "Ġ";
const gdot = "ġ";
const ge = "≥";
const gE = "≧";
const gEl = "⪌";
const gel = "⋛";
const geq = "≥";
const geqq = "≧";
const geqslant = "⩾";
const gescc = "⪩";
const ges = "⩾";
const gesdot = "⪀";
const gesdoto = "⪂";
const gesdotol = "⪄";
const gesl = "⋛︀";
const gesles = "⪔";
const Gfr = "𝔊";
const gfr = "𝔤";
const gg = "≫";
const Gg = "⋙";
const ggg = "⋙";
const gimel = "ℷ";
const GJcy = "Ѓ";
const gjcy = "ѓ";
const gla = "⪥";
const gl = "≷";
const glE = "⪒";
const glj = "⪤";
const gnap = "⪊";
const gnapprox = "⪊";
const gne = "⪈";
const gnE = "≩";
const gneq = "⪈";
const gneqq = "≩";
const gnsim = "⋧";
const Gopf = "𝔾";
const gopf = "𝕘";
const grave = "`";
const GreaterEqual = "≥";
const GreaterEqualLess = "⋛";
const GreaterFullEqual = "≧";
const GreaterGreater = "⪢";
const GreaterLess = "≷";
const GreaterSlantEqual = "⩾";
const GreaterTilde = "≳";
const Gscr = "𝒢";
const gscr = "ℊ";
const gsim = "≳";
const gsime = "⪎";
const gsiml = "⪐";
const gtcc = "⪧";
const gtcir = "⩺";
const gt$2 = ">";
const GT$1 = ">";
const Gt = "≫";
const gtdot = "⋗";
const gtlPar = "⦕";
const gtquest = "⩼";
const gtrapprox = "⪆";
const gtrarr = "⥸";
const gtrdot = "⋗";
const gtreqless = "⋛";
const gtreqqless = "⪌";
const gtrless = "≷";
const gtrsim = "≳";
const gvertneqq = "≩︀";
const gvnE = "≩︀";
const Hacek = "ˇ";
const hairsp = " ";
const half = "½";
const hamilt = "ℋ";
const HARDcy = "Ъ";
const hardcy = "ъ";
const harrcir = "⥈";
const harr = "↔";
const hArr = "⇔";
const harrw = "↭";
const Hat = "^";
const hbar = "ℏ";
const Hcirc = "Ĥ";
const hcirc = "ĥ";
const hearts = "♥";
const heartsuit = "♥";
const hellip = "…";
const hercon = "⊹";
const hfr = "𝔥";
const Hfr = "ℌ";
const HilbertSpace = "ℋ";
const hksearow = "⤥";
const hkswarow = "⤦";
const hoarr = "⇿";
const homtht = "∻";
const hookleftarrow = "↩";
const hookrightarrow = "↪";
const hopf = "𝕙";
const Hopf = "ℍ";
const horbar = "―";
const HorizontalLine = "─";
const hscr = "𝒽";
const Hscr = "ℋ";
const hslash = "ℏ";
const Hstrok = "Ħ";
const hstrok = "ħ";
const HumpDownHump = "≎";
const HumpEqual = "≏";
const hybull = "⁃";
const hyphen = "‐";
const Iacute$1 = "Í";
const iacute$1 = "í";
const ic = "⁣";
const Icirc$1 = "Î";
const icirc$1 = "î";
const Icy = "И";
const icy = "и";
const Idot = "İ";
const IEcy = "Е";
const iecy = "е";
const iexcl$1 = "¡";
const iff = "⇔";
const ifr = "𝔦";
const Ifr = "ℑ";
const Igrave$1 = "Ì";
const igrave$1 = "ì";
const ii = "ⅈ";
const iiiint = "⨌";
const iiint = "∭";
const iinfin = "⧜";
const iiota = "℩";
const IJlig = "Ĳ";
const ijlig = "ĳ";
const Imacr = "Ī";
const imacr = "ī";
const image$1 = "ℑ";
const ImaginaryI = "ⅈ";
const imagline = "ℐ";
const imagpart = "ℑ";
const imath = "ı";
const Im = "ℑ";
const imof = "⊷";
const imped = "Ƶ";
const Implies = "⇒";
const incare = "℅";
const infin = "∞";
const infintie = "⧝";
const inodot = "ı";
const intcal = "⊺";
const int = "∫";
const Int = "∬";
const integers = "ℤ";
const Integral = "∫";
const intercal = "⊺";
const Intersection = "⋂";
const intlarhk = "⨗";
const intprod = "⨼";
const InvisibleComma = "⁣";
const InvisibleTimes = "⁢";
const IOcy = "Ё";
const iocy = "ё";
const Iogon = "Į";
const iogon = "į";
const Iopf = "𝕀";
const iopf = "𝕚";
const Iota = "Ι";
const iota = "ι";
const iprod = "⨼";
const iquest$1 = "¿";
const iscr = "𝒾";
const Iscr = "ℐ";
const isin = "∈";
const isindot = "⋵";
const isinE = "⋹";
const isins = "⋴";
const isinsv = "⋳";
const isinv = "∈";
const it = "⁢";
const Itilde = "Ĩ";
const itilde = "ĩ";
const Iukcy = "І";
const iukcy = "і";
const Iuml$1 = "Ï";
const iuml$1 = "ï";
const Jcirc = "Ĵ";
const jcirc = "ĵ";
const Jcy = "Й";
const jcy = "й";
const Jfr = "𝔍";
const jfr = "𝔧";
const jmath = "ȷ";
const Jopf = "𝕁";
const jopf = "𝕛";
const Jscr = "𝒥";
const jscr = "𝒿";
const Jsercy = "Ј";
const jsercy = "ј";
const Jukcy = "Є";
const jukcy = "є";
const Kappa = "Κ";
const kappa = "κ";
const kappav = "ϰ";
const Kcedil = "Ķ";
const kcedil = "ķ";
const Kcy = "К";
const kcy = "к";
const Kfr = "𝔎";
const kfr = "𝔨";
const kgreen = "ĸ";
const KHcy = "Х";
const khcy = "х";
const KJcy = "Ќ";
const kjcy = "ќ";
const Kopf = "𝕂";
const kopf = "𝕜";
const Kscr = "𝒦";
const kscr = "𝓀";
const lAarr = "⇚";
const Lacute = "Ĺ";
const lacute = "ĺ";
const laemptyv = "⦴";
const lagran = "ℒ";
const Lambda = "Λ";
const lambda = "λ";
const lang = "⟨";
const Lang = "⟪";
const langd = "⦑";
const langle = "⟨";
const lap = "⪅";
const Laplacetrf = "ℒ";
const laquo$1 = "«";
const larrb = "⇤";
const larrbfs = "⤟";
const larr = "←";
const Larr = "↞";
const lArr = "⇐";
const larrfs = "⤝";
const larrhk = "↩";
const larrlp = "↫";
const larrpl = "⤹";
const larrsim = "⥳";
const larrtl = "↢";
const latail = "⤙";
const lAtail = "⤛";
const lat = "⪫";
const late = "⪭";
const lates = "⪭︀";
const lbarr = "⤌";
const lBarr = "⤎";
const lbbrk = "❲";
const lbrace = "{";
const lbrack = "[";
const lbrke = "⦋";
const lbrksld = "⦏";
const lbrkslu = "⦍";
const Lcaron = "Ľ";
const lcaron = "ľ";
const Lcedil = "Ļ";
const lcedil = "ļ";
const lceil = "⌈";
const lcub = "{";
const Lcy = "Л";
const lcy = "л";
const ldca = "⤶";
const ldquo = "“";
const ldquor = "„";
const ldrdhar = "⥧";
const ldrushar = "⥋";
const ldsh = "↲";
const le = "≤";
const lE = "≦";
const LeftAngleBracket = "⟨";
const LeftArrowBar = "⇤";
const leftarrow = "←";
const LeftArrow = "←";
const Leftarrow = "⇐";
const LeftArrowRightArrow = "⇆";
const leftarrowtail = "↢";
const LeftCeiling = "⌈";
const LeftDoubleBracket = "⟦";
const LeftDownTeeVector = "⥡";
const LeftDownVectorBar = "⥙";
const LeftDownVector = "⇃";
const LeftFloor = "⌊";
const leftharpoondown = "↽";
const leftharpoonup = "↼";
const leftleftarrows = "⇇";
const leftrightarrow = "↔";
const LeftRightArrow = "↔";
const Leftrightarrow = "⇔";
const leftrightarrows = "⇆";
const leftrightharpoons = "⇋";
const leftrightsquigarrow = "↭";
const LeftRightVector = "⥎";
const LeftTeeArrow = "↤";
const LeftTee = "⊣";
const LeftTeeVector = "⥚";
const leftthreetimes = "⋋";
const LeftTriangleBar = "⧏";
const LeftTriangle = "⊲";
const LeftTriangleEqual = "⊴";
const LeftUpDownVector = "⥑";
const LeftUpTeeVector = "⥠";
const LeftUpVectorBar = "⥘";
const LeftUpVector = "↿";
const LeftVectorBar = "⥒";
const LeftVector = "↼";
const lEg = "⪋";
const leg = "⋚";
const leq = "≤";
const leqq = "≦";
const leqslant = "⩽";
const lescc = "⪨";
const les = "⩽";
const lesdot = "⩿";
const lesdoto = "⪁";
const lesdotor = "⪃";
const lesg = "⋚︀";
const lesges = "⪓";
const lessapprox = "⪅";
const lessdot = "⋖";
const lesseqgtr = "⋚";
const lesseqqgtr = "⪋";
const LessEqualGreater = "⋚";
const LessFullEqual = "≦";
const LessGreater = "≶";
const lessgtr = "≶";
const LessLess = "⪡";
const lesssim = "≲";
const LessSlantEqual = "⩽";
const LessTilde = "≲";
const lfisht = "⥼";
const lfloor = "⌊";
const Lfr = "𝔏";
const lfr = "𝔩";
const lg = "≶";
const lgE = "⪑";
const lHar = "⥢";
const lhard = "↽";
const lharu = "↼";
const lharul = "⥪";
const lhblk = "▄";
const LJcy = "Љ";
const ljcy = "љ";
const llarr = "⇇";
const ll = "≪";
const Ll = "⋘";
const llcorner = "⌞";
const Lleftarrow = "⇚";
const llhard = "⥫";
const lltri = "◺";
const Lmidot = "Ŀ";
const lmidot = "ŀ";
const lmoustache = "⎰";
const lmoust = "⎰";
const lnap = "⪉";
const lnapprox = "⪉";
const lne = "⪇";
const lnE = "≨";
const lneq = "⪇";
const lneqq = "≨";
const lnsim = "⋦";
const loang = "⟬";
const loarr = "⇽";
const lobrk = "⟦";
const longleftarrow = "⟵";
const LongLeftArrow = "⟵";
const Longleftarrow = "⟸";
const longleftrightarrow = "⟷";
const LongLeftRightArrow = "⟷";
const Longleftrightarrow = "⟺";
const longmapsto = "⟼";
const longrightarrow = "⟶";
const LongRightArrow = "⟶";
const Longrightarrow = "⟹";
const looparrowleft = "↫";
const looparrowright = "↬";
const lopar = "⦅";
const Lopf = "𝕃";
const lopf = "𝕝";
const loplus = "⨭";
const lotimes = "⨴";
const lowast = "∗";
const lowbar = "_";
const LowerLeftArrow = "↙";
const LowerRightArrow = "↘";
const loz = "◊";
const lozenge = "◊";
const lozf = "⧫";
const lpar = "(";
const lparlt = "⦓";
const lrarr = "⇆";
const lrcorner = "⌟";
const lrhar = "⇋";
const lrhard = "⥭";
const lrm = "‎";
const lrtri = "⊿";
const lsaquo = "‹";
const lscr = "𝓁";
const Lscr = "ℒ";
const lsh = "↰";
const Lsh = "↰";
const lsim = "≲";
const lsime = "⪍";
const lsimg = "⪏";
const lsqb = "[";
const lsquo = "‘";
const lsquor = "‚";
const Lstrok = "Ł";
const lstrok = "ł";
const ltcc = "⪦";
const ltcir = "⩹";
const lt$2 = "<";
const LT$1 = "<";
const Lt = "≪";
const ltdot = "⋖";
const lthree = "⋋";
const ltimes = "⋉";
const ltlarr = "⥶";
const ltquest = "⩻";
const ltri = "◃";
const ltrie = "⊴";
const ltrif = "◂";
const ltrPar = "⦖";
const lurdshar = "⥊";
const luruhar = "⥦";
const lvertneqq = "≨︀";
const lvnE = "≨︀";
const macr$1 = "¯";
const male = "♂";
const malt = "✠";
const maltese = "✠";
const map = "↦";
const mapsto = "↦";
const mapstodown = "↧";
const mapstoleft = "↤";
const mapstoup = "↥";
const marker = "▮";
const mcomma = "⨩";
const Mcy = "М";
const mcy = "м";
const mdash = "—";
const mDDot = "∺";
const measuredangle = "∡";
const MediumSpace = " ";
const Mellintrf = "ℳ";
const Mfr = "𝔐";
const mfr = "𝔪";
const mho = "℧";
const micro$1 = "µ";
const midast = "*";
const midcir = "⫰";
const mid = "∣";
const middot$1 = "·";
const minusb = "⊟";
const minus = "−";
const minusd = "∸";
const minusdu = "⨪";
const MinusPlus = "∓";
const mlcp = "⫛";
const mldr = "…";
const mnplus = "∓";
const models = "⊧";
const Mopf = "𝕄";
const mopf = "𝕞";
const mp = "∓";
const mscr = "𝓂";
const Mscr = "ℳ";
const mstpos = "∾";
const Mu = "Μ";
const mu = "μ";
const multimap = "⊸";
const mumap = "⊸";
const nabla = "∇";
const Nacute = "Ń";
const nacute = "ń";
const nang = "∠⃒";
const nap = "≉";
const napE = "⩰̸";
const napid = "≋̸";
const napos = "ŉ";
const napprox = "≉";
const natural = "♮";
const naturals = "ℕ";
const natur = "♮";
const nbsp$1 = " ";
const nbump = "≎̸";
const nbumpe = "≏̸";
const ncap = "⩃";
const Ncaron = "Ň";
const ncaron = "ň";
const Ncedil = "Ņ";
const ncedil = "ņ";
const ncong = "≇";
const ncongdot = "⩭̸";
const ncup = "⩂";
const Ncy = "Н";
const ncy = "н";
const ndash = "–";
const nearhk = "⤤";
const nearr = "↗";
const neArr = "⇗";
const nearrow = "↗";
const ne = "≠";
const nedot = "≐̸";
const NegativeMediumSpace = "​";
const NegativeThickSpace = "​";
const NegativeThinSpace = "​";
const NegativeVeryThinSpace = "​";
const nequiv = "≢";
const nesear = "⤨";
const nesim = "≂̸";
const NestedGreaterGreater = "≫";
const NestedLessLess = "≪";
const NewLine = "\n";
const nexist = "∄";
const nexists = "∄";
const Nfr = "𝔑";
const nfr = "𝔫";
const ngE = "≧̸";
const nge = "≱";
const ngeq = "≱";
const ngeqq = "≧̸";
const ngeqslant = "⩾̸";
const nges = "⩾̸";
const nGg = "⋙̸";
const ngsim = "≵";
const nGt = "≫⃒";
const ngt = "≯";
const ngtr = "≯";
const nGtv = "≫̸";
const nharr = "↮";
const nhArr = "⇎";
const nhpar = "⫲";
const ni = "∋";
const nis = "⋼";
const nisd = "⋺";
const niv = "∋";
const NJcy = "Њ";
const njcy = "њ";
const nlarr = "↚";
const nlArr = "⇍";
const nldr = "‥";
const nlE = "≦̸";
const nle = "≰";
const nleftarrow = "↚";
const nLeftarrow = "⇍";
const nleftrightarrow = "↮";
const nLeftrightarrow = "⇎";
const nleq = "≰";
const nleqq = "≦̸";
const nleqslant = "⩽̸";
const nles = "⩽̸";
const nless = "≮";
const nLl = "⋘̸";
const nlsim = "≴";
const nLt = "≪⃒";
const nlt = "≮";
const nltri = "⋪";
const nltrie = "⋬";
const nLtv = "≪̸";
const nmid = "∤";
const NoBreak = "⁠";
const NonBreakingSpace = " ";
const nopf = "𝕟";
const Nopf = "ℕ";
const Not = "⫬";
const not$1 = "¬";
const NotCongruent = "≢";
const NotCupCap = "≭";
const NotDoubleVerticalBar = "∦";
const NotElement = "∉";
const NotEqual = "≠";
const NotEqualTilde = "≂̸";
const NotExists = "∄";
const NotGreater = "≯";
const NotGreaterEqual = "≱";
const NotGreaterFullEqual = "≧̸";
const NotGreaterGreater = "≫̸";
const NotGreaterLess = "≹";
const NotGreaterSlantEqual = "⩾̸";
const NotGreaterTilde = "≵";
const NotHumpDownHump = "≎̸";
const NotHumpEqual = "≏̸";
const notin = "∉";
const notindot = "⋵̸";
const notinE = "⋹̸";
const notinva = "∉";
const notinvb = "⋷";
const notinvc = "⋶";
const NotLeftTriangleBar = "⧏̸";
const NotLeftTriangle = "⋪";
const NotLeftTriangleEqual = "⋬";
const NotLess = "≮";
const NotLessEqual = "≰";
const NotLessGreater = "≸";
const NotLessLess = "≪̸";
const NotLessSlantEqual = "⩽̸";
const NotLessTilde = "≴";
const NotNestedGreaterGreater = "⪢̸";
const NotNestedLessLess = "⪡̸";
const notni = "∌";
const notniva = "∌";
const notnivb = "⋾";
const notnivc = "⋽";
const NotPrecedes = "⊀";
const NotPrecedesEqual = "⪯̸";
const NotPrecedesSlantEqual = "⋠";
const NotReverseElement = "∌";
const NotRightTriangleBar = "⧐̸";
const NotRightTriangle = "⋫";
const NotRightTriangleEqual = "⋭";
const NotSquareSubset = "⊏̸";
const NotSquareSubsetEqual = "⋢";
const NotSquareSuperset = "⊐̸";
const NotSquareSupersetEqual = "⋣";
const NotSubset = "⊂⃒";
const NotSubsetEqual = "⊈";
const NotSucceeds = "⊁";
const NotSucceedsEqual = "⪰̸";
const NotSucceedsSlantEqual = "⋡";
const NotSucceedsTilde = "≿̸";
const NotSuperset = "⊃⃒";
const NotSupersetEqual = "⊉";
const NotTilde = "≁";
const NotTildeEqual = "≄";
const NotTildeFullEqual = "≇";
const NotTildeTilde = "≉";
const NotVerticalBar = "∤";
const nparallel = "∦";
const npar = "∦";
const nparsl = "⫽⃥";
const npart = "∂̸";
const npolint = "⨔";
const npr = "⊀";
const nprcue = "⋠";
const nprec = "⊀";
const npreceq = "⪯̸";
const npre = "⪯̸";
const nrarrc = "⤳̸";
const nrarr = "↛";
const nrArr = "⇏";
const nrarrw = "↝̸";
const nrightarrow = "↛";
const nRightarrow = "⇏";
const nrtri = "⋫";
const nrtrie = "⋭";
const nsc = "⊁";
const nsccue = "⋡";
const nsce = "⪰̸";
const Nscr = "𝒩";
const nscr = "𝓃";
const nshortmid = "∤";
const nshortparallel = "∦";
const nsim = "≁";
const nsime = "≄";
const nsimeq = "≄";
const nsmid = "∤";
const nspar = "∦";
const nsqsube = "⋢";
const nsqsupe = "⋣";
const nsub = "⊄";
const nsubE = "⫅̸";
const nsube = "⊈";
const nsubset = "⊂⃒";
const nsubseteq = "⊈";
const nsubseteqq = "⫅̸";
const nsucc = "⊁";
const nsucceq = "⪰̸";
const nsup = "⊅";
const nsupE = "⫆̸";
const nsupe = "⊉";
const nsupset = "⊃⃒";
const nsupseteq = "⊉";
const nsupseteqq = "⫆̸";
const ntgl = "≹";
const Ntilde$1 = "Ñ";
const ntilde$1 = "ñ";
const ntlg = "≸";
const ntriangleleft = "⋪";
const ntrianglelefteq = "⋬";
const ntriangleright = "⋫";
const ntrianglerighteq = "⋭";
const Nu = "Ν";
const nu = "ν";
const num = "#";
const numero = "№";
const numsp = " ";
const nvap = "≍⃒";
const nvdash = "⊬";
const nvDash = "⊭";
const nVdash = "⊮";
const nVDash = "⊯";
const nvge = "≥⃒";
const nvgt = ">⃒";
const nvHarr = "⤄";
const nvinfin = "⧞";
const nvlArr = "⤂";
const nvle = "≤⃒";
const nvlt = "<⃒";
const nvltrie = "⊴⃒";
const nvrArr = "⤃";
const nvrtrie = "⊵⃒";
const nvsim = "∼⃒";
const nwarhk = "⤣";
const nwarr = "↖";
const nwArr = "⇖";
const nwarrow = "↖";
const nwnear = "⤧";
const Oacute$1 = "Ó";
const oacute$1 = "ó";
const oast = "⊛";
const Ocirc$1 = "Ô";
const ocirc$1 = "ô";
const ocir = "⊚";
const Ocy = "О";
const ocy = "о";
const odash = "⊝";
const Odblac = "Ő";
const odblac = "ő";
const odiv = "⨸";
const odot = "⊙";
const odsold = "⦼";
const OElig = "Œ";
const oelig = "œ";
const ofcir = "⦿";
const Ofr = "𝔒";
const ofr = "𝔬";
const ogon = "˛";
const Ograve$1 = "Ò";
const ograve$1 = "ò";
const ogt = "⧁";
const ohbar = "⦵";
const ohm = "Ω";
const oint = "∮";
const olarr = "↺";
const olcir = "⦾";
const olcross = "⦻";
const oline = "‾";
const olt = "⧀";
const Omacr = "Ō";
const omacr = "ō";
const Omega = "Ω";
const omega = "ω";
const Omicron = "Ο";
const omicron = "ο";
const omid = "⦶";
const ominus = "⊖";
const Oopf = "𝕆";
const oopf = "𝕠";
const opar = "⦷";
const OpenCurlyDoubleQuote = "“";
const OpenCurlyQuote = "‘";
const operp = "⦹";
const oplus = "⊕";
const orarr = "↻";
const Or = "⩔";
const or = "∨";
const ord = "⩝";
const order = "ℴ";
const orderof = "ℴ";
const ordf$1 = "ª";
const ordm$1 = "º";
const origof = "⊶";
const oror = "⩖";
const orslope = "⩗";
const orv = "⩛";
const oS = "Ⓢ";
const Oscr = "𝒪";
const oscr = "ℴ";
const Oslash$1 = "Ø";
const oslash$1 = "ø";
const osol = "⊘";
const Otilde$1 = "Õ";
const otilde$1 = "õ";
const otimesas = "⨶";
const Otimes = "⨷";
const otimes = "⊗";
const Ouml$1 = "Ö";
const ouml$1 = "ö";
const ovbar = "⌽";
const OverBar = "‾";
const OverBrace = "⏞";
const OverBracket = "⎴";
const OverParenthesis = "⏜";
const para$1 = "¶";
const parallel = "∥";
const par = "∥";
const parsim = "⫳";
const parsl = "⫽";
const part = "∂";
const PartialD = "∂";
const Pcy = "П";
const pcy = "п";
const percnt = "%";
const period = ".";
const permil = "‰";
const perp = "⊥";
const pertenk = "‱";
const Pfr = "𝔓";
const pfr = "𝔭";
const Phi = "Φ";
const phi = "φ";
const phiv = "ϕ";
const phmmat = "ℳ";
const phone = "☎";
const Pi = "Π";
const pi = "π";
const pitchfork = "⋔";
const piv = "ϖ";
const planck = "ℏ";
const planckh = "ℎ";
const plankv = "ℏ";
const plusacir = "⨣";
const plusb = "⊞";
const pluscir = "⨢";
const plus = "+";
const plusdo = "∔";
const plusdu = "⨥";
const pluse = "⩲";
const PlusMinus = "±";
const plusmn$1 = "±";
const plussim = "⨦";
const plustwo = "⨧";
const pm = "±";
const Poincareplane = "ℌ";
const pointint = "⨕";
const popf = "𝕡";
const Popf = "ℙ";
const pound$1 = "£";
const prap = "⪷";
const Pr = "⪻";
const pr = "≺";
const prcue = "≼";
const precapprox = "⪷";
const prec = "≺";
const preccurlyeq = "≼";
const Precedes = "≺";
const PrecedesEqual = "⪯";
const PrecedesSlantEqual = "≼";
const PrecedesTilde = "≾";
const preceq = "⪯";
const precnapprox = "⪹";
const precneqq = "⪵";
const precnsim = "⋨";
const pre = "⪯";
const prE = "⪳";
const precsim = "≾";
const prime = "′";
const Prime = "″";
const primes = "ℙ";
const prnap = "⪹";
const prnE = "⪵";
const prnsim = "⋨";
const prod = "∏";
const Product = "∏";
const profalar = "⌮";
const profline = "⌒";
const profsurf = "⌓";
const prop = "∝";
const Proportional = "∝";
const Proportion = "∷";
const propto = "∝";
const prsim = "≾";
const prurel = "⊰";
const Pscr = "𝒫";
const pscr = "𝓅";
const Psi = "Ψ";
const psi = "ψ";
const puncsp = " ";
const Qfr = "𝔔";
const qfr = "𝔮";
const qint = "⨌";
const qopf = "𝕢";
const Qopf = "ℚ";
const qprime = "⁗";
const Qscr = "𝒬";
const qscr = "𝓆";
const quaternions = "ℍ";
const quatint = "⨖";
const quest = "?";
const questeq = "≟";
const quot$2 = "\"";
const QUOT$1 = "\"";
const rAarr = "⇛";
const race = "∽̱";
const Racute = "Ŕ";
const racute = "ŕ";
const radic = "√";
const raemptyv = "⦳";
const rang = "⟩";
const Rang = "⟫";
const rangd = "⦒";
const range = "⦥";
const rangle = "⟩";
const raquo$1 = "»";
const rarrap = "⥵";
const rarrb = "⇥";
const rarrbfs = "⤠";
const rarrc = "⤳";
const rarr = "→";
const Rarr = "↠";
const rArr = "⇒";
const rarrfs = "⤞";
const rarrhk = "↪";
const rarrlp = "↬";
const rarrpl = "⥅";
const rarrsim = "⥴";
const Rarrtl = "⤖";
const rarrtl = "↣";
const rarrw = "↝";
const ratail = "⤚";
const rAtail = "⤜";
const ratio = "∶";
const rationals = "ℚ";
const rbarr = "⤍";
const rBarr = "⤏";
const RBarr = "⤐";
const rbbrk = "❳";
const rbrace = "}";
const rbrack = "]";
const rbrke = "⦌";
const rbrksld = "⦎";
const rbrkslu = "⦐";
const Rcaron = "Ř";
const rcaron = "ř";
const Rcedil = "Ŗ";
const rcedil = "ŗ";
const rceil = "⌉";
const rcub = "}";
const Rcy = "Р";
const rcy = "р";
const rdca = "⤷";
const rdldhar = "⥩";
const rdquo = "”";
const rdquor = "”";
const rdsh = "↳";
const real = "ℜ";
const realine = "ℛ";
const realpart = "ℜ";
const reals = "ℝ";
const Re = "ℜ";
const rect = "▭";
const reg$1 = "®";
const REG$1 = "®";
const ReverseElement = "∋";
const ReverseEquilibrium = "⇋";
const ReverseUpEquilibrium = "⥯";
const rfisht = "⥽";
const rfloor = "⌋";
const rfr = "𝔯";
const Rfr = "ℜ";
const rHar = "⥤";
const rhard = "⇁";
const rharu = "⇀";
const rharul = "⥬";
const Rho = "Ρ";
const rho = "ρ";
const rhov = "ϱ";
const RightAngleBracket = "⟩";
const RightArrowBar = "⇥";
const rightarrow = "→";
const RightArrow = "→";
const Rightarrow = "⇒";
const RightArrowLeftArrow = "⇄";
const rightarrowtail = "↣";
const RightCeiling = "⌉";
const RightDoubleBracket = "⟧";
const RightDownTeeVector = "⥝";
const RightDownVectorBar = "⥕";
const RightDownVector = "⇂";
const RightFloor = "⌋";
const rightharpoondown = "⇁";
const rightharpoonup = "⇀";
const rightleftarrows = "⇄";
const rightleftharpoons = "⇌";
const rightrightarrows = "⇉";
const rightsquigarrow = "↝";
const RightTeeArrow = "↦";
const RightTee = "⊢";
const RightTeeVector = "⥛";
const rightthreetimes = "⋌";
const RightTriangleBar = "⧐";
const RightTriangle = "⊳";
const RightTriangleEqual = "⊵";
const RightUpDownVector = "⥏";
const RightUpTeeVector = "⥜";
const RightUpVectorBar = "⥔";
const RightUpVector = "↾";
const RightVectorBar = "⥓";
const RightVector = "⇀";
const ring = "˚";
const risingdotseq = "≓";
const rlarr = "⇄";
const rlhar = "⇌";
const rlm = "‏";
const rmoustache = "⎱";
const rmoust = "⎱";
const rnmid = "⫮";
const roang = "⟭";
const roarr = "⇾";
const robrk = "⟧";
const ropar = "⦆";
const ropf = "𝕣";
const Ropf = "ℝ";
const roplus = "⨮";
const rotimes = "⨵";
const RoundImplies = "⥰";
const rpar = ")";
const rpargt = "⦔";
const rppolint = "⨒";
const rrarr = "⇉";
const Rrightarrow = "⇛";
const rsaquo = "›";
const rscr = "𝓇";
const Rscr = "ℛ";
const rsh = "↱";
const Rsh = "↱";
const rsqb = "]";
const rsquo = "’";
const rsquor = "’";
const rthree = "⋌";
const rtimes = "⋊";
const rtri = "▹";
const rtrie = "⊵";
const rtrif = "▸";
const rtriltri = "⧎";
const RuleDelayed = "⧴";
const ruluhar = "⥨";
const rx = "℞";
const Sacute = "Ś";
const sacute = "ś";
const sbquo = "‚";
const scap = "⪸";
const Scaron = "Š";
const scaron = "š";
const Sc = "⪼";
const sc = "≻";
const sccue = "≽";
const sce = "⪰";
const scE = "⪴";
const Scedil = "Ş";
const scedil = "ş";
const Scirc = "Ŝ";
const scirc = "ŝ";
const scnap = "⪺";
const scnE = "⪶";
const scnsim = "⋩";
const scpolint = "⨓";
const scsim = "≿";
const Scy = "С";
const scy = "с";
const sdotb = "⊡";
const sdot = "⋅";
const sdote = "⩦";
const searhk = "⤥";
const searr = "↘";
const seArr = "⇘";
const searrow = "↘";
const sect$1 = "§";
const semi = ";";
const seswar = "⤩";
const setminus = "∖";
const setmn = "∖";
const sext = "✶";
const Sfr = "𝔖";
const sfr = "𝔰";
const sfrown = "⌢";
const sharp = "♯";
const SHCHcy = "Щ";
const shchcy = "щ";
const SHcy = "Ш";
const shcy = "ш";
const ShortDownArrow = "↓";
const ShortLeftArrow = "←";
const shortmid = "∣";
const shortparallel = "∥";
const ShortRightArrow = "→";
const ShortUpArrow = "↑";
const shy$1 = "­";
const Sigma = "Σ";
const sigma = "σ";
const sigmaf = "ς";
const sigmav = "ς";
const sim = "∼";
const simdot = "⩪";
const sime = "≃";
const simeq = "≃";
const simg = "⪞";
const simgE = "⪠";
const siml = "⪝";
const simlE = "⪟";
const simne = "≆";
const simplus = "⨤";
const simrarr = "⥲";
const slarr = "←";
const SmallCircle = "∘";
const smallsetminus = "∖";
const smashp = "⨳";
const smeparsl = "⧤";
const smid = "∣";
const smile = "⌣";
const smt = "⪪";
const smte = "⪬";
const smtes = "⪬︀";
const SOFTcy = "Ь";
const softcy = "ь";
const solbar = "⌿";
const solb = "⧄";
const sol = "/";
const Sopf = "𝕊";
const sopf = "𝕤";
const spades = "♠";
const spadesuit = "♠";
const spar = "∥";
const sqcap = "⊓";
const sqcaps = "⊓︀";
const sqcup = "⊔";
const sqcups = "⊔︀";
const Sqrt = "√";
const sqsub = "⊏";
const sqsube = "⊑";
const sqsubset = "⊏";
const sqsubseteq = "⊑";
const sqsup = "⊐";
const sqsupe = "⊒";
const sqsupset = "⊐";
const sqsupseteq = "⊒";
const square = "□";
const Square = "□";
const SquareIntersection = "⊓";
const SquareSubset = "⊏";
const SquareSubsetEqual = "⊑";
const SquareSuperset = "⊐";
const SquareSupersetEqual = "⊒";
const SquareUnion = "⊔";
const squarf = "▪";
const squ = "□";
const squf = "▪";
const srarr = "→";
const Sscr = "𝒮";
const sscr = "𝓈";
const ssetmn = "∖";
const ssmile = "⌣";
const sstarf = "⋆";
const Star = "⋆";
const star = "☆";
const starf = "★";
const straightepsilon = "ϵ";
const straightphi = "ϕ";
const strns = "¯";
const sub = "⊂";
const Sub = "⋐";
const subdot = "⪽";
const subE = "⫅";
const sube = "⊆";
const subedot = "⫃";
const submult = "⫁";
const subnE = "⫋";
const subne = "⊊";
const subplus = "⪿";
const subrarr = "⥹";
const subset = "⊂";
const Subset = "⋐";
const subseteq = "⊆";
const subseteqq = "⫅";
const SubsetEqual = "⊆";
const subsetneq = "⊊";
const subsetneqq = "⫋";
const subsim = "⫇";
const subsub = "⫕";
const subsup = "⫓";
const succapprox = "⪸";
const succ = "≻";
const succcurlyeq = "≽";
const Succeeds = "≻";
const SucceedsEqual = "⪰";
const SucceedsSlantEqual = "≽";
const SucceedsTilde = "≿";
const succeq = "⪰";
const succnapprox = "⪺";
const succneqq = "⪶";
const succnsim = "⋩";
const succsim = "≿";
const SuchThat = "∋";
const sum = "∑";
const Sum = "∑";
const sung = "♪";
const sup1$1 = "¹";
const sup2$1 = "²";
const sup3$1 = "³";
const sup = "⊃";
const Sup = "⋑";
const supdot = "⪾";
const supdsub = "⫘";
const supE = "⫆";
const supe = "⊇";
const supedot = "⫄";
const Superset = "⊃";
const SupersetEqual = "⊇";
const suphsol = "⟉";
const suphsub = "⫗";
const suplarr = "⥻";
const supmult = "⫂";
const supnE = "⫌";
const supne = "⊋";
const supplus = "⫀";
const supset = "⊃";
const Supset = "⋑";
const supseteq = "⊇";
const supseteqq = "⫆";
const supsetneq = "⊋";
const supsetneqq = "⫌";
const supsim = "⫈";
const supsub = "⫔";
const supsup = "⫖";
const swarhk = "⤦";
const swarr = "↙";
const swArr = "⇙";
const swarrow = "↙";
const swnwar = "⤪";
const szlig$1 = "ß";
const Tab = "\t";
const target = "⌖";
const Tau = "Τ";
const tau = "τ";
const tbrk = "⎴";
const Tcaron = "Ť";
const tcaron = "ť";
const Tcedil = "Ţ";
const tcedil = "ţ";
const Tcy = "Т";
const tcy = "т";
const tdot = "⃛";
const telrec = "⌕";
const Tfr = "𝔗";
const tfr = "𝔱";
const there4 = "∴";
const therefore = "∴";
const Therefore = "∴";
const Theta = "Θ";
const theta = "θ";
const thetasym = "ϑ";
const thetav = "ϑ";
const thickapprox = "≈";
const thicksim = "∼";
const ThickSpace = "  ";
const ThinSpace = " ";
const thinsp = " ";
const thkap = "≈";
const thksim = "∼";
const THORN$1 = "Þ";
const thorn$1 = "þ";
const tilde = "˜";
const Tilde = "∼";
const TildeEqual = "≃";
const TildeFullEqual = "≅";
const TildeTilde = "≈";
const timesbar = "⨱";
const timesb = "⊠";
const times$1 = "×";
const timesd = "⨰";
const tint = "∭";
const toea = "⤨";
const topbot = "⌶";
const topcir = "⫱";
const top = "⊤";
const Topf = "𝕋";
const topf = "𝕥";
const topfork = "⫚";
const tosa = "⤩";
const tprime = "‴";
const trade = "™";
const TRADE = "™";
const triangle = "▵";
const triangledown = "▿";
const triangleleft = "◃";
const trianglelefteq = "⊴";
const triangleq = "≜";
const triangleright = "▹";
const trianglerighteq = "⊵";
const tridot = "◬";
const trie = "≜";
const triminus = "⨺";
const TripleDot = "⃛";
const triplus = "⨹";
const trisb = "⧍";
const tritime = "⨻";
const trpezium = "⏢";
const Tscr = "𝒯";
const tscr = "𝓉";
const TScy = "Ц";
const tscy = "ц";
const TSHcy = "Ћ";
const tshcy = "ћ";
const Tstrok = "Ŧ";
const tstrok = "ŧ";
const twixt = "≬";
const twoheadleftarrow = "↞";
const twoheadrightarrow = "↠";
const Uacute$1 = "Ú";
const uacute$1 = "ú";
const uarr = "↑";
const Uarr = "↟";
const uArr = "⇑";
const Uarrocir = "⥉";
const Ubrcy = "Ў";
const ubrcy = "ў";
const Ubreve = "Ŭ";
const ubreve = "ŭ";
const Ucirc$1 = "Û";
const ucirc$1 = "û";
const Ucy = "У";
const ucy = "у";
const udarr = "⇅";
const Udblac = "Ű";
const udblac = "ű";
const udhar = "⥮";
const ufisht = "⥾";
const Ufr = "𝔘";
const ufr = "𝔲";
const Ugrave$1 = "Ù";
const ugrave$1 = "ù";
const uHar = "⥣";
const uharl = "↿";
const uharr = "↾";
const uhblk = "▀";
const ulcorn = "⌜";
const ulcorner = "⌜";
const ulcrop = "⌏";
const ultri = "◸";
const Umacr = "Ū";
const umacr = "ū";
const uml$1 = "¨";
const UnderBar = "_";
const UnderBrace = "⏟";
const UnderBracket = "⎵";
const UnderParenthesis = "⏝";
const Union = "⋃";
const UnionPlus = "⊎";
const Uogon = "Ų";
const uogon = "ų";
const Uopf = "𝕌";
const uopf = "𝕦";
const UpArrowBar = "⤒";
const uparrow = "↑";
const UpArrow = "↑";
const Uparrow = "⇑";
const UpArrowDownArrow = "⇅";
const updownarrow = "↕";
const UpDownArrow = "↕";
const Updownarrow = "⇕";
const UpEquilibrium = "⥮";
const upharpoonleft = "↿";
const upharpoonright = "↾";
const uplus = "⊎";
const UpperLeftArrow = "↖";
const UpperRightArrow = "↗";
const upsi = "υ";
const Upsi = "ϒ";
const upsih = "ϒ";
const Upsilon = "Υ";
const upsilon = "υ";
const UpTeeArrow = "↥";
const UpTee = "⊥";
const upuparrows = "⇈";
const urcorn = "⌝";
const urcorner = "⌝";
const urcrop = "⌎";
const Uring = "Ů";
const uring = "ů";
const urtri = "◹";
const Uscr = "𝒰";
const uscr = "𝓊";
const utdot = "⋰";
const Utilde = "Ũ";
const utilde = "ũ";
const utri = "▵";
const utrif = "▴";
const uuarr = "⇈";
const Uuml$1 = "Ü";
const uuml$1 = "ü";
const uwangle = "⦧";
const vangrt = "⦜";
const varepsilon = "ϵ";
const varkappa = "ϰ";
const varnothing = "∅";
const varphi = "ϕ";
const varpi = "ϖ";
const varpropto = "∝";
const varr = "↕";
const vArr = "⇕";
const varrho = "ϱ";
const varsigma = "ς";
const varsubsetneq = "⊊︀";
const varsubsetneqq = "⫋︀";
const varsupsetneq = "⊋︀";
const varsupsetneqq = "⫌︀";
const vartheta = "ϑ";
const vartriangleleft = "⊲";
const vartriangleright = "⊳";
const vBar = "⫨";
const Vbar = "⫫";
const vBarv = "⫩";
const Vcy = "В";
const vcy = "в";
const vdash = "⊢";
const vDash = "⊨";
const Vdash = "⊩";
const VDash = "⊫";
const Vdashl = "⫦";
const veebar = "⊻";
const vee = "∨";
const Vee = "⋁";
const veeeq = "≚";
const vellip = "⋮";
const verbar = "|";
const Verbar = "‖";
const vert = "|";
const Vert = "‖";
const VerticalBar = "∣";
const VerticalLine = "|";
const VerticalSeparator = "❘";
const VerticalTilde = "≀";
const VeryThinSpace = " ";
const Vfr = "𝔙";
const vfr = "𝔳";
const vltri = "⊲";
const vnsub = "⊂⃒";
const vnsup = "⊃⃒";
const Vopf = "𝕍";
const vopf = "𝕧";
const vprop = "∝";
const vrtri = "⊳";
const Vscr = "𝒱";
const vscr = "𝓋";
const vsubnE = "⫋︀";
const vsubne = "⊊︀";
const vsupnE = "⫌︀";
const vsupne = "⊋︀";
const Vvdash = "⊪";
const vzigzag = "⦚";
const Wcirc = "Ŵ";
const wcirc = "ŵ";
const wedbar = "⩟";
const wedge = "∧";
const Wedge = "⋀";
const wedgeq = "≙";
const weierp = "℘";
const Wfr = "𝔚";
const wfr = "𝔴";
const Wopf = "𝕎";
const wopf = "𝕨";
const wp = "℘";
const wr = "≀";
const wreath = "≀";
const Wscr = "𝒲";
const wscr = "𝓌";
const xcap = "⋂";
const xcirc = "◯";
const xcup = "⋃";
const xdtri = "▽";
const Xfr = "𝔛";
const xfr = "𝔵";
const xharr = "⟷";
const xhArr = "⟺";
const Xi = "Ξ";
const xi = "ξ";
const xlarr = "⟵";
const xlArr = "⟸";
const xmap = "⟼";
const xnis = "⋻";
const xodot = "⨀";
const Xopf = "𝕏";
const xopf = "𝕩";
const xoplus = "⨁";
const xotime = "⨂";
const xrarr = "⟶";
const xrArr = "⟹";
const Xscr = "𝒳";
const xscr = "𝓍";
const xsqcup = "⨆";
const xuplus = "⨄";
const xutri = "△";
const xvee = "⋁";
const xwedge = "⋀";
const Yacute$1 = "Ý";
const yacute$1 = "ý";
const YAcy = "Я";
const yacy = "я";
const Ycirc = "Ŷ";
const ycirc = "ŷ";
const Ycy = "Ы";
const ycy = "ы";
const yen$1 = "¥";
const Yfr = "𝔜";
const yfr = "𝔶";
const YIcy = "Ї";
const yicy = "ї";
const Yopf = "𝕐";
const yopf = "𝕪";
const Yscr = "𝒴";
const yscr = "𝓎";
const YUcy = "Ю";
const yucy = "ю";
const yuml$1 = "ÿ";
const Yuml = "Ÿ";
const Zacute = "Ź";
const zacute = "ź";
const Zcaron = "Ž";
const zcaron = "ž";
const Zcy = "З";
const zcy = "з";
const Zdot = "Ż";
const zdot = "ż";
const zeetrf = "ℨ";
const ZeroWidthSpace = "​";
const Zeta = "Ζ";
const zeta = "ζ";
const zfr = "𝔷";
const Zfr = "ℨ";
const ZHcy = "Ж";
const zhcy = "ж";
const zigrarr = "⇝";
const zopf = "𝕫";
const Zopf = "ℤ";
const Zscr = "𝒵";
const zscr = "𝓏";
const zwj = "‍";
const zwnj = "‌";
var require$$1$1 = {
	Aacute: Aacute$1,
	aacute: aacute$1,
	Abreve: Abreve,
	abreve: abreve,
	ac: ac,
	acd: acd,
	acE: acE,
	Acirc: Acirc$1,
	acirc: acirc$1,
	acute: acute$1,
	Acy: Acy,
	acy: acy,
	AElig: AElig$1,
	aelig: aelig$1,
	af: af,
	Afr: Afr,
	afr: afr,
	Agrave: Agrave$1,
	agrave: agrave$1,
	alefsym: alefsym,
	aleph: aleph,
	Alpha: Alpha,
	alpha: alpha,
	Amacr: Amacr,
	amacr: amacr,
	amalg: amalg,
	amp: amp$2,
	AMP: AMP$1,
	andand: andand,
	And: And,
	and: and,
	andd: andd,
	andslope: andslope,
	andv: andv,
	ang: ang,
	ange: ange,
	angle: angle,
	angmsdaa: angmsdaa,
	angmsdab: angmsdab,
	angmsdac: angmsdac,
	angmsdad: angmsdad,
	angmsdae: angmsdae,
	angmsdaf: angmsdaf,
	angmsdag: angmsdag,
	angmsdah: angmsdah,
	angmsd: angmsd,
	angrt: angrt,
	angrtvb: angrtvb,
	angrtvbd: angrtvbd,
	angsph: angsph,
	angst: angst,
	angzarr: angzarr,
	Aogon: Aogon,
	aogon: aogon,
	Aopf: Aopf,
	aopf: aopf,
	apacir: apacir,
	ap: ap,
	apE: apE,
	ape: ape,
	apid: apid,
	apos: apos$1,
	ApplyFunction: ApplyFunction,
	approx: approx,
	approxeq: approxeq,
	Aring: Aring$1,
	aring: aring$1,
	Ascr: Ascr,
	ascr: ascr,
	Assign: Assign,
	ast: ast,
	asymp: asymp,
	asympeq: asympeq,
	Atilde: Atilde$1,
	atilde: atilde$1,
	Auml: Auml$1,
	auml: auml$1,
	awconint: awconint,
	awint: awint,
	backcong: backcong,
	backepsilon: backepsilon,
	backprime: backprime,
	backsim: backsim,
	backsimeq: backsimeq,
	Backslash: Backslash,
	Barv: Barv,
	barvee: barvee,
	barwed: barwed,
	Barwed: Barwed,
	barwedge: barwedge,
	bbrk: bbrk,
	bbrktbrk: bbrktbrk,
	bcong: bcong,
	Bcy: Bcy,
	bcy: bcy,
	bdquo: bdquo,
	becaus: becaus,
	because: because,
	Because: Because,
	bemptyv: bemptyv,
	bepsi: bepsi,
	bernou: bernou,
	Bernoullis: Bernoullis,
	Beta: Beta,
	beta: beta,
	beth: beth,
	between: between,
	Bfr: Bfr,
	bfr: bfr,
	bigcap: bigcap,
	bigcirc: bigcirc,
	bigcup: bigcup,
	bigodot: bigodot,
	bigoplus: bigoplus,
	bigotimes: bigotimes,
	bigsqcup: bigsqcup,
	bigstar: bigstar,
	bigtriangledown: bigtriangledown,
	bigtriangleup: bigtriangleup,
	biguplus: biguplus,
	bigvee: bigvee,
	bigwedge: bigwedge,
	bkarow: bkarow,
	blacklozenge: blacklozenge,
	blacksquare: blacksquare,
	blacktriangle: blacktriangle,
	blacktriangledown: blacktriangledown,
	blacktriangleleft: blacktriangleleft,
	blacktriangleright: blacktriangleright,
	blank: blank,
	blk12: blk12,
	blk14: blk14,
	blk34: blk34,
	block: block,
	bne: bne,
	bnequiv: bnequiv,
	bNot: bNot,
	bnot: bnot,
	Bopf: Bopf,
	bopf: bopf,
	bot: bot,
	bottom: bottom,
	bowtie: bowtie,
	boxbox: boxbox,
	boxdl: boxdl,
	boxdL: boxdL,
	boxDl: boxDl,
	boxDL: boxDL,
	boxdr: boxdr,
	boxdR: boxdR,
	boxDr: boxDr,
	boxDR: boxDR,
	boxh: boxh,
	boxH: boxH,
	boxhd: boxhd,
	boxHd: boxHd,
	boxhD: boxhD,
	boxHD: boxHD,
	boxhu: boxhu,
	boxHu: boxHu,
	boxhU: boxhU,
	boxHU: boxHU,
	boxminus: boxminus,
	boxplus: boxplus,
	boxtimes: boxtimes,
	boxul: boxul,
	boxuL: boxuL,
	boxUl: boxUl,
	boxUL: boxUL,
	boxur: boxur,
	boxuR: boxuR,
	boxUr: boxUr,
	boxUR: boxUR,
	boxv: boxv,
	boxV: boxV,
	boxvh: boxvh,
	boxvH: boxvH,
	boxVh: boxVh,
	boxVH: boxVH,
	boxvl: boxvl,
	boxvL: boxvL,
	boxVl: boxVl,
	boxVL: boxVL,
	boxvr: boxvr,
	boxvR: boxvR,
	boxVr: boxVr,
	boxVR: boxVR,
	bprime: bprime,
	breve: breve,
	Breve: Breve,
	brvbar: brvbar$1,
	bscr: bscr,
	Bscr: Bscr,
	bsemi: bsemi,
	bsim: bsim,
	bsime: bsime,
	bsolb: bsolb,
	bsol: bsol,
	bsolhsub: bsolhsub,
	bull: bull,
	bullet: bullet,
	bump: bump,
	bumpE: bumpE,
	bumpe: bumpe,
	Bumpeq: Bumpeq,
	bumpeq: bumpeq,
	Cacute: Cacute,
	cacute: cacute,
	capand: capand,
	capbrcup: capbrcup,
	capcap: capcap,
	cap: cap,
	Cap: Cap,
	capcup: capcup,
	capdot: capdot,
	CapitalDifferentialD: CapitalDifferentialD,
	caps: caps,
	caret: caret,
	caron: caron,
	Cayleys: Cayleys,
	ccaps: ccaps,
	Ccaron: Ccaron,
	ccaron: ccaron,
	Ccedil: Ccedil$1,
	ccedil: ccedil$1,
	Ccirc: Ccirc,
	ccirc: ccirc,
	Cconint: Cconint,
	ccups: ccups,
	ccupssm: ccupssm,
	Cdot: Cdot,
	cdot: cdot,
	cedil: cedil$1,
	Cedilla: Cedilla,
	cemptyv: cemptyv,
	cent: cent$1,
	centerdot: centerdot,
	CenterDot: CenterDot,
	cfr: cfr,
	Cfr: Cfr,
	CHcy: CHcy,
	chcy: chcy,
	check: check,
	checkmark: checkmark,
	Chi: Chi,
	chi: chi,
	circ: circ,
	circeq: circeq,
	circlearrowleft: circlearrowleft,
	circlearrowright: circlearrowright,
	circledast: circledast,
	circledcirc: circledcirc,
	circleddash: circleddash,
	CircleDot: CircleDot,
	circledR: circledR,
	circledS: circledS,
	CircleMinus: CircleMinus,
	CirclePlus: CirclePlus,
	CircleTimes: CircleTimes,
	cir: cir,
	cirE: cirE,
	cire: cire,
	cirfnint: cirfnint,
	cirmid: cirmid,
	cirscir: cirscir,
	ClockwiseContourIntegral: ClockwiseContourIntegral,
	CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
	CloseCurlyQuote: CloseCurlyQuote,
	clubs: clubs,
	clubsuit: clubsuit,
	colon: colon,
	Colon: Colon,
	Colone: Colone,
	colone: colone,
	coloneq: coloneq,
	comma: comma,
	commat: commat,
	comp: comp,
	compfn: compfn,
	complement: complement,
	complexes: complexes,
	cong: cong,
	congdot: congdot,
	Congruent: Congruent,
	conint: conint,
	Conint: Conint,
	ContourIntegral: ContourIntegral,
	copf: copf,
	Copf: Copf,
	coprod: coprod,
	Coproduct: Coproduct,
	copy: copy$1,
	COPY: COPY$1,
	copysr: copysr,
	CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
	crarr: crarr,
	cross: cross,
	Cross: Cross,
	Cscr: Cscr,
	cscr: cscr,
	csub: csub,
	csube: csube,
	csup: csup,
	csupe: csupe,
	ctdot: ctdot,
	cudarrl: cudarrl,
	cudarrr: cudarrr,
	cuepr: cuepr,
	cuesc: cuesc,
	cularr: cularr,
	cularrp: cularrp,
	cupbrcap: cupbrcap,
	cupcap: cupcap,
	CupCap: CupCap,
	cup: cup,
	Cup: Cup,
	cupcup: cupcup,
	cupdot: cupdot,
	cupor: cupor,
	cups: cups,
	curarr: curarr,
	curarrm: curarrm,
	curlyeqprec: curlyeqprec,
	curlyeqsucc: curlyeqsucc,
	curlyvee: curlyvee,
	curlywedge: curlywedge,
	curren: curren$1,
	curvearrowleft: curvearrowleft,
	curvearrowright: curvearrowright,
	cuvee: cuvee,
	cuwed: cuwed,
	cwconint: cwconint,
	cwint: cwint,
	cylcty: cylcty,
	dagger: dagger,
	Dagger: Dagger,
	daleth: daleth,
	darr: darr,
	Darr: Darr,
	dArr: dArr,
	dash: dash,
	Dashv: Dashv,
	dashv: dashv,
	dbkarow: dbkarow,
	dblac: dblac,
	Dcaron: Dcaron,
	dcaron: dcaron,
	Dcy: Dcy,
	dcy: dcy,
	ddagger: ddagger,
	ddarr: ddarr,
	DD: DD,
	dd: dd,
	DDotrahd: DDotrahd,
	ddotseq: ddotseq,
	deg: deg$1,
	Del: Del,
	Delta: Delta,
	delta: delta,
	demptyv: demptyv,
	dfisht: dfisht,
	Dfr: Dfr,
	dfr: dfr,
	dHar: dHar,
	dharl: dharl,
	dharr: dharr,
	DiacriticalAcute: DiacriticalAcute,
	DiacriticalDot: DiacriticalDot,
	DiacriticalDoubleAcute: DiacriticalDoubleAcute,
	DiacriticalGrave: DiacriticalGrave,
	DiacriticalTilde: DiacriticalTilde,
	diam: diam,
	diamond: diamond,
	Diamond: Diamond,
	diamondsuit: diamondsuit,
	diams: diams,
	die: die,
	DifferentialD: DifferentialD,
	digamma: digamma,
	disin: disin,
	div: div,
	divide: divide$1,
	divideontimes: divideontimes,
	divonx: divonx,
	DJcy: DJcy,
	djcy: djcy,
	dlcorn: dlcorn,
	dlcrop: dlcrop,
	dollar: dollar,
	Dopf: Dopf,
	dopf: dopf,
	Dot: Dot,
	dot: dot,
	DotDot: DotDot,
	doteq: doteq,
	doteqdot: doteqdot,
	DotEqual: DotEqual,
	dotminus: dotminus,
	dotplus: dotplus,
	dotsquare: dotsquare,
	doublebarwedge: doublebarwedge,
	DoubleContourIntegral: DoubleContourIntegral,
	DoubleDot: DoubleDot,
	DoubleDownArrow: DoubleDownArrow,
	DoubleLeftArrow: DoubleLeftArrow,
	DoubleLeftRightArrow: DoubleLeftRightArrow,
	DoubleLeftTee: DoubleLeftTee,
	DoubleLongLeftArrow: DoubleLongLeftArrow,
	DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
	DoubleLongRightArrow: DoubleLongRightArrow,
	DoubleRightArrow: DoubleRightArrow,
	DoubleRightTee: DoubleRightTee,
	DoubleUpArrow: DoubleUpArrow,
	DoubleUpDownArrow: DoubleUpDownArrow,
	DoubleVerticalBar: DoubleVerticalBar,
	DownArrowBar: DownArrowBar,
	downarrow: downarrow,
	DownArrow: DownArrow,
	Downarrow: Downarrow,
	DownArrowUpArrow: DownArrowUpArrow,
	DownBreve: DownBreve,
	downdownarrows: downdownarrows,
	downharpoonleft: downharpoonleft,
	downharpoonright: downharpoonright,
	DownLeftRightVector: DownLeftRightVector,
	DownLeftTeeVector: DownLeftTeeVector,
	DownLeftVectorBar: DownLeftVectorBar,
	DownLeftVector: DownLeftVector,
	DownRightTeeVector: DownRightTeeVector,
	DownRightVectorBar: DownRightVectorBar,
	DownRightVector: DownRightVector,
	DownTeeArrow: DownTeeArrow,
	DownTee: DownTee,
	drbkarow: drbkarow,
	drcorn: drcorn,
	drcrop: drcrop,
	Dscr: Dscr,
	dscr: dscr,
	DScy: DScy,
	dscy: dscy,
	dsol: dsol,
	Dstrok: Dstrok,
	dstrok: dstrok,
	dtdot: dtdot,
	dtri: dtri,
	dtrif: dtrif,
	duarr: duarr,
	duhar: duhar,
	dwangle: dwangle,
	DZcy: DZcy,
	dzcy: dzcy,
	dzigrarr: dzigrarr,
	Eacute: Eacute$1,
	eacute: eacute$1,
	easter: easter,
	Ecaron: Ecaron,
	ecaron: ecaron,
	Ecirc: Ecirc$1,
	ecirc: ecirc$1,
	ecir: ecir,
	ecolon: ecolon,
	Ecy: Ecy,
	ecy: ecy,
	eDDot: eDDot,
	Edot: Edot,
	edot: edot,
	eDot: eDot,
	ee: ee,
	efDot: efDot,
	Efr: Efr,
	efr: efr,
	eg: eg,
	Egrave: Egrave$1,
	egrave: egrave$1,
	egs: egs,
	egsdot: egsdot,
	el: el,
	Element: Element,
	elinters: elinters,
	ell: ell,
	els: els,
	elsdot: elsdot,
	Emacr: Emacr,
	emacr: emacr,
	empty: empty,
	emptyset: emptyset,
	EmptySmallSquare: EmptySmallSquare,
	emptyv: emptyv,
	EmptyVerySmallSquare: EmptyVerySmallSquare,
	emsp13: emsp13,
	emsp14: emsp14,
	emsp: emsp,
	ENG: ENG,
	eng: eng,
	ensp: ensp,
	Eogon: Eogon,
	eogon: eogon,
	Eopf: Eopf,
	eopf: eopf,
	epar: epar,
	eparsl: eparsl,
	eplus: eplus,
	epsi: epsi,
	Epsilon: Epsilon,
	epsilon: epsilon,
	epsiv: epsiv,
	eqcirc: eqcirc,
	eqcolon: eqcolon,
	eqsim: eqsim,
	eqslantgtr: eqslantgtr,
	eqslantless: eqslantless,
	Equal: Equal,
	equals: equals,
	EqualTilde: EqualTilde,
	equest: equest,
	Equilibrium: Equilibrium,
	equiv: equiv,
	equivDD: equivDD,
	eqvparsl: eqvparsl,
	erarr: erarr,
	erDot: erDot,
	escr: escr,
	Escr: Escr,
	esdot: esdot,
	Esim: Esim,
	esim: esim,
	Eta: Eta,
	eta: eta,
	ETH: ETH$1,
	eth: eth$1,
	Euml: Euml$1,
	euml: euml$1,
	euro: euro,
	excl: excl,
	exist: exist,
	Exists: Exists,
	expectation: expectation,
	exponentiale: exponentiale,
	ExponentialE: ExponentialE,
	fallingdotseq: fallingdotseq,
	Fcy: Fcy,
	fcy: fcy,
	female: female,
	ffilig: ffilig,
	fflig: fflig,
	ffllig: ffllig,
	Ffr: Ffr,
	ffr: ffr,
	filig: filig,
	FilledSmallSquare: FilledSmallSquare,
	FilledVerySmallSquare: FilledVerySmallSquare,
	fjlig: fjlig,
	flat: flat,
	fllig: fllig,
	fltns: fltns,
	fnof: fnof,
	Fopf: Fopf,
	fopf: fopf,
	forall: forall,
	ForAll: ForAll,
	fork: fork,
	forkv: forkv,
	Fouriertrf: Fouriertrf,
	fpartint: fpartint,
	frac12: frac12$1,
	frac13: frac13,
	frac14: frac14$1,
	frac15: frac15,
	frac16: frac16,
	frac18: frac18,
	frac23: frac23,
	frac25: frac25,
	frac34: frac34$1,
	frac35: frac35,
	frac38: frac38,
	frac45: frac45,
	frac56: frac56,
	frac58: frac58,
	frac78: frac78,
	frasl: frasl,
	frown: frown,
	fscr: fscr,
	Fscr: Fscr,
	gacute: gacute,
	Gamma: Gamma,
	gamma: gamma,
	Gammad: Gammad,
	gammad: gammad,
	gap: gap,
	Gbreve: Gbreve,
	gbreve: gbreve,
	Gcedil: Gcedil,
	Gcirc: Gcirc,
	gcirc: gcirc,
	Gcy: Gcy,
	gcy: gcy,
	Gdot: Gdot,
	gdot: gdot,
	ge: ge,
	gE: gE,
	gEl: gEl,
	gel: gel,
	geq: geq,
	geqq: geqq,
	geqslant: geqslant,
	gescc: gescc,
	ges: ges,
	gesdot: gesdot,
	gesdoto: gesdoto,
	gesdotol: gesdotol,
	gesl: gesl,
	gesles: gesles,
	Gfr: Gfr,
	gfr: gfr,
	gg: gg,
	Gg: Gg,
	ggg: ggg,
	gimel: gimel,
	GJcy: GJcy,
	gjcy: gjcy,
	gla: gla,
	gl: gl,
	glE: glE,
	glj: glj,
	gnap: gnap,
	gnapprox: gnapprox,
	gne: gne,
	gnE: gnE,
	gneq: gneq,
	gneqq: gneqq,
	gnsim: gnsim,
	Gopf: Gopf,
	gopf: gopf,
	grave: grave,
	GreaterEqual: GreaterEqual,
	GreaterEqualLess: GreaterEqualLess,
	GreaterFullEqual: GreaterFullEqual,
	GreaterGreater: GreaterGreater,
	GreaterLess: GreaterLess,
	GreaterSlantEqual: GreaterSlantEqual,
	GreaterTilde: GreaterTilde,
	Gscr: Gscr,
	gscr: gscr,
	gsim: gsim,
	gsime: gsime,
	gsiml: gsiml,
	gtcc: gtcc,
	gtcir: gtcir,
	gt: gt$2,
	GT: GT$1,
	Gt: Gt,
	gtdot: gtdot,
	gtlPar: gtlPar,
	gtquest: gtquest,
	gtrapprox: gtrapprox,
	gtrarr: gtrarr,
	gtrdot: gtrdot,
	gtreqless: gtreqless,
	gtreqqless: gtreqqless,
	gtrless: gtrless,
	gtrsim: gtrsim,
	gvertneqq: gvertneqq,
	gvnE: gvnE,
	Hacek: Hacek,
	hairsp: hairsp,
	half: half,
	hamilt: hamilt,
	HARDcy: HARDcy,
	hardcy: hardcy,
	harrcir: harrcir,
	harr: harr,
	hArr: hArr,
	harrw: harrw,
	Hat: Hat,
	hbar: hbar,
	Hcirc: Hcirc,
	hcirc: hcirc,
	hearts: hearts,
	heartsuit: heartsuit,
	hellip: hellip,
	hercon: hercon,
	hfr: hfr,
	Hfr: Hfr,
	HilbertSpace: HilbertSpace,
	hksearow: hksearow,
	hkswarow: hkswarow,
	hoarr: hoarr,
	homtht: homtht,
	hookleftarrow: hookleftarrow,
	hookrightarrow: hookrightarrow,
	hopf: hopf,
	Hopf: Hopf,
	horbar: horbar,
	HorizontalLine: HorizontalLine,
	hscr: hscr,
	Hscr: Hscr,
	hslash: hslash,
	Hstrok: Hstrok,
	hstrok: hstrok,
	HumpDownHump: HumpDownHump,
	HumpEqual: HumpEqual,
	hybull: hybull,
	hyphen: hyphen,
	Iacute: Iacute$1,
	iacute: iacute$1,
	ic: ic,
	Icirc: Icirc$1,
	icirc: icirc$1,
	Icy: Icy,
	icy: icy,
	Idot: Idot,
	IEcy: IEcy,
	iecy: iecy,
	iexcl: iexcl$1,
	iff: iff,
	ifr: ifr,
	Ifr: Ifr,
	Igrave: Igrave$1,
	igrave: igrave$1,
	ii: ii,
	iiiint: iiiint,
	iiint: iiint,
	iinfin: iinfin,
	iiota: iiota,
	IJlig: IJlig,
	ijlig: ijlig,
	Imacr: Imacr,
	imacr: imacr,
	image: image$1,
	ImaginaryI: ImaginaryI,
	imagline: imagline,
	imagpart: imagpart,
	imath: imath,
	Im: Im,
	imof: imof,
	imped: imped,
	Implies: Implies,
	incare: incare,
	"in": "∈",
	infin: infin,
	infintie: infintie,
	inodot: inodot,
	intcal: intcal,
	int: int,
	Int: Int,
	integers: integers,
	Integral: Integral,
	intercal: intercal,
	Intersection: Intersection,
	intlarhk: intlarhk,
	intprod: intprod,
	InvisibleComma: InvisibleComma,
	InvisibleTimes: InvisibleTimes,
	IOcy: IOcy,
	iocy: iocy,
	Iogon: Iogon,
	iogon: iogon,
	Iopf: Iopf,
	iopf: iopf,
	Iota: Iota,
	iota: iota,
	iprod: iprod,
	iquest: iquest$1,
	iscr: iscr,
	Iscr: Iscr,
	isin: isin,
	isindot: isindot,
	isinE: isinE,
	isins: isins,
	isinsv: isinsv,
	isinv: isinv,
	it: it,
	Itilde: Itilde,
	itilde: itilde,
	Iukcy: Iukcy,
	iukcy: iukcy,
	Iuml: Iuml$1,
	iuml: iuml$1,
	Jcirc: Jcirc,
	jcirc: jcirc,
	Jcy: Jcy,
	jcy: jcy,
	Jfr: Jfr,
	jfr: jfr,
	jmath: jmath,
	Jopf: Jopf,
	jopf: jopf,
	Jscr: Jscr,
	jscr: jscr,
	Jsercy: Jsercy,
	jsercy: jsercy,
	Jukcy: Jukcy,
	jukcy: jukcy,
	Kappa: Kappa,
	kappa: kappa,
	kappav: kappav,
	Kcedil: Kcedil,
	kcedil: kcedil,
	Kcy: Kcy,
	kcy: kcy,
	Kfr: Kfr,
	kfr: kfr,
	kgreen: kgreen,
	KHcy: KHcy,
	khcy: khcy,
	KJcy: KJcy,
	kjcy: kjcy,
	Kopf: Kopf,
	kopf: kopf,
	Kscr: Kscr,
	kscr: kscr,
	lAarr: lAarr,
	Lacute: Lacute,
	lacute: lacute,
	laemptyv: laemptyv,
	lagran: lagran,
	Lambda: Lambda,
	lambda: lambda,
	lang: lang,
	Lang: Lang,
	langd: langd,
	langle: langle,
	lap: lap,
	Laplacetrf: Laplacetrf,
	laquo: laquo$1,
	larrb: larrb,
	larrbfs: larrbfs,
	larr: larr,
	Larr: Larr,
	lArr: lArr,
	larrfs: larrfs,
	larrhk: larrhk,
	larrlp: larrlp,
	larrpl: larrpl,
	larrsim: larrsim,
	larrtl: larrtl,
	latail: latail,
	lAtail: lAtail,
	lat: lat,
	late: late,
	lates: lates,
	lbarr: lbarr,
	lBarr: lBarr,
	lbbrk: lbbrk,
	lbrace: lbrace,
	lbrack: lbrack,
	lbrke: lbrke,
	lbrksld: lbrksld,
	lbrkslu: lbrkslu,
	Lcaron: Lcaron,
	lcaron: lcaron,
	Lcedil: Lcedil,
	lcedil: lcedil,
	lceil: lceil,
	lcub: lcub,
	Lcy: Lcy,
	lcy: lcy,
	ldca: ldca,
	ldquo: ldquo,
	ldquor: ldquor,
	ldrdhar: ldrdhar,
	ldrushar: ldrushar,
	ldsh: ldsh,
	le: le,
	lE: lE,
	LeftAngleBracket: LeftAngleBracket,
	LeftArrowBar: LeftArrowBar,
	leftarrow: leftarrow,
	LeftArrow: LeftArrow,
	Leftarrow: Leftarrow,
	LeftArrowRightArrow: LeftArrowRightArrow,
	leftarrowtail: leftarrowtail,
	LeftCeiling: LeftCeiling,
	LeftDoubleBracket: LeftDoubleBracket,
	LeftDownTeeVector: LeftDownTeeVector,
	LeftDownVectorBar: LeftDownVectorBar,
	LeftDownVector: LeftDownVector,
	LeftFloor: LeftFloor,
	leftharpoondown: leftharpoondown,
	leftharpoonup: leftharpoonup,
	leftleftarrows: leftleftarrows,
	leftrightarrow: leftrightarrow,
	LeftRightArrow: LeftRightArrow,
	Leftrightarrow: Leftrightarrow,
	leftrightarrows: leftrightarrows,
	leftrightharpoons: leftrightharpoons,
	leftrightsquigarrow: leftrightsquigarrow,
	LeftRightVector: LeftRightVector,
	LeftTeeArrow: LeftTeeArrow,
	LeftTee: LeftTee,
	LeftTeeVector: LeftTeeVector,
	leftthreetimes: leftthreetimes,
	LeftTriangleBar: LeftTriangleBar,
	LeftTriangle: LeftTriangle,
	LeftTriangleEqual: LeftTriangleEqual,
	LeftUpDownVector: LeftUpDownVector,
	LeftUpTeeVector: LeftUpTeeVector,
	LeftUpVectorBar: LeftUpVectorBar,
	LeftUpVector: LeftUpVector,
	LeftVectorBar: LeftVectorBar,
	LeftVector: LeftVector,
	lEg: lEg,
	leg: leg,
	leq: leq,
	leqq: leqq,
	leqslant: leqslant,
	lescc: lescc,
	les: les,
	lesdot: lesdot,
	lesdoto: lesdoto,
	lesdotor: lesdotor,
	lesg: lesg,
	lesges: lesges,
	lessapprox: lessapprox,
	lessdot: lessdot,
	lesseqgtr: lesseqgtr,
	lesseqqgtr: lesseqqgtr,
	LessEqualGreater: LessEqualGreater,
	LessFullEqual: LessFullEqual,
	LessGreater: LessGreater,
	lessgtr: lessgtr,
	LessLess: LessLess,
	lesssim: lesssim,
	LessSlantEqual: LessSlantEqual,
	LessTilde: LessTilde,
	lfisht: lfisht,
	lfloor: lfloor,
	Lfr: Lfr,
	lfr: lfr,
	lg: lg,
	lgE: lgE,
	lHar: lHar,
	lhard: lhard,
	lharu: lharu,
	lharul: lharul,
	lhblk: lhblk,
	LJcy: LJcy,
	ljcy: ljcy,
	llarr: llarr,
	ll: ll,
	Ll: Ll,
	llcorner: llcorner,
	Lleftarrow: Lleftarrow,
	llhard: llhard,
	lltri: lltri,
	Lmidot: Lmidot,
	lmidot: lmidot,
	lmoustache: lmoustache,
	lmoust: lmoust,
	lnap: lnap,
	lnapprox: lnapprox,
	lne: lne,
	lnE: lnE,
	lneq: lneq,
	lneqq: lneqq,
	lnsim: lnsim,
	loang: loang,
	loarr: loarr,
	lobrk: lobrk,
	longleftarrow: longleftarrow,
	LongLeftArrow: LongLeftArrow,
	Longleftarrow: Longleftarrow,
	longleftrightarrow: longleftrightarrow,
	LongLeftRightArrow: LongLeftRightArrow,
	Longleftrightarrow: Longleftrightarrow,
	longmapsto: longmapsto,
	longrightarrow: longrightarrow,
	LongRightArrow: LongRightArrow,
	Longrightarrow: Longrightarrow,
	looparrowleft: looparrowleft,
	looparrowright: looparrowright,
	lopar: lopar,
	Lopf: Lopf,
	lopf: lopf,
	loplus: loplus,
	lotimes: lotimes,
	lowast: lowast,
	lowbar: lowbar,
	LowerLeftArrow: LowerLeftArrow,
	LowerRightArrow: LowerRightArrow,
	loz: loz,
	lozenge: lozenge,
	lozf: lozf,
	lpar: lpar,
	lparlt: lparlt,
	lrarr: lrarr,
	lrcorner: lrcorner,
	lrhar: lrhar,
	lrhard: lrhard,
	lrm: lrm,
	lrtri: lrtri,
	lsaquo: lsaquo,
	lscr: lscr,
	Lscr: Lscr,
	lsh: lsh,
	Lsh: Lsh,
	lsim: lsim,
	lsime: lsime,
	lsimg: lsimg,
	lsqb: lsqb,
	lsquo: lsquo,
	lsquor: lsquor,
	Lstrok: Lstrok,
	lstrok: lstrok,
	ltcc: ltcc,
	ltcir: ltcir,
	lt: lt$2,
	LT: LT$1,
	Lt: Lt,
	ltdot: ltdot,
	lthree: lthree,
	ltimes: ltimes,
	ltlarr: ltlarr,
	ltquest: ltquest,
	ltri: ltri,
	ltrie: ltrie,
	ltrif: ltrif,
	ltrPar: ltrPar,
	lurdshar: lurdshar,
	luruhar: luruhar,
	lvertneqq: lvertneqq,
	lvnE: lvnE,
	macr: macr$1,
	male: male,
	malt: malt,
	maltese: maltese,
	"Map": "⤅",
	map: map,
	mapsto: mapsto,
	mapstodown: mapstodown,
	mapstoleft: mapstoleft,
	mapstoup: mapstoup,
	marker: marker,
	mcomma: mcomma,
	Mcy: Mcy,
	mcy: mcy,
	mdash: mdash,
	mDDot: mDDot,
	measuredangle: measuredangle,
	MediumSpace: MediumSpace,
	Mellintrf: Mellintrf,
	Mfr: Mfr,
	mfr: mfr,
	mho: mho,
	micro: micro$1,
	midast: midast,
	midcir: midcir,
	mid: mid,
	middot: middot$1,
	minusb: minusb,
	minus: minus,
	minusd: minusd,
	minusdu: minusdu,
	MinusPlus: MinusPlus,
	mlcp: mlcp,
	mldr: mldr,
	mnplus: mnplus,
	models: models,
	Mopf: Mopf,
	mopf: mopf,
	mp: mp,
	mscr: mscr,
	Mscr: Mscr,
	mstpos: mstpos,
	Mu: Mu,
	mu: mu,
	multimap: multimap,
	mumap: mumap,
	nabla: nabla,
	Nacute: Nacute,
	nacute: nacute,
	nang: nang,
	nap: nap,
	napE: napE,
	napid: napid,
	napos: napos,
	napprox: napprox,
	natural: natural,
	naturals: naturals,
	natur: natur,
	nbsp: nbsp$1,
	nbump: nbump,
	nbumpe: nbumpe,
	ncap: ncap,
	Ncaron: Ncaron,
	ncaron: ncaron,
	Ncedil: Ncedil,
	ncedil: ncedil,
	ncong: ncong,
	ncongdot: ncongdot,
	ncup: ncup,
	Ncy: Ncy,
	ncy: ncy,
	ndash: ndash,
	nearhk: nearhk,
	nearr: nearr,
	neArr: neArr,
	nearrow: nearrow,
	ne: ne,
	nedot: nedot,
	NegativeMediumSpace: NegativeMediumSpace,
	NegativeThickSpace: NegativeThickSpace,
	NegativeThinSpace: NegativeThinSpace,
	NegativeVeryThinSpace: NegativeVeryThinSpace,
	nequiv: nequiv,
	nesear: nesear,
	nesim: nesim,
	NestedGreaterGreater: NestedGreaterGreater,
	NestedLessLess: NestedLessLess,
	NewLine: NewLine,
	nexist: nexist,
	nexists: nexists,
	Nfr: Nfr,
	nfr: nfr,
	ngE: ngE,
	nge: nge,
	ngeq: ngeq,
	ngeqq: ngeqq,
	ngeqslant: ngeqslant,
	nges: nges,
	nGg: nGg,
	ngsim: ngsim,
	nGt: nGt,
	ngt: ngt,
	ngtr: ngtr,
	nGtv: nGtv,
	nharr: nharr,
	nhArr: nhArr,
	nhpar: nhpar,
	ni: ni,
	nis: nis,
	nisd: nisd,
	niv: niv,
	NJcy: NJcy,
	njcy: njcy,
	nlarr: nlarr,
	nlArr: nlArr,
	nldr: nldr,
	nlE: nlE,
	nle: nle,
	nleftarrow: nleftarrow,
	nLeftarrow: nLeftarrow,
	nleftrightarrow: nleftrightarrow,
	nLeftrightarrow: nLeftrightarrow,
	nleq: nleq,
	nleqq: nleqq,
	nleqslant: nleqslant,
	nles: nles,
	nless: nless,
	nLl: nLl,
	nlsim: nlsim,
	nLt: nLt,
	nlt: nlt,
	nltri: nltri,
	nltrie: nltrie,
	nLtv: nLtv,
	nmid: nmid,
	NoBreak: NoBreak,
	NonBreakingSpace: NonBreakingSpace,
	nopf: nopf,
	Nopf: Nopf,
	Not: Not,
	not: not$1,
	NotCongruent: NotCongruent,
	NotCupCap: NotCupCap,
	NotDoubleVerticalBar: NotDoubleVerticalBar,
	NotElement: NotElement,
	NotEqual: NotEqual,
	NotEqualTilde: NotEqualTilde,
	NotExists: NotExists,
	NotGreater: NotGreater,
	NotGreaterEqual: NotGreaterEqual,
	NotGreaterFullEqual: NotGreaterFullEqual,
	NotGreaterGreater: NotGreaterGreater,
	NotGreaterLess: NotGreaterLess,
	NotGreaterSlantEqual: NotGreaterSlantEqual,
	NotGreaterTilde: NotGreaterTilde,
	NotHumpDownHump: NotHumpDownHump,
	NotHumpEqual: NotHumpEqual,
	notin: notin,
	notindot: notindot,
	notinE: notinE,
	notinva: notinva,
	notinvb: notinvb,
	notinvc: notinvc,
	NotLeftTriangleBar: NotLeftTriangleBar,
	NotLeftTriangle: NotLeftTriangle,
	NotLeftTriangleEqual: NotLeftTriangleEqual,
	NotLess: NotLess,
	NotLessEqual: NotLessEqual,
	NotLessGreater: NotLessGreater,
	NotLessLess: NotLessLess,
	NotLessSlantEqual: NotLessSlantEqual,
	NotLessTilde: NotLessTilde,
	NotNestedGreaterGreater: NotNestedGreaterGreater,
	NotNestedLessLess: NotNestedLessLess,
	notni: notni,
	notniva: notniva,
	notnivb: notnivb,
	notnivc: notnivc,
	NotPrecedes: NotPrecedes,
	NotPrecedesEqual: NotPrecedesEqual,
	NotPrecedesSlantEqual: NotPrecedesSlantEqual,
	NotReverseElement: NotReverseElement,
	NotRightTriangleBar: NotRightTriangleBar,
	NotRightTriangle: NotRightTriangle,
	NotRightTriangleEqual: NotRightTriangleEqual,
	NotSquareSubset: NotSquareSubset,
	NotSquareSubsetEqual: NotSquareSubsetEqual,
	NotSquareSuperset: NotSquareSuperset,
	NotSquareSupersetEqual: NotSquareSupersetEqual,
	NotSubset: NotSubset,
	NotSubsetEqual: NotSubsetEqual,
	NotSucceeds: NotSucceeds,
	NotSucceedsEqual: NotSucceedsEqual,
	NotSucceedsSlantEqual: NotSucceedsSlantEqual,
	NotSucceedsTilde: NotSucceedsTilde,
	NotSuperset: NotSuperset,
	NotSupersetEqual: NotSupersetEqual,
	NotTilde: NotTilde,
	NotTildeEqual: NotTildeEqual,
	NotTildeFullEqual: NotTildeFullEqual,
	NotTildeTilde: NotTildeTilde,
	NotVerticalBar: NotVerticalBar,
	nparallel: nparallel,
	npar: npar,
	nparsl: nparsl,
	npart: npart,
	npolint: npolint,
	npr: npr,
	nprcue: nprcue,
	nprec: nprec,
	npreceq: npreceq,
	npre: npre,
	nrarrc: nrarrc,
	nrarr: nrarr,
	nrArr: nrArr,
	nrarrw: nrarrw,
	nrightarrow: nrightarrow,
	nRightarrow: nRightarrow,
	nrtri: nrtri,
	nrtrie: nrtrie,
	nsc: nsc,
	nsccue: nsccue,
	nsce: nsce,
	Nscr: Nscr,
	nscr: nscr,
	nshortmid: nshortmid,
	nshortparallel: nshortparallel,
	nsim: nsim,
	nsime: nsime,
	nsimeq: nsimeq,
	nsmid: nsmid,
	nspar: nspar,
	nsqsube: nsqsube,
	nsqsupe: nsqsupe,
	nsub: nsub,
	nsubE: nsubE,
	nsube: nsube,
	nsubset: nsubset,
	nsubseteq: nsubseteq,
	nsubseteqq: nsubseteqq,
	nsucc: nsucc,
	nsucceq: nsucceq,
	nsup: nsup,
	nsupE: nsupE,
	nsupe: nsupe,
	nsupset: nsupset,
	nsupseteq: nsupseteq,
	nsupseteqq: nsupseteqq,
	ntgl: ntgl,
	Ntilde: Ntilde$1,
	ntilde: ntilde$1,
	ntlg: ntlg,
	ntriangleleft: ntriangleleft,
	ntrianglelefteq: ntrianglelefteq,
	ntriangleright: ntriangleright,
	ntrianglerighteq: ntrianglerighteq,
	Nu: Nu,
	nu: nu,
	num: num,
	numero: numero,
	numsp: numsp,
	nvap: nvap,
	nvdash: nvdash,
	nvDash: nvDash,
	nVdash: nVdash,
	nVDash: nVDash,
	nvge: nvge,
	nvgt: nvgt,
	nvHarr: nvHarr,
	nvinfin: nvinfin,
	nvlArr: nvlArr,
	nvle: nvle,
	nvlt: nvlt,
	nvltrie: nvltrie,
	nvrArr: nvrArr,
	nvrtrie: nvrtrie,
	nvsim: nvsim,
	nwarhk: nwarhk,
	nwarr: nwarr,
	nwArr: nwArr,
	nwarrow: nwarrow,
	nwnear: nwnear,
	Oacute: Oacute$1,
	oacute: oacute$1,
	oast: oast,
	Ocirc: Ocirc$1,
	ocirc: ocirc$1,
	ocir: ocir,
	Ocy: Ocy,
	ocy: ocy,
	odash: odash,
	Odblac: Odblac,
	odblac: odblac,
	odiv: odiv,
	odot: odot,
	odsold: odsold,
	OElig: OElig,
	oelig: oelig,
	ofcir: ofcir,
	Ofr: Ofr,
	ofr: ofr,
	ogon: ogon,
	Ograve: Ograve$1,
	ograve: ograve$1,
	ogt: ogt,
	ohbar: ohbar,
	ohm: ohm,
	oint: oint,
	olarr: olarr,
	olcir: olcir,
	olcross: olcross,
	oline: oline,
	olt: olt,
	Omacr: Omacr,
	omacr: omacr,
	Omega: Omega,
	omega: omega,
	Omicron: Omicron,
	omicron: omicron,
	omid: omid,
	ominus: ominus,
	Oopf: Oopf,
	oopf: oopf,
	opar: opar,
	OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
	OpenCurlyQuote: OpenCurlyQuote,
	operp: operp,
	oplus: oplus,
	orarr: orarr,
	Or: Or,
	or: or,
	ord: ord,
	order: order,
	orderof: orderof,
	ordf: ordf$1,
	ordm: ordm$1,
	origof: origof,
	oror: oror,
	orslope: orslope,
	orv: orv,
	oS: oS,
	Oscr: Oscr,
	oscr: oscr,
	Oslash: Oslash$1,
	oslash: oslash$1,
	osol: osol,
	Otilde: Otilde$1,
	otilde: otilde$1,
	otimesas: otimesas,
	Otimes: Otimes,
	otimes: otimes,
	Ouml: Ouml$1,
	ouml: ouml$1,
	ovbar: ovbar,
	OverBar: OverBar,
	OverBrace: OverBrace,
	OverBracket: OverBracket,
	OverParenthesis: OverParenthesis,
	para: para$1,
	parallel: parallel,
	par: par,
	parsim: parsim,
	parsl: parsl,
	part: part,
	PartialD: PartialD,
	Pcy: Pcy,
	pcy: pcy,
	percnt: percnt,
	period: period,
	permil: permil,
	perp: perp,
	pertenk: pertenk,
	Pfr: Pfr,
	pfr: pfr,
	Phi: Phi,
	phi: phi,
	phiv: phiv,
	phmmat: phmmat,
	phone: phone,
	Pi: Pi,
	pi: pi,
	pitchfork: pitchfork,
	piv: piv,
	planck: planck,
	planckh: planckh,
	plankv: plankv,
	plusacir: plusacir,
	plusb: plusb,
	pluscir: pluscir,
	plus: plus,
	plusdo: plusdo,
	plusdu: plusdu,
	pluse: pluse,
	PlusMinus: PlusMinus,
	plusmn: plusmn$1,
	plussim: plussim,
	plustwo: plustwo,
	pm: pm,
	Poincareplane: Poincareplane,
	pointint: pointint,
	popf: popf,
	Popf: Popf,
	pound: pound$1,
	prap: prap,
	Pr: Pr,
	pr: pr,
	prcue: prcue,
	precapprox: precapprox,
	prec: prec,
	preccurlyeq: preccurlyeq,
	Precedes: Precedes,
	PrecedesEqual: PrecedesEqual,
	PrecedesSlantEqual: PrecedesSlantEqual,
	PrecedesTilde: PrecedesTilde,
	preceq: preceq,
	precnapprox: precnapprox,
	precneqq: precneqq,
	precnsim: precnsim,
	pre: pre,
	prE: prE,
	precsim: precsim,
	prime: prime,
	Prime: Prime,
	primes: primes,
	prnap: prnap,
	prnE: prnE,
	prnsim: prnsim,
	prod: prod,
	Product: Product,
	profalar: profalar,
	profline: profline,
	profsurf: profsurf,
	prop: prop,
	Proportional: Proportional,
	Proportion: Proportion,
	propto: propto,
	prsim: prsim,
	prurel: prurel,
	Pscr: Pscr,
	pscr: pscr,
	Psi: Psi,
	psi: psi,
	puncsp: puncsp,
	Qfr: Qfr,
	qfr: qfr,
	qint: qint,
	qopf: qopf,
	Qopf: Qopf,
	qprime: qprime,
	Qscr: Qscr,
	qscr: qscr,
	quaternions: quaternions,
	quatint: quatint,
	quest: quest,
	questeq: questeq,
	quot: quot$2,
	QUOT: QUOT$1,
	rAarr: rAarr,
	race: race,
	Racute: Racute,
	racute: racute,
	radic: radic,
	raemptyv: raemptyv,
	rang: rang,
	Rang: Rang,
	rangd: rangd,
	range: range,
	rangle: rangle,
	raquo: raquo$1,
	rarrap: rarrap,
	rarrb: rarrb,
	rarrbfs: rarrbfs,
	rarrc: rarrc,
	rarr: rarr,
	Rarr: Rarr,
	rArr: rArr,
	rarrfs: rarrfs,
	rarrhk: rarrhk,
	rarrlp: rarrlp,
	rarrpl: rarrpl,
	rarrsim: rarrsim,
	Rarrtl: Rarrtl,
	rarrtl: rarrtl,
	rarrw: rarrw,
	ratail: ratail,
	rAtail: rAtail,
	ratio: ratio,
	rationals: rationals,
	rbarr: rbarr,
	rBarr: rBarr,
	RBarr: RBarr,
	rbbrk: rbbrk,
	rbrace: rbrace,
	rbrack: rbrack,
	rbrke: rbrke,
	rbrksld: rbrksld,
	rbrkslu: rbrkslu,
	Rcaron: Rcaron,
	rcaron: rcaron,
	Rcedil: Rcedil,
	rcedil: rcedil,
	rceil: rceil,
	rcub: rcub,
	Rcy: Rcy,
	rcy: rcy,
	rdca: rdca,
	rdldhar: rdldhar,
	rdquo: rdquo,
	rdquor: rdquor,
	rdsh: rdsh,
	real: real,
	realine: realine,
	realpart: realpart,
	reals: reals,
	Re: Re,
	rect: rect,
	reg: reg$1,
	REG: REG$1,
	ReverseElement: ReverseElement,
	ReverseEquilibrium: ReverseEquilibrium,
	ReverseUpEquilibrium: ReverseUpEquilibrium,
	rfisht: rfisht,
	rfloor: rfloor,
	rfr: rfr,
	Rfr: Rfr,
	rHar: rHar,
	rhard: rhard,
	rharu: rharu,
	rharul: rharul,
	Rho: Rho,
	rho: rho,
	rhov: rhov,
	RightAngleBracket: RightAngleBracket,
	RightArrowBar: RightArrowBar,
	rightarrow: rightarrow,
	RightArrow: RightArrow,
	Rightarrow: Rightarrow,
	RightArrowLeftArrow: RightArrowLeftArrow,
	rightarrowtail: rightarrowtail,
	RightCeiling: RightCeiling,
	RightDoubleBracket: RightDoubleBracket,
	RightDownTeeVector: RightDownTeeVector,
	RightDownVectorBar: RightDownVectorBar,
	RightDownVector: RightDownVector,
	RightFloor: RightFloor,
	rightharpoondown: rightharpoondown,
	rightharpoonup: rightharpoonup,
	rightleftarrows: rightleftarrows,
	rightleftharpoons: rightleftharpoons,
	rightrightarrows: rightrightarrows,
	rightsquigarrow: rightsquigarrow,
	RightTeeArrow: RightTeeArrow,
	RightTee: RightTee,
	RightTeeVector: RightTeeVector,
	rightthreetimes: rightthreetimes,
	RightTriangleBar: RightTriangleBar,
	RightTriangle: RightTriangle,
	RightTriangleEqual: RightTriangleEqual,
	RightUpDownVector: RightUpDownVector,
	RightUpTeeVector: RightUpTeeVector,
	RightUpVectorBar: RightUpVectorBar,
	RightUpVector: RightUpVector,
	RightVectorBar: RightVectorBar,
	RightVector: RightVector,
	ring: ring,
	risingdotseq: risingdotseq,
	rlarr: rlarr,
	rlhar: rlhar,
	rlm: rlm,
	rmoustache: rmoustache,
	rmoust: rmoust,
	rnmid: rnmid,
	roang: roang,
	roarr: roarr,
	robrk: robrk,
	ropar: ropar,
	ropf: ropf,
	Ropf: Ropf,
	roplus: roplus,
	rotimes: rotimes,
	RoundImplies: RoundImplies,
	rpar: rpar,
	rpargt: rpargt,
	rppolint: rppolint,
	rrarr: rrarr,
	Rrightarrow: Rrightarrow,
	rsaquo: rsaquo,
	rscr: rscr,
	Rscr: Rscr,
	rsh: rsh,
	Rsh: Rsh,
	rsqb: rsqb,
	rsquo: rsquo,
	rsquor: rsquor,
	rthree: rthree,
	rtimes: rtimes,
	rtri: rtri,
	rtrie: rtrie,
	rtrif: rtrif,
	rtriltri: rtriltri,
	RuleDelayed: RuleDelayed,
	ruluhar: ruluhar,
	rx: rx,
	Sacute: Sacute,
	sacute: sacute,
	sbquo: sbquo,
	scap: scap,
	Scaron: Scaron,
	scaron: scaron,
	Sc: Sc,
	sc: sc,
	sccue: sccue,
	sce: sce,
	scE: scE,
	Scedil: Scedil,
	scedil: scedil,
	Scirc: Scirc,
	scirc: scirc,
	scnap: scnap,
	scnE: scnE,
	scnsim: scnsim,
	scpolint: scpolint,
	scsim: scsim,
	Scy: Scy,
	scy: scy,
	sdotb: sdotb,
	sdot: sdot,
	sdote: sdote,
	searhk: searhk,
	searr: searr,
	seArr: seArr,
	searrow: searrow,
	sect: sect$1,
	semi: semi,
	seswar: seswar,
	setminus: setminus,
	setmn: setmn,
	sext: sext,
	Sfr: Sfr,
	sfr: sfr,
	sfrown: sfrown,
	sharp: sharp,
	SHCHcy: SHCHcy,
	shchcy: shchcy,
	SHcy: SHcy,
	shcy: shcy,
	ShortDownArrow: ShortDownArrow,
	ShortLeftArrow: ShortLeftArrow,
	shortmid: shortmid,
	shortparallel: shortparallel,
	ShortRightArrow: ShortRightArrow,
	ShortUpArrow: ShortUpArrow,
	shy: shy$1,
	Sigma: Sigma,
	sigma: sigma,
	sigmaf: sigmaf,
	sigmav: sigmav,
	sim: sim,
	simdot: simdot,
	sime: sime,
	simeq: simeq,
	simg: simg,
	simgE: simgE,
	siml: siml,
	simlE: simlE,
	simne: simne,
	simplus: simplus,
	simrarr: simrarr,
	slarr: slarr,
	SmallCircle: SmallCircle,
	smallsetminus: smallsetminus,
	smashp: smashp,
	smeparsl: smeparsl,
	smid: smid,
	smile: smile,
	smt: smt,
	smte: smte,
	smtes: smtes,
	SOFTcy: SOFTcy,
	softcy: softcy,
	solbar: solbar,
	solb: solb,
	sol: sol,
	Sopf: Sopf,
	sopf: sopf,
	spades: spades,
	spadesuit: spadesuit,
	spar: spar,
	sqcap: sqcap,
	sqcaps: sqcaps,
	sqcup: sqcup,
	sqcups: sqcups,
	Sqrt: Sqrt,
	sqsub: sqsub,
	sqsube: sqsube,
	sqsubset: sqsubset,
	sqsubseteq: sqsubseteq,
	sqsup: sqsup,
	sqsupe: sqsupe,
	sqsupset: sqsupset,
	sqsupseteq: sqsupseteq,
	square: square,
	Square: Square,
	SquareIntersection: SquareIntersection,
	SquareSubset: SquareSubset,
	SquareSubsetEqual: SquareSubsetEqual,
	SquareSuperset: SquareSuperset,
	SquareSupersetEqual: SquareSupersetEqual,
	SquareUnion: SquareUnion,
	squarf: squarf,
	squ: squ,
	squf: squf,
	srarr: srarr,
	Sscr: Sscr,
	sscr: sscr,
	ssetmn: ssetmn,
	ssmile: ssmile,
	sstarf: sstarf,
	Star: Star,
	star: star,
	starf: starf,
	straightepsilon: straightepsilon,
	straightphi: straightphi,
	strns: strns,
	sub: sub,
	Sub: Sub,
	subdot: subdot,
	subE: subE,
	sube: sube,
	subedot: subedot,
	submult: submult,
	subnE: subnE,
	subne: subne,
	subplus: subplus,
	subrarr: subrarr,
	subset: subset,
	Subset: Subset,
	subseteq: subseteq,
	subseteqq: subseteqq,
	SubsetEqual: SubsetEqual,
	subsetneq: subsetneq,
	subsetneqq: subsetneqq,
	subsim: subsim,
	subsub: subsub,
	subsup: subsup,
	succapprox: succapprox,
	succ: succ,
	succcurlyeq: succcurlyeq,
	Succeeds: Succeeds,
	SucceedsEqual: SucceedsEqual,
	SucceedsSlantEqual: SucceedsSlantEqual,
	SucceedsTilde: SucceedsTilde,
	succeq: succeq,
	succnapprox: succnapprox,
	succneqq: succneqq,
	succnsim: succnsim,
	succsim: succsim,
	SuchThat: SuchThat,
	sum: sum,
	Sum: Sum,
	sung: sung,
	sup1: sup1$1,
	sup2: sup2$1,
	sup3: sup3$1,
	sup: sup,
	Sup: Sup,
	supdot: supdot,
	supdsub: supdsub,
	supE: supE,
	supe: supe,
	supedot: supedot,
	Superset: Superset,
	SupersetEqual: SupersetEqual,
	suphsol: suphsol,
	suphsub: suphsub,
	suplarr: suplarr,
	supmult: supmult,
	supnE: supnE,
	supne: supne,
	supplus: supplus,
	supset: supset,
	Supset: Supset,
	supseteq: supseteq,
	supseteqq: supseteqq,
	supsetneq: supsetneq,
	supsetneqq: supsetneqq,
	supsim: supsim,
	supsub: supsub,
	supsup: supsup,
	swarhk: swarhk,
	swarr: swarr,
	swArr: swArr,
	swarrow: swarrow,
	swnwar: swnwar,
	szlig: szlig$1,
	Tab: Tab,
	target: target,
	Tau: Tau,
	tau: tau,
	tbrk: tbrk,
	Tcaron: Tcaron,
	tcaron: tcaron,
	Tcedil: Tcedil,
	tcedil: tcedil,
	Tcy: Tcy,
	tcy: tcy,
	tdot: tdot,
	telrec: telrec,
	Tfr: Tfr,
	tfr: tfr,
	there4: there4,
	therefore: therefore,
	Therefore: Therefore,
	Theta: Theta,
	theta: theta,
	thetasym: thetasym,
	thetav: thetav,
	thickapprox: thickapprox,
	thicksim: thicksim,
	ThickSpace: ThickSpace,
	ThinSpace: ThinSpace,
	thinsp: thinsp,
	thkap: thkap,
	thksim: thksim,
	THORN: THORN$1,
	thorn: thorn$1,
	tilde: tilde,
	Tilde: Tilde,
	TildeEqual: TildeEqual,
	TildeFullEqual: TildeFullEqual,
	TildeTilde: TildeTilde,
	timesbar: timesbar,
	timesb: timesb,
	times: times$1,
	timesd: timesd,
	tint: tint,
	toea: toea,
	topbot: topbot,
	topcir: topcir,
	top: top,
	Topf: Topf,
	topf: topf,
	topfork: topfork,
	tosa: tosa,
	tprime: tprime,
	trade: trade,
	TRADE: TRADE,
	triangle: triangle,
	triangledown: triangledown,
	triangleleft: triangleleft,
	trianglelefteq: trianglelefteq,
	triangleq: triangleq,
	triangleright: triangleright,
	trianglerighteq: trianglerighteq,
	tridot: tridot,
	trie: trie,
	triminus: triminus,
	TripleDot: TripleDot,
	triplus: triplus,
	trisb: trisb,
	tritime: tritime,
	trpezium: trpezium,
	Tscr: Tscr,
	tscr: tscr,
	TScy: TScy,
	tscy: tscy,
	TSHcy: TSHcy,
	tshcy: tshcy,
	Tstrok: Tstrok,
	tstrok: tstrok,
	twixt: twixt,
	twoheadleftarrow: twoheadleftarrow,
	twoheadrightarrow: twoheadrightarrow,
	Uacute: Uacute$1,
	uacute: uacute$1,
	uarr: uarr,
	Uarr: Uarr,
	uArr: uArr,
	Uarrocir: Uarrocir,
	Ubrcy: Ubrcy,
	ubrcy: ubrcy,
	Ubreve: Ubreve,
	ubreve: ubreve,
	Ucirc: Ucirc$1,
	ucirc: ucirc$1,
	Ucy: Ucy,
	ucy: ucy,
	udarr: udarr,
	Udblac: Udblac,
	udblac: udblac,
	udhar: udhar,
	ufisht: ufisht,
	Ufr: Ufr,
	ufr: ufr,
	Ugrave: Ugrave$1,
	ugrave: ugrave$1,
	uHar: uHar,
	uharl: uharl,
	uharr: uharr,
	uhblk: uhblk,
	ulcorn: ulcorn,
	ulcorner: ulcorner,
	ulcrop: ulcrop,
	ultri: ultri,
	Umacr: Umacr,
	umacr: umacr,
	uml: uml$1,
	UnderBar: UnderBar,
	UnderBrace: UnderBrace,
	UnderBracket: UnderBracket,
	UnderParenthesis: UnderParenthesis,
	Union: Union,
	UnionPlus: UnionPlus,
	Uogon: Uogon,
	uogon: uogon,
	Uopf: Uopf,
	uopf: uopf,
	UpArrowBar: UpArrowBar,
	uparrow: uparrow,
	UpArrow: UpArrow,
	Uparrow: Uparrow,
	UpArrowDownArrow: UpArrowDownArrow,
	updownarrow: updownarrow,
	UpDownArrow: UpDownArrow,
	Updownarrow: Updownarrow,
	UpEquilibrium: UpEquilibrium,
	upharpoonleft: upharpoonleft,
	upharpoonright: upharpoonright,
	uplus: uplus,
	UpperLeftArrow: UpperLeftArrow,
	UpperRightArrow: UpperRightArrow,
	upsi: upsi,
	Upsi: Upsi,
	upsih: upsih,
	Upsilon: Upsilon,
	upsilon: upsilon,
	UpTeeArrow: UpTeeArrow,
	UpTee: UpTee,
	upuparrows: upuparrows,
	urcorn: urcorn,
	urcorner: urcorner,
	urcrop: urcrop,
	Uring: Uring,
	uring: uring,
	urtri: urtri,
	Uscr: Uscr,
	uscr: uscr,
	utdot: utdot,
	Utilde: Utilde,
	utilde: utilde,
	utri: utri,
	utrif: utrif,
	uuarr: uuarr,
	Uuml: Uuml$1,
	uuml: uuml$1,
	uwangle: uwangle,
	vangrt: vangrt,
	varepsilon: varepsilon,
	varkappa: varkappa,
	varnothing: varnothing,
	varphi: varphi,
	varpi: varpi,
	varpropto: varpropto,
	varr: varr,
	vArr: vArr,
	varrho: varrho,
	varsigma: varsigma,
	varsubsetneq: varsubsetneq,
	varsubsetneqq: varsubsetneqq,
	varsupsetneq: varsupsetneq,
	varsupsetneqq: varsupsetneqq,
	vartheta: vartheta,
	vartriangleleft: vartriangleleft,
	vartriangleright: vartriangleright,
	vBar: vBar,
	Vbar: Vbar,
	vBarv: vBarv,
	Vcy: Vcy,
	vcy: vcy,
	vdash: vdash,
	vDash: vDash,
	Vdash: Vdash,
	VDash: VDash,
	Vdashl: Vdashl,
	veebar: veebar,
	vee: vee,
	Vee: Vee,
	veeeq: veeeq,
	vellip: vellip,
	verbar: verbar,
	Verbar: Verbar,
	vert: vert,
	Vert: Vert,
	VerticalBar: VerticalBar,
	VerticalLine: VerticalLine,
	VerticalSeparator: VerticalSeparator,
	VerticalTilde: VerticalTilde,
	VeryThinSpace: VeryThinSpace,
	Vfr: Vfr,
	vfr: vfr,
	vltri: vltri,
	vnsub: vnsub,
	vnsup: vnsup,
	Vopf: Vopf,
	vopf: vopf,
	vprop: vprop,
	vrtri: vrtri,
	Vscr: Vscr,
	vscr: vscr,
	vsubnE: vsubnE,
	vsubne: vsubne,
	vsupnE: vsupnE,
	vsupne: vsupne,
	Vvdash: Vvdash,
	vzigzag: vzigzag,
	Wcirc: Wcirc,
	wcirc: wcirc,
	wedbar: wedbar,
	wedge: wedge,
	Wedge: Wedge,
	wedgeq: wedgeq,
	weierp: weierp,
	Wfr: Wfr,
	wfr: wfr,
	Wopf: Wopf,
	wopf: wopf,
	wp: wp,
	wr: wr,
	wreath: wreath,
	Wscr: Wscr,
	wscr: wscr,
	xcap: xcap,
	xcirc: xcirc,
	xcup: xcup,
	xdtri: xdtri,
	Xfr: Xfr,
	xfr: xfr,
	xharr: xharr,
	xhArr: xhArr,
	Xi: Xi,
	xi: xi,
	xlarr: xlarr,
	xlArr: xlArr,
	xmap: xmap,
	xnis: xnis,
	xodot: xodot,
	Xopf: Xopf,
	xopf: xopf,
	xoplus: xoplus,
	xotime: xotime,
	xrarr: xrarr,
	xrArr: xrArr,
	Xscr: Xscr,
	xscr: xscr,
	xsqcup: xsqcup,
	xuplus: xuplus,
	xutri: xutri,
	xvee: xvee,
	xwedge: xwedge,
	Yacute: Yacute$1,
	yacute: yacute$1,
	YAcy: YAcy,
	yacy: yacy,
	Ycirc: Ycirc,
	ycirc: ycirc,
	Ycy: Ycy,
	ycy: ycy,
	yen: yen$1,
	Yfr: Yfr,
	yfr: yfr,
	YIcy: YIcy,
	yicy: yicy,
	Yopf: Yopf,
	yopf: yopf,
	Yscr: Yscr,
	yscr: yscr,
	YUcy: YUcy,
	yucy: yucy,
	yuml: yuml$1,
	Yuml: Yuml,
	Zacute: Zacute,
	zacute: zacute,
	Zcaron: Zcaron,
	zcaron: zcaron,
	Zcy: Zcy,
	zcy: zcy,
	Zdot: Zdot,
	zdot: zdot,
	zeetrf: zeetrf,
	ZeroWidthSpace: ZeroWidthSpace,
	Zeta: Zeta,
	zeta: zeta,
	zfr: zfr,
	Zfr: Zfr,
	ZHcy: ZHcy,
	zhcy: zhcy,
	zigrarr: zigrarr,
	zopf: zopf,
	Zopf: Zopf,
	Zscr: Zscr,
	zscr: zscr,
	zwj: zwj,
	zwnj: zwnj
};

const Aacute = "Á";
const aacute = "á";
const Acirc = "Â";
const acirc = "â";
const acute = "´";
const AElig = "Æ";
const aelig = "æ";
const Agrave = "À";
const agrave = "à";
const amp$1 = "&";
const AMP = "&";
const Aring = "Å";
const aring = "å";
const Atilde = "Ã";
const atilde = "ã";
const Auml = "Ä";
const auml = "ä";
const brvbar = "¦";
const Ccedil = "Ç";
const ccedil = "ç";
const cedil = "¸";
const cent = "¢";
const copy = "©";
const COPY = "©";
const curren = "¤";
const deg = "°";
const divide = "÷";
const Eacute = "É";
const eacute = "é";
const Ecirc = "Ê";
const ecirc = "ê";
const Egrave = "È";
const egrave = "è";
const ETH = "Ð";
const eth = "ð";
const Euml = "Ë";
const euml = "ë";
const frac12 = "½";
const frac14 = "¼";
const frac34 = "¾";
const gt$1 = ">";
const GT = ">";
const Iacute = "Í";
const iacute = "í";
const Icirc = "Î";
const icirc = "î";
const iexcl = "¡";
const Igrave = "Ì";
const igrave = "ì";
const iquest = "¿";
const Iuml = "Ï";
const iuml = "ï";
const laquo = "«";
const lt$1 = "<";
const LT = "<";
const macr = "¯";
const micro = "µ";
const middot = "·";
const nbsp = " ";
const not = "¬";
const Ntilde = "Ñ";
const ntilde = "ñ";
const Oacute = "Ó";
const oacute = "ó";
const Ocirc = "Ô";
const ocirc = "ô";
const Ograve = "Ò";
const ograve = "ò";
const ordf = "ª";
const ordm = "º";
const Oslash = "Ø";
const oslash = "ø";
const Otilde = "Õ";
const otilde = "õ";
const Ouml = "Ö";
const ouml = "ö";
const para = "¶";
const plusmn = "±";
const pound = "£";
const quot$1 = "\"";
const QUOT = "\"";
const raquo = "»";
const reg = "®";
const REG = "®";
const sect = "§";
const shy = "­";
const sup1 = "¹";
const sup2 = "²";
const sup3 = "³";
const szlig = "ß";
const THORN = "Þ";
const thorn = "þ";
const times = "×";
const Uacute = "Ú";
const uacute = "ú";
const Ucirc = "Û";
const ucirc = "û";
const Ugrave = "Ù";
const ugrave = "ù";
const uml = "¨";
const Uuml = "Ü";
const uuml = "ü";
const Yacute = "Ý";
const yacute = "ý";
const yen = "¥";
const yuml = "ÿ";
var require$$1 = {
	Aacute: Aacute,
	aacute: aacute,
	Acirc: Acirc,
	acirc: acirc,
	acute: acute,
	AElig: AElig,
	aelig: aelig,
	Agrave: Agrave,
	agrave: agrave,
	amp: amp$1,
	AMP: AMP,
	Aring: Aring,
	aring: aring,
	Atilde: Atilde,
	atilde: atilde,
	Auml: Auml,
	auml: auml,
	brvbar: brvbar,
	Ccedil: Ccedil,
	ccedil: ccedil,
	cedil: cedil,
	cent: cent,
	copy: copy,
	COPY: COPY,
	curren: curren,
	deg: deg,
	divide: divide,
	Eacute: Eacute,
	eacute: eacute,
	Ecirc: Ecirc,
	ecirc: ecirc,
	Egrave: Egrave,
	egrave: egrave,
	ETH: ETH,
	eth: eth,
	Euml: Euml,
	euml: euml,
	frac12: frac12,
	frac14: frac14,
	frac34: frac34,
	gt: gt$1,
	GT: GT,
	Iacute: Iacute,
	iacute: iacute,
	Icirc: Icirc,
	icirc: icirc,
	iexcl: iexcl,
	Igrave: Igrave,
	igrave: igrave,
	iquest: iquest,
	Iuml: Iuml,
	iuml: iuml,
	laquo: laquo,
	lt: lt$1,
	LT: LT,
	macr: macr,
	micro: micro,
	middot: middot,
	nbsp: nbsp,
	not: not,
	Ntilde: Ntilde,
	ntilde: ntilde,
	Oacute: Oacute,
	oacute: oacute,
	Ocirc: Ocirc,
	ocirc: ocirc,
	Ograve: Ograve,
	ograve: ograve,
	ordf: ordf,
	ordm: ordm,
	Oslash: Oslash,
	oslash: oslash,
	Otilde: Otilde,
	otilde: otilde,
	Ouml: Ouml,
	ouml: ouml,
	para: para,
	plusmn: plusmn,
	pound: pound,
	quot: quot$1,
	QUOT: QUOT,
	raquo: raquo,
	reg: reg,
	REG: REG,
	sect: sect,
	shy: shy,
	sup1: sup1,
	sup2: sup2,
	sup3: sup3,
	szlig: szlig,
	THORN: THORN,
	thorn: thorn,
	times: times,
	Uacute: Uacute,
	uacute: uacute,
	Ucirc: Ucirc,
	ucirc: ucirc,
	Ugrave: Ugrave,
	ugrave: ugrave,
	uml: uml,
	Uuml: Uuml,
	uuml: uuml,
	Yacute: Yacute,
	yacute: yacute,
	yen: yen,
	yuml: yuml
};

const amp = "&";
const apos = "'";
const gt = ">";
const lt = "<";
const quot = "\"";
var require$$0$1 = {
	amp: amp,
	apos: apos,
	gt: gt,
	lt: lt,
	quot: quot
};

var require$$0 = {
	"0": 65533,
	"128": 8364,
	"130": 8218,
	"131": 402,
	"132": 8222,
	"133": 8230,
	"134": 8224,
	"135": 8225,
	"136": 710,
	"137": 8240,
	"138": 352,
	"139": 8249,
	"140": 338,
	"142": 381,
	"145": 8216,
	"146": 8217,
	"147": 8220,
	"148": 8221,
	"149": 8226,
	"150": 8211,
	"151": 8212,
	"152": 732,
	"153": 8482,
	"154": 353,
	"155": 8250,
	"156": 339,
	"158": 382,
	"159": 376
};

var decode_codepoint = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var decode_json_1 = __importDefault(require$$0);
// modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }
    if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
    }
    var output = "";
    if (codePoint > 0xffff) {
        codePoint -= 0x10000;
        output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
        codePoint = 0xdc00 | (codePoint & 0x3ff);
    }
    output += String.fromCharCode(codePoint);
    return output;
}
exports.default = decodeCodePoint;
});

var decode = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
var entities_json_1 = __importDefault(require$$1$1);
var legacy_json_1 = __importDefault(require$$1);
var xml_json_1 = __importDefault(require$$0$1);
var decode_codepoint_1 = __importDefault(decode_codepoint);
exports.decodeXML = getStrictDecoder(xml_json_1.default);
exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
function getStrictDecoder(map) {
    var keys = Object.keys(map).join("|");
    var replace = getReplacer(map);
    keys += "|#[xX][\\da-fA-F]+|#\\d+";
    var re = new RegExp("&(?:" + keys + ");", "g");
    return function (str) { return String(str).replace(re, replace); };
}
var sorter = function (a, b) { return (a < b ? 1 : -1); };
exports.decodeHTML = (function () {
    var legacy = Object.keys(legacy_json_1.default).sort(sorter);
    var keys = Object.keys(entities_json_1.default).sort(sorter);
    for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
        }
        else {
            keys[i] += ";";
        }
    }
    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
    var replace = getReplacer(entities_json_1.default);
    function replacer(str) {
        if (str.substr(-1) !== ";")
            str += ";";
        return replace(str);
    }
    //TODO consider creating a merged map
    return function (str) { return String(str).replace(re, replacer); };
})();
function getReplacer(map) {
    return function replace(str) {
        if (str.charAt(1) === "#") {
            var secondChar = str.charAt(2);
            if (secondChar === "X" || secondChar === "x") {
                return decode_codepoint_1.default(parseInt(str.substr(3), 16));
            }
            return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        return map[str.slice(1, -1)];
    };
}
});

var encode = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.encodeHTML = exports.encodeXML = void 0;
var xml_json_1 = __importDefault(require$$0$1);
var inverseXML = getInverseObj(xml_json_1.default);
var xmlReplacer = getInverseReplacer(inverseXML);
exports.encodeXML = getInverse(inverseXML, xmlReplacer);
var entities_json_1 = __importDefault(require$$1$1);
var inverseHTML = getInverseObj(entities_json_1.default);
var htmlReplacer = getInverseReplacer(inverseHTML);
exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
function getInverseObj(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function (inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
    }, {});
}
function getInverseReplacer(inverse) {
    var single = [];
    var multiple = [];
    for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
            // Add value to single array
            single.push("\\" + k);
        }
        else {
            // Add value to multiple array
            multiple.push(k);
        }
    }
    // Add ranges to single characters.
    single.sort();
    for (var start = 0; start < single.length - 1; start++) {
        // Find the end of a run of characters
        var end = start;
        while (end < single.length - 1 &&
            single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
            end += 1;
        }
        var count = 1 + end - start;
        // We want to replace at least three characters
        if (count < 3)
            continue;
        single.splice(start, count, single[start] + "-" + single[end]);
    }
    multiple.unshift("[" + single.join("") + "]");
    return new RegExp(multiple.join("|"), "g");
}
var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
function singleCharReplacer(c) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return "&#x" + c.codePointAt(0).toString(16).toUpperCase() + ";";
}
function getInverse(inverse, re) {
    return function (data) {
        return data
            .replace(re, function (name) { return inverse[name]; })
            .replace(reNonASCII, singleCharReplacer);
    };
}
var reXmlChars = getInverseReplacer(inverseXML);
function escape(data) {
    return data
        .replace(reXmlChars, singleCharReplacer)
        .replace(reNonASCII, singleCharReplacer);
}
exports.escape = escape;
});

var lib = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decodeStrict = exports.decode = void 0;


/**
 * Decodes a string with entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 */
function decode$1(data, level) {
    return (!level || level <= 0 ? decode.decodeXML : decode.decodeHTML)(data);
}
exports.decode = decode$1;
/**
 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 */
function decodeStrict(data, level) {
    return (!level || level <= 0 ? decode.decodeXML : decode.decodeHTMLStrict)(data);
}
exports.decodeStrict = decodeStrict;
/**
 * Encodes a string with entities.
 *
 * @param data String to encode.
 * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
 */
function encode$1(data, level) {
    return (!level || level <= 0 ? encode.encodeXML : encode.encodeHTML)(data);
}
exports.encode = encode$1;
var encode_2 = encode;
Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function () { return encode_2.encodeXML; } });
Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
Object.defineProperty(exports, "escape", { enumerable: true, get: function () { return encode_2.escape; } });
// Legacy aliases
Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
var decode_2 = decode;
Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function () { return decode_2.decodeXML; } });
Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
// Legacy aliases
Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function () { return decode_2.decodeXML; } });
});

var C_BACKSLASH$1 = 92;

var ENTITY$1 = "&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});";

var TAGNAME = "[A-Za-z][A-Za-z0-9-]*";
var ATTRIBUTENAME = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
var UNQUOTEDVALUE = "[^\"'=<>`\\x00-\\x20]+";
var SINGLEQUOTEDVALUE = "'[^']*'";
var DOUBLEQUOTEDVALUE = '"[^"]*"';
var ATTRIBUTEVALUE =
    "(?:" +
    UNQUOTEDVALUE +
    "|" +
    SINGLEQUOTEDVALUE +
    "|" +
    DOUBLEQUOTEDVALUE +
    ")";
var ATTRIBUTEVALUESPEC = "(?:" + "\\s*=" + "\\s*" + ATTRIBUTEVALUE + ")";
var ATTRIBUTE = "(?:" + "\\s+" + ATTRIBUTENAME + ATTRIBUTEVALUESPEC + "?)";
var OPENTAG = "<" + TAGNAME + ATTRIBUTE + "*" + "\\s*/?>";
var CLOSETAG = "</" + TAGNAME + "\\s*[>]";
var HTMLCOMMENT = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
var PROCESSINGINSTRUCTION = "[<][?][\\s\\S]*?[?][>]";
var DECLARATION = "<![A-Z]+" + "\\s+[^>]*>";
var CDATA = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
var HTMLTAG =
    "(?:" +
    OPENTAG +
    "|" +
    CLOSETAG +
    "|" +
    HTMLCOMMENT +
    "|" +
    PROCESSINGINSTRUCTION +
    "|" +
    DECLARATION +
    "|" +
    CDATA +
    ")";
var reHtmlTag$1 = new RegExp("^" + HTMLTAG);

var reBackslashOrAmp = /[\\&]/;

var ESCAPABLE$1 = "[!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]";

var reEntityOrEscapedChar = new RegExp("\\\\" + ESCAPABLE$1 + "|" + ENTITY$1, "gi");

var XMLSPECIAL = '[&<>"]';

var reXmlSpecial = new RegExp(XMLSPECIAL, "g");

var unescapeChar = function(s) {
    if (s.charCodeAt(0) === C_BACKSLASH$1) {
        return s.charAt(1);
    } else {
        return lib.decodeHTML(s);
    }
};

// Replace entities and backslash escapes with literal characters.
var unescapeString$1 = function(s) {
    if (reBackslashOrAmp.test(s)) {
        return s.replace(reEntityOrEscapedChar, unescapeChar);
    } else {
        return s;
    }
};

var normalizeURI$1 = function(uri) {
    try {
        return encode_1(uri);
    } catch (err) {
        return uri;
    }
};

var replaceUnsafeChar = function(s) {
    switch (s) {
        case "&":
            return "&amp;";
        case "<":
            return "&lt;";
        case ">":
            return "&gt;";
        case '"':
            return "&quot;";
        default:
            return s;
    }
};

var escapeXml = function(s) {
    if (reXmlSpecial.test(s)) {
        return s.replace(reXmlSpecial, replaceUnsafeChar);
    } else {
        return s;
    }
};

// derived from https://github.com/mathiasbynens/String.fromCodePoint
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */

var _fromCodePoint;

function fromCodePoint(_) {
    return _fromCodePoint(_);
}

if (String.fromCodePoint) {
    _fromCodePoint = function(_) {
        try {
            return String.fromCodePoint(_);
        } catch (e) {
            if (e instanceof RangeError) {
                return String.fromCharCode(0xfffd);
            }
            throw e;
        }
    };
} else {
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    _fromCodePoint = function() {
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var highSurrogate;
        var lowSurrogate;
        var index = -1;
        var length = arguments.length;
        if (!length) {
            return "";
        }
        var result = "";
        while (++index < length) {
            var codePoint = Number(arguments[index]);
            if (
                !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
                codePoint < 0 || // not a valid Unicode code point
                codePoint > 0x10ffff || // not a valid Unicode code point
                floor(codePoint) !== codePoint // not an integer
            ) {
                return String.fromCharCode(0xfffd);
            }
            if (codePoint <= 0xffff) {
                // BMP code point
                codeUnits.push(codePoint);
            } else {
                // Astral code point; split in surrogate halves
                // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint -= 0x10000;
                highSurrogate = (codePoint >> 10) + 0xd800;
                lowSurrogate = (codePoint % 0x400) + 0xdc00;
                codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result;
    };
}

/*! http://mths.be/repeat v0.2.0 by @mathias */
if (!String.prototype.repeat) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var repeat = function(count) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			// `ToInteger`
			var n = count ? Number(count) : 0;
			if (n != n) { // better `isNaN`
				n = 0;
			}
			// Account for out-of-bounds indices
			if (n < 0 || n == Infinity) {
				throw RangeError();
			}
			var result = '';
			while (n) {
				if (n % 2 == 1) {
					result += string;
				}
				if (n > 1) {
					string += string;
				}
				n >>= 1;
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'repeat', {
				'value': repeat,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.repeat = repeat;
		}
	}());
}

var normalizeURI = normalizeURI$1;
var unescapeString = unescapeString$1;

// Constants for character codes:

var C_NEWLINE$1 = 10;
var C_ASTERISK = 42;
var C_UNDERSCORE = 95;
var C_BACKTICK = 96;
var C_OPEN_BRACKET$1 = 91;
var C_CLOSE_BRACKET = 93;
var C_LESSTHAN$1 = 60;
var C_BANG = 33;
var C_BACKSLASH = 92;
var C_AMPERSAND = 38;
var C_OPEN_PAREN = 40;
var C_CLOSE_PAREN = 41;
var C_COLON = 58;
var C_SINGLEQUOTE = 39;
var C_DOUBLEQUOTE = 34;

// Some regexps used in inline parser:

var ESCAPABLE = ESCAPABLE$1;
var ESCAPED_CHAR = "\\\\" + ESCAPABLE;

var ENTITY = ENTITY$1;
var reHtmlTag = reHtmlTag$1;

var rePunctuation = new RegExp(
    /^[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/
);

var reLinkTitle = new RegExp(
    '^(?:"(' +
        ESCAPED_CHAR +
        '|[^"\\x00])*"' +
        "|" +
        "'(" +
        ESCAPED_CHAR +
        "|[^'\\x00])*'" +
        "|" +
        "\\((" +
        ESCAPED_CHAR +
        "|[^()\\x00])*\\))"
);

var reLinkDestinationBraces = /^(?:<(?:[^<>\n\\\x00]|\\.)*>)/;

var reEscapable = new RegExp("^" + ESCAPABLE);

var reEntityHere = new RegExp("^" + ENTITY, "i");

var reTicks = /`+/;

var reTicksHere = /^`+/;

var reEllipses = /\.\.\./g;

var reDash = /--+/g;

var reEmailAutolink = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;

var reAutolink = /^<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^<>\x00-\x20]*>/i;

var reSpnl = /^ *(?:\n *)?/;

var reWhitespaceChar = /^[ \t\n\x0b\x0c\x0d]/;

var reUnicodeWhitespaceChar = /^\s/;

var reFinalSpace = / *$/;

var reInitialSpace = /^ */;

var reSpaceAtEndOfLine = /^ *(?:\n|$)/;

var reLinkLabel = /^\[(?:[^\\\[\]]|\\.){0,1000}\]/s;

// Matches a string of non-special characters.
var reMain = /^[^\n`\[\]\\!<&*_'"]+/m;

var text$1 = function(s) {
    var node = new Node("text");
    node._literal = s;
    return node;
};

// normalize a reference in reference link (remove []s, trim,
// collapse internal space, unicode case fold.
// See commonmark/commonmark.js#168.
var normalizeReference = function(string) {
    return string
        .slice(1, string.length - 1)
        .trim()
        .replace(/[ \t\r\n]+/, " ")
        .toLowerCase()
        .toUpperCase();
};

// INLINE PARSER

// These are methods of an InlineParser object, defined below.
// An InlineParser keeps track of a subject (a string to be
// parsed) and a position in that subject.

// If re matches at current position in the subject, advance
// position in subject and return the match; otherwise return null.
var match = function(re) {
    var m = re.exec(this.subject.slice(this.pos));
    if (m === null) {
        return null;
    } else {
        this.pos += m.index + m[0].length;
        return m[0];
    }
};

// Returns the code for the character at the current subject position, or -1
// there are no more characters.
var peek$1 = function() {
    if (this.pos < this.subject.length) {
        return this.subject.charCodeAt(this.pos);
    } else {
        return -1;
    }
};

// Parse zero or more space characters, including at most one newline
var spnl = function() {
    this.match(reSpnl);
    return true;
};

// All of the parsers below try to match something at the current position
// in the subject.  If they succeed in matching anything, they
// return the inline matched, advancing the subject.

// Attempt to parse backticks, adding either a backtick code span or a
// literal sequence of backticks.
var parseBackticks = function(block) {
    var ticks = this.match(reTicksHere);
    if (ticks === null) {
        return false;
    }
    var afterOpenTicks = this.pos;
    var matched;
    var node;
    var contents;
    while ((matched = this.match(reTicks)) !== null) {
        if (matched === ticks) {
            node = new Node("code");
            contents = this.subject
                .slice(afterOpenTicks, this.pos - ticks.length)
                .replace(/\n/gm, " ");
            if (
                contents.length > 0 &&
                contents.match(/[^ ]/) !== null &&
                contents[0] == " " &&
                contents[contents.length - 1] == " "
            ) {
                node._literal = contents.slice(1, contents.length - 1);
            } else {
                node._literal = contents;
            }
            block.appendChild(node);
            return true;
        }
    }
    // If we got here, we didn't match a closing backtick sequence.
    this.pos = afterOpenTicks;
    block.appendChild(text$1(ticks));
    return true;
};

// Parse a backslash-escaped special character, adding either the escaped
// character, a hard line break (if the backslash is followed by a newline),
// or a literal backslash to the block's children.  Assumes current character
// is a backslash.
var parseBackslash = function(block) {
    var subj = this.subject;
    var node;
    this.pos += 1;
    if (this.peek() === C_NEWLINE$1) {
        this.pos += 1;
        node = new Node("linebreak");
        block.appendChild(node);
    } else if (reEscapable.test(subj.charAt(this.pos))) {
        block.appendChild(text$1(subj.charAt(this.pos)));
        this.pos += 1;
    } else {
        block.appendChild(text$1("\\"));
    }
    return true;
};

// Attempt to parse an autolink (URL or email in pointy brackets).
var parseAutolink = function(block) {
    var m;
    var dest;
    var node;
    if ((m = this.match(reEmailAutolink))) {
        dest = m.slice(1, m.length - 1);
        node = new Node("link");
        node._destination = normalizeURI("mailto:" + dest);
        node._title = "";
        node.appendChild(text$1(dest));
        block.appendChild(node);
        return true;
    } else if ((m = this.match(reAutolink))) {
        dest = m.slice(1, m.length - 1);
        node = new Node("link");
        node._destination = normalizeURI(dest);
        node._title = "";
        node.appendChild(text$1(dest));
        block.appendChild(node);
        return true;
    } else {
        return false;
    }
};

// Attempt to parse a raw HTML tag.
var parseHtmlTag = function(block) {
    var m = this.match(reHtmlTag);
    if (m === null) {
        return false;
    } else {
        var node = new Node("html_inline");
        node._literal = m;
        block.appendChild(node);
        return true;
    }
};

// Scan a sequence of characters with code cc, and return information about
// the number of delimiters and whether they are positioned such that
// they can open and/or close emphasis or strong emphasis.  A utility
// function for strong/emph parsing.
var scanDelims = function(cc) {
    var numdelims = 0;
    var char_before, char_after, cc_after;
    var startpos = this.pos;
    var left_flanking, right_flanking, can_open, can_close;
    var after_is_whitespace,
        after_is_punctuation,
        before_is_whitespace,
        before_is_punctuation;

    if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
        numdelims++;
        this.pos++;
    } else {
        while (this.peek() === cc) {
            numdelims++;
            this.pos++;
        }
    }

    if (numdelims === 0) {
        return null;
    }

    char_before = startpos === 0 ? "\n" : this.subject.charAt(startpos - 1);

    cc_after = this.peek();
    if (cc_after === -1) {
        char_after = "\n";
    } else {
        char_after = fromCodePoint(cc_after);
    }

    after_is_whitespace = reUnicodeWhitespaceChar.test(char_after);
    after_is_punctuation = rePunctuation.test(char_after);
    before_is_whitespace = reUnicodeWhitespaceChar.test(char_before);
    before_is_punctuation = rePunctuation.test(char_before);

    left_flanking =
        !after_is_whitespace &&
        (!after_is_punctuation ||
            before_is_whitespace ||
            before_is_punctuation);
    right_flanking =
        !before_is_whitespace &&
        (!before_is_punctuation || after_is_whitespace || after_is_punctuation);
    if (cc === C_UNDERSCORE) {
        can_open = left_flanking && (!right_flanking || before_is_punctuation);
        can_close = right_flanking && (!left_flanking || after_is_punctuation);
    } else if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
        can_open = left_flanking && !right_flanking;
        can_close = right_flanking;
    } else {
        can_open = left_flanking;
        can_close = right_flanking;
    }
    this.pos = startpos;
    return { numdelims: numdelims, can_open: can_open, can_close: can_close };
};

// Handle a delimiter marker for emphasis or a quote.
var handleDelim = function(cc, block) {
    var res = this.scanDelims(cc);
    if (!res) {
        return false;
    }
    var numdelims = res.numdelims;
    var startpos = this.pos;
    var contents;

    this.pos += numdelims;
    if (cc === C_SINGLEQUOTE) {
        contents = "\u2019";
    } else if (cc === C_DOUBLEQUOTE) {
        contents = "\u201C";
    } else {
        contents = this.subject.slice(startpos, this.pos);
    }
    var node = text$1(contents);
    block.appendChild(node);

    // Add entry to stack for this opener
    if (
        (res.can_open || res.can_close) &&
        (this.options.smart || (cc !== C_SINGLEQUOTE && cc !== C_DOUBLEQUOTE))
    ) {
        this.delimiters = {
            cc: cc,
            numdelims: numdelims,
            origdelims: numdelims,
            node: node,
            previous: this.delimiters,
            next: null,
            can_open: res.can_open,
            can_close: res.can_close
        };
        if (this.delimiters.previous !== null) {
            this.delimiters.previous.next = this.delimiters;
        }
    }

    return true;
};

var removeDelimiter = function(delim) {
    if (delim.previous !== null) {
        delim.previous.next = delim.next;
    }
    if (delim.next === null) {
        // top of stack
        this.delimiters = delim.previous;
    } else {
        delim.next.previous = delim.previous;
    }
};

var removeDelimitersBetween = function(bottom, top) {
    if (bottom.next !== top) {
        bottom.next = top;
        top.previous = bottom;
    }
};

var processEmphasis = function(stack_bottom) {
    var opener, closer, old_closer;
    var opener_inl, closer_inl;
    var tempstack;
    var use_delims;
    var tmp, next;
    var opener_found;
    var openers_bottom = [];
    var openers_bottom_index;
    var odd_match = false;

    for (var i = 0; i < 8; i++) {
        openers_bottom[i] = stack_bottom;
    }
    // find first closer above stack_bottom:
    closer = this.delimiters;
    while (closer !== null && closer.previous !== stack_bottom) {
        closer = closer.previous;
    }
    // move forward, looking for closers, and handling each
    while (closer !== null) {
        var closercc = closer.cc;
        if (!closer.can_close) {
            closer = closer.next;
        } else {
            // found emphasis closer. now look back for first matching opener:
            opener = closer.previous;
            opener_found = false;
            switch (closercc) {
               case C_SINGLEQUOTE:
                 openers_bottom_index = 0;
                 break;
               case C_DOUBLEQUOTE:
                 openers_bottom_index = 1;
                 break;
               case C_UNDERSCORE:
                 openers_bottom_index = 2;
                 break;
               case C_ASTERISK:
                 openers_bottom_index = 3 + (closer.can_open ? 3 : 0)
                                          + (closer.origdelims % 3);
                 break;
            }
            while (
                opener !== null &&
                opener !== stack_bottom &&
                opener !== openers_bottom[openers_bottom_index]
            ) {
                odd_match =
                    (closer.can_open || opener.can_close) &&
                    closer.origdelims % 3 !== 0 &&
                    (opener.origdelims + closer.origdelims) % 3 === 0;
                if (opener.cc === closer.cc && opener.can_open && !odd_match) {
                    opener_found = true;
                    break;
                }
                opener = opener.previous;
            }
            old_closer = closer;

            if (closercc === C_ASTERISK || closercc === C_UNDERSCORE) {
                if (!opener_found) {
                    closer = closer.next;
                } else {
                    // calculate actual number of delimiters used from closer
                    use_delims =
                        closer.numdelims >= 2 && opener.numdelims >= 2 ? 2 : 1;

                    opener_inl = opener.node;
                    closer_inl = closer.node;

                    // remove used delimiters from stack elts and inlines
                    opener.numdelims -= use_delims;
                    closer.numdelims -= use_delims;
                    opener_inl._literal = opener_inl._literal.slice(
                        0,
                        opener_inl._literal.length - use_delims
                    );
                    closer_inl._literal = closer_inl._literal.slice(
                        0,
                        closer_inl._literal.length - use_delims
                    );

                    // build contents for new emph element
                    var emph = new Node(use_delims === 1 ? "emph" : "strong");

                    tmp = opener_inl._next;
                    while (tmp && tmp !== closer_inl) {
                        next = tmp._next;
                        tmp.unlink();
                        emph.appendChild(tmp);
                        tmp = next;
                    }

                    opener_inl.insertAfter(emph);

                    // remove elts between opener and closer in delimiters stack
                    removeDelimitersBetween(opener, closer);

                    // if opener has 0 delims, remove it and the inline
                    if (opener.numdelims === 0) {
                        opener_inl.unlink();
                        this.removeDelimiter(opener);
                    }

                    if (closer.numdelims === 0) {
                        closer_inl.unlink();
                        tempstack = closer.next;
                        this.removeDelimiter(closer);
                        closer = tempstack;
                    }
                }
            } else if (closercc === C_SINGLEQUOTE) {
                closer.node._literal = "\u2019";
                if (opener_found) {
                    opener.node._literal = "\u2018";
                }
                closer = closer.next;
            } else if (closercc === C_DOUBLEQUOTE) {
                closer.node._literal = "\u201D";
                if (opener_found) {
                    opener.node.literal = "\u201C";
                }
                closer = closer.next;
            }
            if (!opener_found) {
                // Set lower bound for future searches for openers:
                openers_bottom[openers_bottom_index] =
                    old_closer.previous;
                if (!old_closer.can_open) {
                    // We can remove a closer that can't be an opener,
                    // once we've seen there's no matching opener:
                    this.removeDelimiter(old_closer);
                }
            }
        }
    }

    // remove all delimiters
    while (this.delimiters !== null && this.delimiters !== stack_bottom) {
        this.removeDelimiter(this.delimiters);
    }
};

// Attempt to parse link title (sans quotes), returning the string
// or null if no match.
var parseLinkTitle = function() {
    var title = this.match(reLinkTitle);
    if (title === null) {
        return null;
    } else {
        // chop off quotes from title and unescape:
        return unescapeString(title.substr(1, title.length - 2));
    }
};

// Attempt to parse link destination, returning the string or
// null if no match.
var parseLinkDestination = function() {
    var res = this.match(reLinkDestinationBraces);
    if (res === null) {
        if (this.peek() === C_LESSTHAN$1) {
            return null;
        }
        // TODO handrolled parser; res should be null or the string
        var savepos = this.pos;
        var openparens = 0;
        var c;
        while ((c = this.peek()) !== -1) {
            if (
                c === C_BACKSLASH &&
                reEscapable.test(this.subject.charAt(this.pos + 1))
            ) {
                this.pos += 1;
                if (this.peek() !== -1) {
                    this.pos += 1;
                }
            } else if (c === C_OPEN_PAREN) {
                this.pos += 1;
                openparens += 1;
            } else if (c === C_CLOSE_PAREN) {
                if (openparens < 1) {
                    break;
                } else {
                    this.pos += 1;
                    openparens -= 1;
                }
            } else if (reWhitespaceChar.exec(fromCodePoint(c)) !== null) {
                break;
            } else {
                this.pos += 1;
            }
        }
        if (this.pos === savepos && c !== C_CLOSE_PAREN) {
            return null;
        }
        if (openparens !== 0) {
            return null;
        }
        res = this.subject.substr(savepos, this.pos - savepos);
        return normalizeURI(unescapeString(res));
    } else {
        // chop off surrounding <..>:
        return normalizeURI(unescapeString(res.substr(1, res.length - 2)));
    }
};

// Attempt to parse a link label, returning number of characters parsed.
var parseLinkLabel = function() {
    var m = this.match(reLinkLabel);
    if (m === null || m.length > 1001) {
        return 0;
    } else {
        return m.length;
    }
};

// Add open bracket to delimiter stack and add a text node to block's children.
var parseOpenBracket = function(block) {
    var startpos = this.pos;
    this.pos += 1;

    var node = text$1("[");
    block.appendChild(node);

    // Add entry to stack for this opener
    this.addBracket(node, startpos, false);
    return true;
};

// IF next character is [, and ! delimiter to delimiter stack and
// add a text node to block's children.  Otherwise just add a text node.
var parseBang = function(block) {
    var startpos = this.pos;
    this.pos += 1;
    if (this.peek() === C_OPEN_BRACKET$1) {
        this.pos += 1;

        var node = text$1("![");
        block.appendChild(node);

        // Add entry to stack for this opener
        this.addBracket(node, startpos + 1, true);
    } else {
        block.appendChild(text$1("!"));
    }
    return true;
};

// Try to match close bracket against an opening in the delimiter
// stack.  Add either a link or image, or a plain [ character,
// to block's children.  If there is a matching delimiter,
// remove it from the delimiter stack.
var parseCloseBracket = function(block) {
    var startpos;
    var is_image;
    var dest;
    var title;
    var matched = false;
    var reflabel;
    var opener;

    this.pos += 1;
    startpos = this.pos;

    // get last [ or ![
    opener = this.brackets;

    if (opener === null) {
        // no matched opener, just return a literal
        block.appendChild(text$1("]"));
        return true;
    }

    if (!opener.active) {
        // no matched opener, just return a literal
        block.appendChild(text$1("]"));
        // take opener off brackets stack
        this.removeBracket();
        return true;
    }

    // If we got here, open is a potential opener
    is_image = opener.image;

    // Check to see if we have a link/image

    var savepos = this.pos;

    // Inline link?
    if (this.peek() === C_OPEN_PAREN) {
        this.pos++;
        if (
            this.spnl() &&
            (dest = this.parseLinkDestination()) !== null &&
            this.spnl() &&
            // make sure there's a space before the title:
            ((reWhitespaceChar.test(this.subject.charAt(this.pos - 1)) &&
                (title = this.parseLinkTitle())) ||
                true) &&
            this.spnl() &&
            this.peek() === C_CLOSE_PAREN
        ) {
            this.pos += 1;
            matched = true;
        } else {
            this.pos = savepos;
        }
    }

    if (!matched) {
        // Next, see if there's a link label
        var beforelabel = this.pos;
        var n = this.parseLinkLabel();
        if (n > 2) {
            reflabel = this.subject.slice(beforelabel, beforelabel + n);
        } else if (!opener.bracketAfter) {
            // Empty or missing second label means to use the first label as the reference.
            // The reference must not contain a bracket. If we know there's a bracket, we don't even bother checking it.
            reflabel = this.subject.slice(opener.index, startpos);
        }
        if (n === 0) {
            // If shortcut reference link, rewind before spaces we skipped.
            this.pos = savepos;
        }

        if (reflabel) {
            // lookup rawlabel in refmap
            var link = this.refmap[normalizeReference(reflabel)];
            if (link) {
                dest = link.destination;
                title = link.title;
                matched = true;
            }
        }
    }

    if (matched) {
        var node = new Node(is_image ? "image" : "link");
        node._destination = dest;
        node._title = title || "";

        var tmp, next;
        tmp = opener.node._next;
        while (tmp) {
            next = tmp._next;
            tmp.unlink();
            node.appendChild(tmp);
            tmp = next;
        }
        block.appendChild(node);
        this.processEmphasis(opener.previousDelimiter);
        this.removeBracket();
        opener.node.unlink();

        // We remove this bracket and processEmphasis will remove later delimiters.
        // Now, for a link, we also deactivate earlier link openers.
        // (no links in links)
        if (!is_image) {
            opener = this.brackets;
            while (opener !== null) {
                if (!opener.image) {
                    opener.active = false; // deactivate this opener
                }
                opener = opener.previous;
            }
        }

        return true;
    } else {
        // no match

        this.removeBracket(); // remove this opener from stack
        this.pos = startpos;
        block.appendChild(text$1("]"));
        return true;
    }
};

var addBracket = function(node, index, image) {
    if (this.brackets !== null) {
        this.brackets.bracketAfter = true;
    }
    this.brackets = {
        node: node,
        previous: this.brackets,
        previousDelimiter: this.delimiters,
        index: index,
        image: image,
        active: true
    };
};

var removeBracket = function() {
    this.brackets = this.brackets.previous;
};

// Attempt to parse an entity.
var parseEntity = function(block) {
    var m;
    if ((m = this.match(reEntityHere))) {
        block.appendChild(text$1(lib.decodeHTML(m)));
        return true;
    } else {
        return false;
    }
};

// Parse a run of ordinary characters, or a single character with
// a special meaning in markdown, as a plain string.
var parseString = function(block) {
    var m;
    if ((m = this.match(reMain))) {
        if (this.options.smart) {
            block.appendChild(
                text$1(
                    m
                        .replace(reEllipses, "\u2026")
                        .replace(reDash, function(chars) {
                            var enCount = 0;
                            var emCount = 0;
                            if (chars.length % 3 === 0) {
                                // If divisible by 3, use all em dashes
                                emCount = chars.length / 3;
                            } else if (chars.length % 2 === 0) {
                                // If divisible by 2, use all en dashes
                                enCount = chars.length / 2;
                            } else if (chars.length % 3 === 2) {
                                // If 2 extra dashes, use en dash for last 2; em dashes for rest
                                enCount = 1;
                                emCount = (chars.length - 2) / 3;
                            } else {
                                // Use en dashes for last 4 hyphens; em dashes for rest
                                enCount = 2;
                                emCount = (chars.length - 4) / 3;
                            }
                            return (
                                "\u2014".repeat(emCount) +
                                "\u2013".repeat(enCount)
                            );
                        })
                )
            );
        } else {
            block.appendChild(text$1(m));
        }
        return true;
    } else {
        return false;
    }
};

// Parse a newline.  If it was preceded by two spaces, return a hard
// line break; otherwise a soft line break.
var parseNewline = function(block) {
    this.pos += 1; // assume we're at a \n
    // check previous node for trailing spaces
    var lastc = block._lastChild;
    if (
        lastc &&
        lastc.type === "text" &&
        lastc._literal[lastc._literal.length - 1] === " "
    ) {
        var hardbreak = lastc._literal[lastc._literal.length - 2] === " ";
        lastc._literal = lastc._literal.replace(reFinalSpace, "");
        block.appendChild(new Node(hardbreak ? "linebreak" : "softbreak"));
    } else {
        block.appendChild(new Node("softbreak"));
    }
    this.match(reInitialSpace); // gobble leading spaces in next line
    return true;
};

// Attempt to parse a link reference, modifying refmap.
var parseReference = function(s, refmap) {
    this.subject = s;
    this.pos = 0;
    var rawlabel;
    var dest;
    var title;
    var matchChars;
    var startpos = this.pos;

    // label:
    matchChars = this.parseLinkLabel();
    if (matchChars === 0) {
        return 0;
    } else {
        rawlabel = this.subject.substr(0, matchChars);
    }

    // colon:
    if (this.peek() === C_COLON) {
        this.pos++;
    } else {
        this.pos = startpos;
        return 0;
    }

    //  link url
    this.spnl();

    dest = this.parseLinkDestination();
    if (dest === null) {
        this.pos = startpos;
        return 0;
    }

    var beforetitle = this.pos;
    this.spnl();
    if (this.pos !== beforetitle) {
        title = this.parseLinkTitle();
    }
    if (title === null) {
        title = "";
        // rewind before spaces
        this.pos = beforetitle;
    }

    // make sure we're at line end:
    var atLineEnd = true;
    if (this.match(reSpaceAtEndOfLine) === null) {
        if (title === "") {
            atLineEnd = false;
        } else {
            // the potential title we found is not at the line end,
            // but it could still be a legal link reference if we
            // discard the title
            title = "";
            // rewind before spaces
            this.pos = beforetitle;
            // and instead check if the link URL is at the line end
            atLineEnd = this.match(reSpaceAtEndOfLine) !== null;
        }
    }

    if (!atLineEnd) {
        this.pos = startpos;
        return 0;
    }

    var normlabel = normalizeReference(rawlabel);
    if (normlabel === "") {
        // label must contain non-whitespace characters
        this.pos = startpos;
        return 0;
    }

    if (!refmap[normlabel]) {
        refmap[normlabel] = { destination: dest, title: title };
    }
    return this.pos - startpos;
};

// Parse the next inline element in subject, advancing subject position.
// On success, add the result to block's children and return true.
// On failure, return false.
var parseInline = function(block) {
    var res = false;
    var c = this.peek();
    if (c === -1) {
        return false;
    }
    switch (c) {
        case C_NEWLINE$1:
            res = this.parseNewline(block);
            break;
        case C_BACKSLASH:
            res = this.parseBackslash(block);
            break;
        case C_BACKTICK:
            res = this.parseBackticks(block);
            break;
        case C_ASTERISK:
        case C_UNDERSCORE:
            res = this.handleDelim(c, block);
            break;
        case C_SINGLEQUOTE:
        case C_DOUBLEQUOTE:
            res = this.options.smart && this.handleDelim(c, block);
            break;
        case C_OPEN_BRACKET$1:
            res = this.parseOpenBracket(block);
            break;
        case C_BANG:
            res = this.parseBang(block);
            break;
        case C_CLOSE_BRACKET:
            res = this.parseCloseBracket(block);
            break;
        case C_LESSTHAN$1:
            res = this.parseAutolink(block) || this.parseHtmlTag(block);
            break;
        case C_AMPERSAND:
            res = this.parseEntity(block);
            break;
        default:
            res = this.parseString(block);
            break;
    }
    if (!res) {
        this.pos += 1;
        block.appendChild(text$1(fromCodePoint(c)));
    }

    return true;
};

// Parse string content in block into inline children,
// using refmap to resolve references.
var parseInlines = function(block) {
    this.subject = block._string_content.trim();
    this.pos = 0;
    this.delimiters = null;
    this.brackets = null;
    while (this.parseInline(block)) {}
    block._string_content = null; // allow raw string to be garbage collected
    this.processEmphasis(null);
};

// The InlineParser object.
function InlineParser(options) {
    return {
        subject: "",
        delimiters: null, // used by handleDelim method
        brackets: null,
        pos: 0,
        refmap: {},
        match: match,
        peek: peek$1,
        spnl: spnl,
        parseBackticks: parseBackticks,
        parseBackslash: parseBackslash,
        parseAutolink: parseAutolink,
        parseHtmlTag: parseHtmlTag,
        scanDelims: scanDelims,
        handleDelim: handleDelim,
        parseLinkTitle: parseLinkTitle,
        parseLinkDestination: parseLinkDestination,
        parseLinkLabel: parseLinkLabel,
        parseOpenBracket: parseOpenBracket,
        parseBang: parseBang,
        parseCloseBracket: parseCloseBracket,
        addBracket: addBracket,
        removeBracket: removeBracket,
        parseEntity: parseEntity,
        parseString: parseString,
        parseNewline: parseNewline,
        parseReference: parseReference,
        parseInline: parseInline,
        processEmphasis: processEmphasis,
        removeDelimiter: removeDelimiter,
        options: options || {},
        parse: parseInlines
    };
}

var CODE_INDENT = 4;

var C_TAB = 9;
var C_NEWLINE = 10;
var C_GREATERTHAN = 62;
var C_LESSTHAN = 60;
var C_SPACE = 32;
var C_OPEN_BRACKET = 91;

var reHtmlBlockOpen = [
    /./, // dummy for 0
    /^<(?:script|pre|textarea|style)(?:\s|>|$)/i,
    /^<!--/,
    /^<[?]/,
    /^<![A-Z]/,
    /^<!\[CDATA\[/,
    /^<[/]?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[123456]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|[/]?[>]|$)/i,
    new RegExp("^(?:" + OPENTAG + "|" + CLOSETAG + ")\\s*$", "i")
];

var reHtmlBlockClose = [
    /./, // dummy for 0
    /<\/(?:script|pre|textarea|style)>/i,
    /-->/,
    /\?>/,
    />/,
    /\]\]>/
];

var reThematicBreak = /^(?:\*[ \t]*){3,}$|^(?:_[ \t]*){3,}$|^(?:-[ \t]*){3,}$/;

var reMaybeSpecial = /^[#`~*+_=<>0-9-]/;

var reNonSpace = /[^ \t\f\v\r\n]/;

var reBulletListMarker = /^[*+-]/;

var reOrderedListMarker = /^(\d{1,9})([.)])/;

var reATXHeadingMarker = /^#{1,6}(?:[ \t]+|$)/;

var reCodeFence = /^`{3,}(?!.*`)|^~{3,}/;

var reClosingCodeFence = /^(?:`{3,}|~{3,})(?= *$)/;

var reSetextHeadingLine = /^(?:=+|-+)[ \t]*$/;

var reLineEnding = /\r\n|\n|\r/;

// Returns true if string contains only space characters.
var isBlank = function(s) {
    return !reNonSpace.test(s);
};

var isSpaceOrTab = function(c) {
    return c === C_SPACE || c === C_TAB;
};

var peek = function(ln, pos) {
    if (pos < ln.length) {
        return ln.charCodeAt(pos);
    } else {
        return -1;
    }
};

// DOC PARSER

// These are methods of a Parser object, defined below.

// Returns true if block ends with a blank line, descending if needed
// into lists and sublists.
var endsWithBlankLine = function(block) {
    while (block) {
        if (block._lastLineBlank) {
            return true;
        }
        var t = block.type;
        if (!block._lastLineChecked && (t === "list" || t === "item")) {
            block._lastLineChecked = true;
            block = block._lastChild;
        } else {
            block._lastLineChecked = true;
            break;
        }
    }
    return false;
};

// Add a line to the block at the tip.  We assume the tip
// can accept lines -- that check should be done before calling this.
var addLine = function() {
    if (this.partiallyConsumedTab) {
        this.offset += 1; // skip over tab
        // add space characters:
        var charsToTab = 4 - (this.column % 4);
        this.tip._string_content += " ".repeat(charsToTab);
    }
    this.tip._string_content += this.currentLine.slice(this.offset) + "\n";
};

// Add block of type tag as a child of the tip.  If the tip can't
// accept children, close and finalize it and try its parent,
// and so on til we find a block that can accept children.
var addChild = function(tag, offset) {
    while (!this.blocks[this.tip.type].canContain(tag)) {
        this.finalize(this.tip, this.lineNumber - 1);
    }

    var column_number = offset + 1; // offset 0 = column 1
    var newBlock = new Node(tag, [
        [this.lineNumber, column_number],
        [0, 0]
    ]);
    newBlock._string_content = "";
    this.tip.appendChild(newBlock);
    this.tip = newBlock;
    return newBlock;
};

// Parse a list marker and return data on the marker (type,
// start, delimiter, bullet character, padding) or null.
var parseListMarker = function(parser, container) {
    var rest = parser.currentLine.slice(parser.nextNonspace);
    var match;
    var nextc;
    var spacesStartCol;
    var spacesStartOffset;
    var data = {
        type: null,
        tight: true, // lists are tight by default
        bulletChar: null,
        start: null,
        delimiter: null,
        padding: null,
        markerOffset: parser.indent
    };
    if (parser.indent >= 4) {
        return null;
    }
    if ((match = rest.match(reBulletListMarker))) {
        data.type = "bullet";
        data.bulletChar = match[0][0];
    } else if (
        (match = rest.match(reOrderedListMarker)) &&
        (container.type !== "paragraph" || match[1] == 1)
    ) {
        data.type = "ordered";
        data.start = parseInt(match[1]);
        data.delimiter = match[2];
    } else {
        return null;
    }
    // make sure we have spaces after
    nextc = peek(parser.currentLine, parser.nextNonspace + match[0].length);
    if (!(nextc === -1 || nextc === C_TAB || nextc === C_SPACE)) {
        return null;
    }

    // if it interrupts paragraph, make sure first line isn't blank
    if (
        container.type === "paragraph" &&
        !parser.currentLine
            .slice(parser.nextNonspace + match[0].length)
            .match(reNonSpace)
    ) {
        return null;
    }

    // we've got a match! advance offset and calculate padding
    parser.advanceNextNonspace(); // to start of marker
    parser.advanceOffset(match[0].length, true); // to end of marker
    spacesStartCol = parser.column;
    spacesStartOffset = parser.offset;
    do {
        parser.advanceOffset(1, true);
        nextc = peek(parser.currentLine, parser.offset);
    } while (parser.column - spacesStartCol < 5 && isSpaceOrTab(nextc));
    var blank_item = peek(parser.currentLine, parser.offset) === -1;
    var spaces_after_marker = parser.column - spacesStartCol;
    if (spaces_after_marker >= 5 || spaces_after_marker < 1 || blank_item) {
        data.padding = match[0].length + 1;
        parser.column = spacesStartCol;
        parser.offset = spacesStartOffset;
        if (isSpaceOrTab(peek(parser.currentLine, parser.offset))) {
            parser.advanceOffset(1, true);
        }
    } else {
        data.padding = match[0].length + spaces_after_marker;
    }
    return data;
};

// Returns true if the two list items are of the same type,
// with the same delimiter and bullet character.  This is used
// in agglomerating list items into lists.
var listsMatch = function(list_data, item_data) {
    return (
        list_data.type === item_data.type &&
        list_data.delimiter === item_data.delimiter &&
        list_data.bulletChar === item_data.bulletChar
    );
};

// Finalize and close any unmatched blocks.
var closeUnmatchedBlocks = function() {
    if (!this.allClosed) {
        // finalize any blocks not matched
        while (this.oldtip !== this.lastMatchedContainer) {
            var parent = this.oldtip._parent;
            this.finalize(this.oldtip, this.lineNumber - 1);
            this.oldtip = parent;
        }
        this.allClosed = true;
    }
};

// 'finalize' is run when the block is closed.
// 'continue' is run to check whether the block is continuing
// at a certain line and offset (e.g. whether a block quote
// contains a `>`.  It returns 0 for matched, 1 for not matched,
// and 2 for "we've dealt with this line completely, go to next."
var blocks = {
    document: {
        continue: function() {
            return 0;
        },
        finalize: function() {
            return;
        },
        canContain: function(t) {
            return t !== "item";
        },
        acceptsLines: false
    },
    list: {
        continue: function() {
            return 0;
        },
        finalize: function(parser, block) {
            var item = block._firstChild;
            while (item) {
                // check for non-final list item ending with blank line:
                if (endsWithBlankLine(item) && item._next) {
                    block._listData.tight = false;
                    break;
                }
                // recurse into children of list item, to see if there are
                // spaces between any of them:
                var subitem = item._firstChild;
                while (subitem) {
                    if (
                        endsWithBlankLine(subitem) &&
                        (item._next || subitem._next)
                    ) {
                        block._listData.tight = false;
                        break;
                    }
                    subitem = subitem._next;
                }
                item = item._next;
            }
        },
        canContain: function(t) {
            return t === "item";
        },
        acceptsLines: false
    },
    block_quote: {
        continue: function(parser) {
            var ln = parser.currentLine;
            if (
                !parser.indented &&
                peek(ln, parser.nextNonspace) === C_GREATERTHAN
            ) {
                parser.advanceNextNonspace();
                parser.advanceOffset(1, false);
                if (isSpaceOrTab(peek(ln, parser.offset))) {
                    parser.advanceOffset(1, true);
                }
            } else {
                return 1;
            }
            return 0;
        },
        finalize: function() {
            return;
        },
        canContain: function(t) {
            return t !== "item";
        },
        acceptsLines: false
    },
    item: {
        continue: function(parser, container) {
            if (parser.blank) {
                if (container._firstChild == null) {
                    // Blank line after empty list item
                    return 1;
                } else {
                    parser.advanceNextNonspace();
                }
            } else if (
                parser.indent >=
                container._listData.markerOffset + container._listData.padding
            ) {
                parser.advanceOffset(
                    container._listData.markerOffset +
                        container._listData.padding,
                    true
                );
            } else {
                return 1;
            }
            return 0;
        },
        finalize: function() {
            return;
        },
        canContain: function(t) {
            return t !== "item";
        },
        acceptsLines: false
    },
    heading: {
        continue: function() {
            // a heading can never container > 1 line, so fail to match:
            return 1;
        },
        finalize: function() {
            return;
        },
        canContain: function() {
            return false;
        },
        acceptsLines: false
    },
    thematic_break: {
        continue: function() {
            // a thematic break can never container > 1 line, so fail to match:
            return 1;
        },
        finalize: function() {
            return;
        },
        canContain: function() {
            return false;
        },
        acceptsLines: false
    },
    code_block: {
        continue: function(parser, container) {
            var ln = parser.currentLine;
            var indent = parser.indent;
            if (container._isFenced) {
                // fenced
                var match =
                    indent <= 3 &&
                    ln.charAt(parser.nextNonspace) === container._fenceChar &&
                    ln.slice(parser.nextNonspace).match(reClosingCodeFence);
                if (match && match[0].length >= container._fenceLength) {
                    // closing fence - we're at end of line, so we can return
                    parser.lastLineLength =
                        parser.offset + indent + match[0].length;
                    parser.finalize(container, parser.lineNumber);
                    return 2;
                } else {
                    // skip optional spaces of fence offset
                    var i = container._fenceOffset;
                    while (i > 0 && isSpaceOrTab(peek(ln, parser.offset))) {
                        parser.advanceOffset(1, true);
                        i--;
                    }
                }
            } else {
                // indented
                if (indent >= CODE_INDENT) {
                    parser.advanceOffset(CODE_INDENT, true);
                } else if (parser.blank) {
                    parser.advanceNextNonspace();
                } else {
                    return 1;
                }
            }
            return 0;
        },
        finalize: function(parser, block) {
            if (block._isFenced) {
                // fenced
                // first line becomes info string
                var content = block._string_content;
                var newlinePos = content.indexOf("\n");
                var firstLine = content.slice(0, newlinePos);
                var rest = content.slice(newlinePos + 1);
                block.info = unescapeString$1(firstLine.trim());
                block._literal = rest;
            } else {
                // indented
                block._literal = block._string_content.replace(
                    /(\n *)+$/,
                    "\n"
                );
            }
            block._string_content = null; // allow GC
        },
        canContain: function() {
            return false;
        },
        acceptsLines: true
    },
    html_block: {
        continue: function(parser, container) {
            return parser.blank &&
                (container._htmlBlockType === 6 ||
                    container._htmlBlockType === 7)
                ? 1
                : 0;
        },
        finalize: function(parser, block) {
            block._literal = block._string_content.replace(/(\n *)+$/, "");
            block._string_content = null; // allow GC
        },
        canContain: function() {
            return false;
        },
        acceptsLines: true
    },
    paragraph: {
        continue: function(parser) {
            return parser.blank ? 1 : 0;
        },
        finalize: function(parser, block) {
            var pos;
            var hasReferenceDefs = false;

            // try parsing the beginning as link reference definitions:
            while (
                peek(block._string_content, 0) === C_OPEN_BRACKET &&
                (pos = parser.inlineParser.parseReference(
                    block._string_content,
                    parser.refmap
                ))
            ) {
                block._string_content = block._string_content.slice(pos);
                hasReferenceDefs = true;
            }
            if (hasReferenceDefs && isBlank(block._string_content)) {
                block.unlink();
            }
        },
        canContain: function() {
            return false;
        },
        acceptsLines: true
    }
};

// block start functions.  Return values:
// 0 = no match
// 1 = matched container, keep going
// 2 = matched leaf, no more block starts
var blockStarts = [
    // block quote
    function(parser) {
        if (
            !parser.indented &&
            peek(parser.currentLine, parser.nextNonspace) === C_GREATERTHAN
        ) {
            parser.advanceNextNonspace();
            parser.advanceOffset(1, false);
            // optional following space
            if (isSpaceOrTab(peek(parser.currentLine, parser.offset))) {
                parser.advanceOffset(1, true);
            }
            parser.closeUnmatchedBlocks();
            parser.addChild("block_quote", parser.nextNonspace);
            return 1;
        } else {
            return 0;
        }
    },

    // ATX heading
    function(parser) {
        var match;
        if (
            !parser.indented &&
            (match = parser.currentLine
                .slice(parser.nextNonspace)
                .match(reATXHeadingMarker))
        ) {
            parser.advanceNextNonspace();
            parser.advanceOffset(match[0].length, false);
            parser.closeUnmatchedBlocks();
            var container = parser.addChild("heading", parser.nextNonspace);
            container.level = match[0].trim().length; // number of #s
            // remove trailing ###s:
            container._string_content = parser.currentLine
                .slice(parser.offset)
                .replace(/^[ \t]*#+[ \t]*$/, "")
                .replace(/[ \t]+#+[ \t]*$/, "");
            parser.advanceOffset(parser.currentLine.length - parser.offset);
            return 2;
        } else {
            return 0;
        }
    },

    // Fenced code block
    function(parser) {
        var match;
        if (
            !parser.indented &&
            (match = parser.currentLine
                .slice(parser.nextNonspace)
                .match(reCodeFence))
        ) {
            var fenceLength = match[0].length;
            parser.closeUnmatchedBlocks();
            var container = parser.addChild("code_block", parser.nextNonspace);
            container._isFenced = true;
            container._fenceLength = fenceLength;
            container._fenceChar = match[0][0];
            container._fenceOffset = parser.indent;
            parser.advanceNextNonspace();
            parser.advanceOffset(fenceLength, false);
            return 2;
        } else {
            return 0;
        }
    },

    // HTML block
    function(parser, container) {
        if (
            !parser.indented &&
            peek(parser.currentLine, parser.nextNonspace) === C_LESSTHAN
        ) {
            var s = parser.currentLine.slice(parser.nextNonspace);
            var blockType;

            for (blockType = 1; blockType <= 7; blockType++) {
                if (
                    reHtmlBlockOpen[blockType].test(s) &&
                    (blockType < 7 || (container.type !== "paragraph" &&
                     !(!parser.allClosed && !parser.blank &&
                       parser.tip.type === "paragraph") // maybe lazy
                    ))
                ) {
                    parser.closeUnmatchedBlocks();
                    // We don't adjust parser.offset;
                    // spaces are part of the HTML block:
                    var b = parser.addChild("html_block", parser.offset);
                    b._htmlBlockType = blockType;
                    return 2;
                }
            }
        }

        return 0;
    },

    // Setext heading
    function(parser, container) {
        var match;
        if (
            !parser.indented &&
            container.type === "paragraph" &&
            (match = parser.currentLine
                .slice(parser.nextNonspace)
                .match(reSetextHeadingLine))
        ) {
            parser.closeUnmatchedBlocks();
            // resolve reference link definitiosn
            var pos;
            while (
                peek(container._string_content, 0) === C_OPEN_BRACKET &&
                (pos = parser.inlineParser.parseReference(
                    container._string_content,
                    parser.refmap
                ))
            ) {
                container._string_content = container._string_content.slice(
                    pos
                );
            }
            if (container._string_content.length > 0) {
                var heading = new Node("heading", container.sourcepos);
                heading.level = match[0][0] === "=" ? 1 : 2;
                heading._string_content = container._string_content;
                container.insertAfter(heading);
                container.unlink();
                parser.tip = heading;
                parser.advanceOffset(
                    parser.currentLine.length - parser.offset,
                    false
                );
                return 2;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    },

    // thematic break
    function(parser) {
        if (
            !parser.indented &&
            reThematicBreak.test(parser.currentLine.slice(parser.nextNonspace))
        ) {
            parser.closeUnmatchedBlocks();
            parser.addChild("thematic_break", parser.nextNonspace);
            parser.advanceOffset(
                parser.currentLine.length - parser.offset,
                false
            );
            return 2;
        } else {
            return 0;
        }
    },

    // list item
    function(parser, container) {
        var data;

        if (
            (!parser.indented || container.type === "list") &&
            (data = parseListMarker(parser, container))
        ) {
            parser.closeUnmatchedBlocks();

            // add the list if needed
            if (
                parser.tip.type !== "list" ||
                !listsMatch(container._listData, data)
            ) {
                container = parser.addChild("list", parser.nextNonspace);
                container._listData = data;
            }

            // add the list item
            container = parser.addChild("item", parser.nextNonspace);
            container._listData = data;
            return 1;
        } else {
            return 0;
        }
    },

    // indented code block
    function(parser) {
        if (
            parser.indented &&
            parser.tip.type !== "paragraph" &&
            !parser.blank
        ) {
            // indented code
            parser.advanceOffset(CODE_INDENT, true);
            parser.closeUnmatchedBlocks();
            parser.addChild("code_block", parser.offset);
            return 2;
        } else {
            return 0;
        }
    }
];

var advanceOffset = function(count, columns) {
    var currentLine = this.currentLine;
    var charsToTab, charsToAdvance;
    var c;
    while (count > 0 && (c = currentLine[this.offset])) {
        if (c === "\t") {
            charsToTab = 4 - (this.column % 4);
            if (columns) {
                this.partiallyConsumedTab = charsToTab > count;
                charsToAdvance = charsToTab > count ? count : charsToTab;
                this.column += charsToAdvance;
                this.offset += this.partiallyConsumedTab ? 0 : 1;
                count -= charsToAdvance;
            } else {
                this.partiallyConsumedTab = false;
                this.column += charsToTab;
                this.offset += 1;
                count -= 1;
            }
        } else {
            this.partiallyConsumedTab = false;
            this.offset += 1;
            this.column += 1; // assume ascii; block starts are ascii
            count -= 1;
        }
    }
};

var advanceNextNonspace = function() {
    this.offset = this.nextNonspace;
    this.column = this.nextNonspaceColumn;
    this.partiallyConsumedTab = false;
};

var findNextNonspace = function() {
    var currentLine = this.currentLine;
    var i = this.offset;
    var cols = this.column;
    var c;

    while ((c = currentLine.charAt(i)) !== "") {
        if (c === " ") {
            i++;
            cols++;
        } else if (c === "\t") {
            i++;
            cols += 4 - (cols % 4);
        } else {
            break;
        }
    }
    this.blank = c === "\n" || c === "\r" || c === "";
    this.nextNonspace = i;
    this.nextNonspaceColumn = cols;
    this.indent = this.nextNonspaceColumn - this.column;
    this.indented = this.indent >= CODE_INDENT;
};

// Analyze a line of text and update the document appropriately.
// We parse markdown text by calling this on each line of input,
// then finalizing the document.
var incorporateLine = function(ln) {
    var all_matched = true;
    var t;

    var container = this.doc;
    this.oldtip = this.tip;
    this.offset = 0;
    this.column = 0;
    this.blank = false;
    this.partiallyConsumedTab = false;
    this.lineNumber += 1;

    // replace NUL characters for security
    if (ln.indexOf("\u0000") !== -1) {
        ln = ln.replace(/\0/g, "\uFFFD");
    }

    this.currentLine = ln;

    // For each containing block, try to parse the associated line start.
    // Bail out on failure: container will point to the last matching block.
    // Set all_matched to false if not all containers match.
    var lastChild;
    while ((lastChild = container._lastChild) && lastChild._open) {
        container = lastChild;

        this.findNextNonspace();

        switch (this.blocks[container.type].continue(this, container)) {
            case 0: // we've matched, keep going
                break;
            case 1: // we've failed to match a block
                all_matched = false;
                break;
            case 2: // we've hit end of line for fenced code close and can return
                return;
            default:
                throw "continue returned illegal value, must be 0, 1, or 2";
        }
        if (!all_matched) {
            container = container._parent; // back up to last matching block
            break;
        }
    }

    this.allClosed = container === this.oldtip;
    this.lastMatchedContainer = container;

    var matchedLeaf =
        container.type !== "paragraph" && blocks[container.type].acceptsLines;
    var starts = this.blockStarts;
    var startsLen = starts.length;
    // Unless last matched container is a code block, try new container starts,
    // adding children to the last matched container:
    while (!matchedLeaf) {
        this.findNextNonspace();

        // this is a little performance optimization:
        if (
            !this.indented &&
            !reMaybeSpecial.test(ln.slice(this.nextNonspace))
        ) {
            this.advanceNextNonspace();
            break;
        }

        var i = 0;
        while (i < startsLen) {
            var res = starts[i](this, container);
            if (res === 1) {
                container = this.tip;
                break;
            } else if (res === 2) {
                container = this.tip;
                matchedLeaf = true;
                break;
            } else {
                i++;
            }
        }

        if (i === startsLen) {
            // nothing matched
            this.advanceNextNonspace();
            break;
        }
    }

    // What remains at the offset is a text line.  Add the text to the
    // appropriate container.

    // First check for a lazy paragraph continuation:
    if (!this.allClosed && !this.blank && this.tip.type === "paragraph") {
        // lazy paragraph continuation
        this.addLine();
    } else {
        // not a lazy continuation

        // finalize any blocks not matched
        this.closeUnmatchedBlocks();
        if (this.blank && container.lastChild) {
            container.lastChild._lastLineBlank = true;
        }

        t = container.type;

        // Block quote lines are never blank as they start with >
        // and we don't count blanks in fenced code for purposes of tight/loose
        // lists or breaking out of lists.  We also don't set _lastLineBlank
        // on an empty list item, or if we just closed a fenced block.
        var lastLineBlank =
            this.blank &&
            !(
                t === "block_quote" ||
                (t === "code_block" && container._isFenced) ||
                (t === "item" &&
                    !container._firstChild &&
                    container.sourcepos[0][0] === this.lineNumber)
            );

        // propagate lastLineBlank up through parents:
        var cont = container;
        while (cont) {
            cont._lastLineBlank = lastLineBlank;
            cont = cont._parent;
        }

        if (this.blocks[t].acceptsLines) {
            this.addLine();
            // if HtmlBlock, check for end condition
            if (
                t === "html_block" &&
                container._htmlBlockType >= 1 &&
                container._htmlBlockType <= 5 &&
                reHtmlBlockClose[container._htmlBlockType].test(
                    this.currentLine.slice(this.offset)
                )
            ) {
                this.lastLineLength = ln.length;
                this.finalize(container, this.lineNumber);
            }
        } else if (this.offset < ln.length && !this.blank) {
            // create paragraph container for line
            container = this.addChild("paragraph", this.offset);
            this.advanceNextNonspace();
            this.addLine();
        }
    }
    this.lastLineLength = ln.length;
};

// Finalize a block.  Close it and do any necessary postprocessing,
// e.g. creating string_content from strings, setting the 'tight'
// or 'loose' status of a list, and parsing the beginnings
// of paragraphs for reference definitions.  Reset the tip to the
// parent of the closed block.
var finalize = function(block, lineNumber) {
    var above = block._parent;
    block._open = false;
    block.sourcepos[1] = [lineNumber, this.lastLineLength];

    this.blocks[block.type].finalize(this, block);

    this.tip = above;
};

// Walk through a block & children recursively, parsing string content
// into inline content where appropriate.
var processInlines = function(block) {
    var node, event, t;
    var walker = block.walker();
    this.inlineParser.refmap = this.refmap;
    this.inlineParser.options = this.options;
    while ((event = walker.next())) {
        node = event.node;
        t = node.type;
        if (!event.entering && (t === "paragraph" || t === "heading")) {
            this.inlineParser.parse(node);
        }
    }
};

var Document = function() {
    var doc = new Node("document", [
        [1, 1],
        [0, 0]
    ]);
    return doc;
};

// The main parsing function.  Returns a parsed document AST.
var parse = function(input) {
    this.doc = new Document();
    this.tip = this.doc;
    this.refmap = {};
    this.lineNumber = 0;
    this.lastLineLength = 0;
    this.offset = 0;
    this.column = 0;
    this.lastMatchedContainer = this.doc;
    this.currentLine = "";
    if (this.options.time) {
        console.time("preparing input");
    }
    var lines = input.split(reLineEnding);
    var len = lines.length;
    if (input.charCodeAt(input.length - 1) === C_NEWLINE) {
        // ignore last blank line created by final newline
        len -= 1;
    }
    if (this.options.time) {
        console.timeEnd("preparing input");
    }
    if (this.options.time) {
        console.time("block parsing");
    }
    for (var i = 0; i < len; i++) {
        this.incorporateLine(lines[i]);
    }
    while (this.tip) {
        this.finalize(this.tip, len);
    }
    if (this.options.time) {
        console.timeEnd("block parsing");
    }
    if (this.options.time) {
        console.time("inline parsing");
    }
    this.processInlines(this.doc);
    if (this.options.time) {
        console.timeEnd("inline parsing");
    }
    return this.doc;
};

// The Parser object.
function Parser(options) {
    return {
        doc: new Document(),
        blocks: blocks,
        blockStarts: blockStarts,
        tip: this.doc,
        oldtip: this.doc,
        currentLine: "",
        lineNumber: 0,
        offset: 0,
        column: 0,
        nextNonspace: 0,
        nextNonspaceColumn: 0,
        indent: 0,
        indented: false,
        blank: false,
        partiallyConsumedTab: false,
        allClosed: true,
        lastMatchedContainer: this.doc,
        refmap: {},
        lastLineLength: 0,
        inlineParser: new InlineParser(options),
        findNextNonspace: findNextNonspace,
        advanceOffset: advanceOffset,
        advanceNextNonspace: advanceNextNonspace,
        addLine: addLine,
        addChild: addChild,
        incorporateLine: incorporateLine,
        finalize: finalize,
        processInlines: processInlines,
        closeUnmatchedBlocks: closeUnmatchedBlocks,
        parse: parse,
        options: options || {}
    };
}

function Renderer() {}

/**
 *  Walks the AST and calls member methods for each Node type.
 *
 *  @param ast {Node} The root of the abstract syntax tree.
 */
function render$1(ast) {
    var walker = ast.walker(),
        event,
        type;

    this.buffer = "";
    this.lastOut = "\n";

    while ((event = walker.next())) {
        type = event.node.type;
        if (this[type]) {
            this[type](event.node, event.entering);
        }
    }
    return this.buffer;
}

/**
 *  Concatenate a literal string to the buffer.
 *
 *  @param str {String} The string to concatenate.
 */
function lit(str) {
    this.buffer += str;
    this.lastOut = str;
}

/**
 *  Output a newline to the buffer.
 */
function cr$1() {
    if (this.lastOut !== "\n") {
        this.lit("\n");
    }
}

/**
 *  Concatenate a string to the buffer possibly escaping the content.
 *
 *  Concrete renderer implementations should override this method.
 *
 *  @param str {String} The string to concatenate.
 */
function out$2(str) {
    this.lit(str);
}

/**
 *  Escape a string for the target renderer.
 *
 *  Abstract function that should be implemented by concrete
 *  renderer implementations.
 *
 *  @param str {String} The string to escape.
 */
function esc(str) {
    return str;
}

Renderer.prototype.render = render$1;
Renderer.prototype.out = out$2;
Renderer.prototype.lit = lit;
Renderer.prototype.cr = cr$1;
Renderer.prototype.esc = esc;

var reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
var reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

var potentiallyUnsafe = function(url) {
    return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

// Helper function to produce an HTML tag.
function tag$1(name, attrs, selfclosing) {
    if (this.disableTags > 0) {
        return;
    }
    this.buffer += "<" + name;
    if (attrs && attrs.length > 0) {
        var i = 0;
        var attrib;
        while ((attrib = attrs[i]) !== undefined) {
            this.buffer += " " + attrib[0] + '="' + attrib[1] + '"';
            i++;
        }
    }
    if (selfclosing) {
        this.buffer += " /";
    }
    this.buffer += ">";
    this.lastOut = ">";
}

function HtmlRenderer(options) {
    options = options || {};
    // by default, soft breaks are rendered as newlines in HTML
    options.softbreak = options.softbreak || "\n";
    // set to "<br />" to make them hard breaks
    // set to " " if you want to ignore line wrapping in source
    this.esc = options.esc || escapeXml;
    // escape html with a custom function
    // else use escapeXml

    this.disableTags = 0;
    this.lastOut = "\n";
    this.options = options;
}

/* Node methods */

function text(node) {
    this.out(node.literal);
}

function softbreak() {
    this.lit(this.options.softbreak);
}

function linebreak() {
    this.tag("br", [], true);
    this.cr();
}

function link(node, entering) {
    var attrs = this.attrs(node);
    if (entering) {
        if (!(this.options.safe && potentiallyUnsafe(node.destination))) {
            attrs.push(["href", this.esc(node.destination)]);
        }
        if (node.title) {
            attrs.push(["title", this.esc(node.title)]);
        }
        this.tag("a", attrs);
    } else {
        this.tag("/a");
    }
}

function image(node, entering) {
    if (entering) {
        if (this.disableTags === 0) {
            if (this.options.safe && potentiallyUnsafe(node.destination)) {
                this.lit('<img src="" alt="');
            } else {
                this.lit('<img src="' + this.esc(node.destination) + '" alt="');
            }
        }
        this.disableTags += 1;
    } else {
        this.disableTags -= 1;
        if (this.disableTags === 0) {
            if (node.title) {
                this.lit('" title="' + this.esc(node.title));
            }
            this.lit('" />');
        }
    }
}

function emph(node, entering) {
    this.tag(entering ? "em" : "/em");
}

function strong(node, entering) {
    this.tag(entering ? "strong" : "/strong");
}

function paragraph(node, entering) {
    var grandparent = node.parent.parent,
        attrs = this.attrs(node);
    if (grandparent !== null && grandparent.type === "list") {
        if (grandparent.listTight) {
            return;
        }
    }
    if (entering) {
        this.cr();
        this.tag("p", attrs);
    } else {
        this.tag("/p");
        this.cr();
    }
}

function heading(node, entering) {
    var tagname = "h" + node.level,
        attrs = this.attrs(node);
    if (entering) {
        this.cr();
        this.tag(tagname, attrs);
    } else {
        this.tag("/" + tagname);
        this.cr();
    }
}

function code(node) {
    this.tag("code");
    this.out(node.literal);
    this.tag("/code");
}

function code_block(node) {
    var info_words = node.info ? node.info.split(/\s+/) : [],
        attrs = this.attrs(node);
    if (info_words.length > 0 && info_words[0].length > 0) {
        attrs.push(["class", "language-" + this.esc(info_words[0])]);
    }
    this.cr();
    this.tag("pre");
    this.tag("code", attrs);
    this.out(node.literal);
    this.tag("/code");
    this.tag("/pre");
    this.cr();
}

function thematic_break(node) {
    var attrs = this.attrs(node);
    this.cr();
    this.tag("hr", attrs, true);
    this.cr();
}

function block_quote(node, entering) {
    var attrs = this.attrs(node);
    if (entering) {
        this.cr();
        this.tag("blockquote", attrs);
        this.cr();
    } else {
        this.cr();
        this.tag("/blockquote");
        this.cr();
    }
}

function list(node, entering) {
    var tagname = node.listType === "bullet" ? "ul" : "ol",
        attrs = this.attrs(node);

    if (entering) {
        var start = node.listStart;
        if (start !== null && start !== 1) {
            attrs.push(["start", start.toString()]);
        }
        this.cr();
        this.tag(tagname, attrs);
        this.cr();
    } else {
        this.cr();
        this.tag("/" + tagname);
        this.cr();
    }
}

function item(node, entering) {
    var attrs = this.attrs(node);
    if (entering) {
        this.tag("li", attrs);
    } else {
        this.tag("/li");
        this.cr();
    }
}

function html_inline(node) {
    if (this.options.safe) {
        this.lit("<!-- raw HTML omitted -->");
    } else {
        this.lit(node.literal);
    }
}

function html_block(node) {
    this.cr();
    if (this.options.safe) {
        this.lit("<!-- raw HTML omitted -->");
    } else {
        this.lit(node.literal);
    }
    this.cr();
}

function custom_inline(node, entering) {
    if (entering && node.onEnter) {
        this.lit(node.onEnter);
    } else if (!entering && node.onExit) {
        this.lit(node.onExit);
    }
}

function custom_block(node, entering) {
    this.cr();
    if (entering && node.onEnter) {
        this.lit(node.onEnter);
    } else if (!entering && node.onExit) {
        this.lit(node.onExit);
    }
    this.cr();
}

/* Helper methods */

function out$1(s) {
    this.lit(this.esc(s));
}

function attrs(node) {
    var att = [];
    if (this.options.sourcepos) {
        var pos = node.sourcepos;
        if (pos) {
            att.push([
                "data-sourcepos",
                String(pos[0][0]) +
                    ":" +
                    String(pos[0][1]) +
                    "-" +
                    String(pos[1][0]) +
                    ":" +
                    String(pos[1][1])
            ]);
        }
    }
    return att;
}

// quick browser-compatible inheritance
HtmlRenderer.prototype = Object.create(Renderer.prototype);

HtmlRenderer.prototype.text = text;
HtmlRenderer.prototype.html_inline = html_inline;
HtmlRenderer.prototype.html_block = html_block;
HtmlRenderer.prototype.softbreak = softbreak;
HtmlRenderer.prototype.linebreak = linebreak;
HtmlRenderer.prototype.link = link;
HtmlRenderer.prototype.image = image;
HtmlRenderer.prototype.emph = emph;
HtmlRenderer.prototype.strong = strong;
HtmlRenderer.prototype.paragraph = paragraph;
HtmlRenderer.prototype.heading = heading;
HtmlRenderer.prototype.code = code;
HtmlRenderer.prototype.code_block = code_block;
HtmlRenderer.prototype.thematic_break = thematic_break;
HtmlRenderer.prototype.block_quote = block_quote;
HtmlRenderer.prototype.list = list;
HtmlRenderer.prototype.item = item;
HtmlRenderer.prototype.custom_inline = custom_inline;
HtmlRenderer.prototype.custom_block = custom_block;

HtmlRenderer.prototype.esc = escapeXml;

HtmlRenderer.prototype.out = out$1;
HtmlRenderer.prototype.tag = tag$1;
HtmlRenderer.prototype.attrs = attrs;

var reXMLTag = /\<[^>]*\>/;

function toTagName(s) {
    return s.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

function XmlRenderer(options) {
    options = options || {};

    this.disableTags = 0;
    this.lastOut = "\n";

    this.indentLevel = 0;
    this.indent = "  ";
    
    this.esc = options.esc || escapeXml;
    // escape html with a custom function
    // else use escapeXml

    this.options = options;
}

function render(ast) {
    this.buffer = "";

    var attrs;
    var tagname;
    var walker = ast.walker();
    var event, node, entering;
    var container;
    var selfClosing;
    var nodetype;

    var options = this.options;

    if (options.time) {
        console.time("rendering");
    }

    this.buffer += '<?xml version="1.0" encoding="UTF-8"?>\n';
    this.buffer += '<!DOCTYPE document SYSTEM "CommonMark.dtd">\n';

    while ((event = walker.next())) {
        entering = event.entering;
        node = event.node;
        nodetype = node.type;

        container = node.isContainer;

        selfClosing =
            nodetype === "thematic_break" ||
            nodetype === "linebreak" ||
            nodetype === "softbreak";

        tagname = toTagName(nodetype);

        if (entering) {
            attrs = [];

            switch (nodetype) {
                case "document":
                    attrs.push(["xmlns", "http://commonmark.org/xml/1.0"]);
                    break;
                case "list":
                    if (node.listType !== null) {
                        attrs.push(["type", node.listType.toLowerCase()]);
                    }
                    if (node.listStart !== null) {
                        attrs.push(["start", String(node.listStart)]);
                    }
                    if (node.listTight !== null) {
                        attrs.push([
                            "tight",
                            node.listTight ? "true" : "false"
                        ]);
                    }
                    var delim = node.listDelimiter;
                    if (delim !== null) {
                        var delimword = "";
                        if (delim === ".") {
                            delimword = "period";
                        } else {
                            delimword = "paren";
                        }
                        attrs.push(["delimiter", delimword]);
                    }
                    break;
                case "code_block":
                    if (node.info) {
                        attrs.push(["info", node.info]);
                    }
                    break;
                case "heading":
                    attrs.push(["level", String(node.level)]);
                    break;
                case "link":
                case "image":
                    attrs.push(["destination", node.destination]);
                    attrs.push(["title", node.title]);
                    break;
                case "custom_inline":
                case "custom_block":
                    attrs.push(["on_enter", node.onEnter]);
                    attrs.push(["on_exit", node.onExit]);
                    break;
            }
            if (options.sourcepos) {
                var pos = node.sourcepos;
                if (pos) {
                    attrs.push([
                        "sourcepos",
                        String(pos[0][0]) +
                            ":" +
                            String(pos[0][1]) +
                            "-" +
                            String(pos[1][0]) +
                            ":" +
                            String(pos[1][1])
                    ]);
                }
            }

            this.cr();
            this.out(this.tag(tagname, attrs, selfClosing));
            if (container) {
                this.indentLevel += 1;
            } else if (!container && !selfClosing) {
                var lit = node.literal;
                if (lit) {
                    this.out(this.esc(lit));
                }
                this.out(this.tag("/" + tagname));
            }
        } else {
            this.indentLevel -= 1;
            this.cr();
            this.out(this.tag("/" + tagname));
        }
    }
    if (options.time) {
        console.timeEnd("rendering");
    }
    this.buffer += "\n";
    return this.buffer;
}

function out(s) {
    if (this.disableTags > 0) {
        this.buffer += s.replace(reXMLTag, "");
    } else {
        this.buffer += s;
    }
    this.lastOut = s;
}

function cr() {
    if (this.lastOut !== "\n") {
        this.buffer += "\n";
        this.lastOut = "\n";
        for (var i = this.indentLevel; i > 0; i--) {
            this.buffer += this.indent;
        }
    }
}

// Helper function to produce an XML tag.
function tag(name, attrs, selfclosing) {
    var result = "<" + name;
    if (attrs && attrs.length > 0) {
        var i = 0;
        var attrib;
        while ((attrib = attrs[i]) !== undefined) {
            result += " " + attrib[0] + '="' + this.esc(attrib[1]) + '"';
            i++;
        }
    }
    if (selfclosing) {
        result += " /";
    }
    result += ">";
    return result;
}

// quick browser-compatible inheritance
XmlRenderer.prototype = Object.create(Renderer.prototype);

XmlRenderer.prototype.render = render;
XmlRenderer.prototype.out = out;
XmlRenderer.prototype.cr = cr;
XmlRenderer.prototype.tag = tag;
XmlRenderer.prototype.esc = escapeXml;

const EstimtestLogo = () => {
  return (hAsync("svg", { class: 'square', style: { '--size': '1.7rem' }, viewBox: '0 0 110.07 135.47' },
    hAsync("title", null, "Estimtest, a manual testing library"),
    hAsync("path", { fill: '#fff', d: 'M23.95 84.67H0v23.94l26.85 26.86h74.75V101.6H40.88ZM26.85 0 0 26.85V50.8h23.95l16.93-16.93h60.72V0Zm-2.9 50.8v33.87h86.12V50.8Z', color: '#000' })));
};
const CloseIcon = () => {
  return (hAsync("svg", { class: 'square', style: { '--size': '1rem' }, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 67.7 67.7' },
    hAsync("title", null, "Close"),
    hAsync("path", { fill: 'none', stroke: '#fff', "stroke-linecap": 'round', "stroke-linejoin": 'round', "stroke-width": '16.9', d: 'm8.5 8.5 50.8 50.8m-50.8 0L59.3 8.5' })));
};
const ChevronIcon = ({ direction }) => {
  return (hAsync("svg", { style: { '--size': '1rem' }, class: {
      'upside-down': direction === 'down',
      square: true,
    }, viewBox: '0 0 67.7 36' },
    hAsync("path", { fill: 'none', stroke: '#fff', "stroke-linecap": 'round', "stroke-linejoin": 'round', "stroke-width": '16.9', d: 'm8.5 27.5 25.4-19 25.4 19' })));
};

const coreCss = "/*!@.full-screen*/.full-screen.sc-estimtest-core{position:fixed;width:100%;height:100%;top:0rem;pointer-events:none}/*!@.full-width*/.full-width.sc-estimtest-core{width:100%}/*!@.absolute-bottom*/.absolute-bottom.sc-estimtest-core{position:absolute;bottom:0.5rem;left:50%;transform:translateX(-50%)}/*!@.absolute-top*/.absolute-top.sc-estimtest-core{position:absolute;top:0.5rem;left:50%;transform:translateX(-50%)}/*!@.absolute-center*/.absolute-center.sc-estimtest-core{position:absolute;top:0.5rem;left:50%;top:50%;transform:translateX(-50%) translateY(-50%)}/*!@.flex-row*/.flex-row.sc-estimtest-core{display:flex;align-items:center;gap:0.8rem}/*!@.flex-column*/.flex-column.sc-estimtest-core{display:flex;flex-direction:column;align-items:center;gap:0.8rem}/*!@.upside-down*/.upside-down.sc-estimtest-core{transform:rotateZ(180deg)}/*!@.square*/.square.sc-estimtest-core{width:var(--size);height:var(--size)}/*!@.clickable*/.clickable.sc-estimtest-core{cursor:pointer;filter:drop-shadow(0rem 0rem 0rem hsla(0, 0%, 100%, 0.7));transition:filter ease 250ms}/*!@.clickable:hover*/.clickable.sc-estimtest-core:hover{filter:drop-shadow(rgba(255, 255, 255, 0.7) 0rem 0rem 1rem)}/*!@.auto-resize-textarea*/.auto-resize-textarea.sc-estimtest-core{resize:none;overflow:hidden;height:18px}/*!@.will-animate-blur*/.will-animate-blur.sc-estimtest-core{opacity:0;filter:blur(16px);pointer-events:none !important;transition:filter ease 300ms, opacity ease 300ms}/*!@.will-animate-blur.animate-blur*/.will-animate-blur.animate-blur.sc-estimtest-core{pointer-events:all !important;opacity:1;filter:blur(0px)}/*!@.title*/.title.sc-estimtest-core{font-size:1.2rem;font-weight:bold;margin:0rem;z-index:1000}/*!@.caption*/.caption.sc-estimtest-core{font-size:1.1rem;opacity:0.6;margin:0rem}/*!@.paragraph*/.paragraph.sc-estimtest-core{margin:0rem;font-size:1.1rem;opacity:0.9;text-align:left}/*!@.box*/.box.sc-estimtest-core{width:fit-content;max-width:90%;max-height:calc(100% - 3rem);padding:0.7rem 1.4rem;overflow:hidden;border-radius:1rem;border-style:solid;border-width:1px;border-color:hsl(0, 0%, 30%);background:linear-gradient(45deg, hsl(0, 0%, 0%), hsl(0, 0%, 10%));color:hsl(0, 0%, 100%);box-shadow:0rem 0rem 1rem 0rem hsl(0, 0%, 15%);pointer-events:all}/*!@.button*/.button.sc-estimtest-core{display:flex;padding:0.5rem 1rem;border-style:solid;border-color:hsl(0, 0%, 20%);border-width:1px;border-radius:1rem;background:hsl(0, 0%, 10%);color:hsl(0, 0%, 100%);font-size:0.9rem;cursor:pointer}/*!@.button:hover*/.button.sc-estimtest-core:hover{border-color:hsl(0, 0%, 40%)}/*!@.results-grid*/.results-grid.sc-estimtest-core{gap:0.2rem;text-align:left}/*!@.results-grid > **/.results-grid.sc-estimtest-core>*.sc-estimtest-core{padding:0.3rem 1rem;border-radius:0.5rem;border-style:solid;border-width:1px}/*!@.results-grid > .fail*/.results-grid.sc-estimtest-core>.fail.sc-estimtest-core{background-color:hsla(0, 100%, 50%, 0.1);border-color:hsl(0, 100%, 50%)}/*!@.results-grid > .pass*/.results-grid.sc-estimtest-core>.pass.sc-estimtest-core{background-color:hsla(120, 100%, 30%, 0.1);border-color:hsl(120, 100%, 30%)}/*!@.results-grid .title*/.results-grid.sc-estimtest-core .title.sc-estimtest-core{max-width:12rem;min-width:12rem}";

class Estimtest {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.experiments = undefined;
    this.active = true;
    this.status = 'inactive';
    this.activeConfig = defaultEstimtestConfig;
    this.activeTest = undefined;
    this.expandedTestActive = undefined;
    this.expandedTest = undefined;
    this.testDetailsDescription = undefined;
    this.testResults = [];
    this.exportedResultsActive = undefined;
    this.exportedResults = '';
    this.errors = {};
  }
  watchConfigHandler() {
    this.updateConfig();
  }
  watchActiveTestHandler() {
    autoResizeTextarea(this.testFeedbackElement);
  }
  componentWillLoad() {
    if (this.active) {
      this.promptBeginExperiments();
    }
  }
  /**
   * Provides the prompt to begin or restart experiments. This activates and resets the experiments
   * as well.
   */
  async promptBeginExperiments() {
    resetTest(this.hostElement);
    this.status = 'prompted';
  }
  /**
   * Starts the experiments using the config sent to this method.
   * This does not need to be manually implemented, the UI elements perform the same event.
   */
  async startExperiments(config) {
    this.testResults = [];
    this.updateConfig(config);
    this.activeTest = Object.assign({ index: 0 }, this.activeConfig.experiments[0]);
    this.status = 'active';
    performTest(this.hostElement, this.activeTest);
  }
  /**
   * Progress to the next test in the config.
   * This does not need to be manually implemented, the UI elements perform the same event.
   */
  async nextExperiment(results) {
    this.testResults.push(Object.assign({ results: results, notes: this.activeTest.notes }, this.activeTest));
    this.activeTest.notes = '';
    const nextIndex = this.activeTest.index + 1;
    if (nextIndex >= this.activeConfig.experiments.length) {
      this.finishExperiments();
    }
    this.activeTest = Object.assign({ index: nextIndex }, this.activeConfig.experiments[nextIndex]);
    performTest(this.hostElement, this.activeTest);
  }
  finishExperiments() {
    this.status = 'finished';
    resetTest(this.hostElement);
  }
  updateConfig(config) {
    // Warn user that the estimtest config could not be changed during testing.
    if (this.status === 'active') {
      this.errorHandler('The configuration file could not be changed during active testing.');
    }
    else if (config) {
      this.activeConfig = config;
    }
    else {
      this.activeConfig = defaultEstimtestConfig;
      if (this.experiments !== undefined)
        this.activeConfig.experiments = this.experiments;
    }
  }
  async toggleTestDetails(test) {
    this.expandedTestActive = !this.expandedTestActive;
    if (this.expandedTestActive) {
      this.expandedTest = test !== null && test !== void 0 ? test : this.activeTest;
      const reader = new Parser();
      const writer = new HtmlRenderer();
      const parsed = reader.parse(this.expandedTest.description);
      this.testDetailsDescription = writer.render(parsed);
    }
  }
  exportResults() {
    this.exportedResultsActive = true;
    this.exportedResults = JSON.stringify(this.testResults, null, 2);
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
    var _a, _b, _c, _d, _e, _f;
    if (!this.active)
      return hAsync(Fragment, null);
    else if (this.status === 'inactive')
      return hAsync(Fragment, null);
    return (hAsync(Host, null, hAsync("div", { class: 'full-screen' }, hAsync("div", null, Object.values(this.errors).map((element, i) => (hAsync("div", { key: i, class: 'absolute-top box' }, hAsync("h2", { class: 'title' }, "Error"), hAsync("p", null, element.message))))), hAsync("div", { "data-test": "prompt-box", class: {
        'absolute-bottom box will-animate-blur': true,
        'animate-blur': this.status === 'prompted',
      }, ref: conditionallySetInert(this.status === 'prompted') }, hAsync("div", { class: 'flex-row' }, hAsync(EstimtestLogo, null), hAsync("button", { class: 'button', onClick: () => this.startExperiments() }, "Start Testing"))), hAsync("div", { "data-test": "test-box", class: {
        'absolute-bottom box will-animate-blur': true,
        'animate-blur': this.status === 'active',
      }, ref: conditionallySetInert(this.status === 'active') }, hAsync("div", { class: 'flex-column' }, hAsync("div", { class: 'flex-row' }, hAsync("p", { class: 'title' }, (_b = (_a = this.activeTest) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ''), hAsync("p", { class: 'caption' }, ((_c = this.activeTest) === null || _c === void 0 ? void 0 : _c.index) + 1, "/", (_d = this.activeConfig) === null || _d === void 0 ? void 0 :
      _d.experiments.length), hAsync("button", { onClick: () => this.toggleTestDetails(), class: 'button' }, hAsync(ChevronIcon, { direction: this.expandedTestActive ? 'down' : 'up' }))), hAsync("div", { class: 'flex-row' }, hAsync("textarea", { class: 'auto-resize-textarea button', value: (_e = this.activeTest) === null || _e === void 0 ? void 0 : _e.notes, ref: (el) => this.testFeedbackElement = el, onChange: (event) => (this.activeTest = Object.assign(Object.assign({}, this.activeTest), { notes: getEventValue(event) })), onInput: (event) => (this.activeTest = Object.assign(Object.assign({}, this.activeTest), { notes: getEventValue(event) })) }), hAsync("button", { class: 'button', onClick: () => this.nextExperiment('pass') }, "Pass"), hAsync("button", { class: 'button', onClick: () => this.nextExperiment('fail') }, "Fail")))), hAsync("div", { "data-test": "finish-box", class: {
        'absolute-center box will-animate-blur': true,
        'animate-blur': this.status === 'finished',
      }, ref: conditionallySetInert(this.status === 'finished') }, hAsync("div", { class: 'flex-column' }, hAsync("h2", { class: 'title' }, "Estimtest Finished"), hAsync("div", { class: 'flex-column results-grid' }, this.testResults.map((result) => (hAsync("div", { class: `flex-row full-width ${result.results}` }, hAsync("h3", { onClick: () => this.toggleTestDetails(result), class: 'title clickable' }, result.name), hAsync("p", { class: 'paragraph', style: {
        opacity: result.notes === undefined ? '0.5' : '0.9',
      } }, result.notes === undefined
      ? 'No notes added'
      : result.notes))))), hAsync("div", { class: 'flex-row' }, hAsync("button", { onClick: () => this.exportResults(), class: 'button' }, "Export Results"), hAsync("button", { onClick: () => this.promptBeginExperiments(), class: 'button' }, "Start Another Test")))), hAsync("div", { "data-test": "details-box", class: {
        'absolute-center box will-animate-blur': true,
        'animate-blur': this.expandedTestActive,
      }, ref: conditionallySetInert(this.expandedTestActive) }, hAsync("div", { class: 'flex-column' }, hAsync("div", { class: 'flex-row' }, hAsync("h2", { class: 'title' }, (_f = this.expandedTest) === null || _f === void 0 ? void 0 : _f.name), hAsync("button", { class: 'button', onClick: () => this.toggleTestDetails() }, hAsync(CloseIcon, null))), hAsync("div", { class: 'paragraph', innerHTML: this.testDetailsDescription }))), hAsync("div", { class: {
        'absolute-center box will-animate-blur': true,
        'animate-blur': this.exportedResultsActive,
      }, ref: conditionallySetInert(this.exportedResultsActive) }, hAsync("div", { class: 'flex-column' }, hAsync("h2", { class: 'title' }, "Exported Test Results"), hAsync("p", { class: 'paragraph', innerHTML: this.exportedResults }), hAsync("button", { onClick: () => this.exportedResultsActive = false, class: 'button' }, "Back"))))));
  }
  get hostElement() { return getElement(this); }
  static get watchers() { return {
    "experiments": ["watchConfigHandler"],
    "activeTest": ["watchActiveTestHandler"]
  }; }
  static get style() { return coreCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "estimtest-core",
    "$members$": {
      "experiments": [16],
      "active": [4],
      "status": [32],
      "activeConfig": [32],
      "activeTest": [32],
      "expandedTestActive": [32],
      "expandedTest": [32],
      "testDetailsDescription": [32],
      "testResults": [32],
      "exportedResultsActive": [32],
      "exportedResults": [32],
      "errors": [32],
      "promptBeginExperiments": [64],
      "startExperiments": [64],
      "nextExperiment": [64]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

registerComponents([
  Estimtest,
]);

exports.hydrateApp = hydrateApp;


  /*hydrateAppClosure end*/
  hydrateApp(window, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve);
  }

  hydrateAppClosure($stencilWindow);
}

function createWindowFromHtml(e, t) {
 let r = templateWindows.get(t);
 return null == r && (r = new MockWindow(e), templateWindows.set(t, r)), cloneWindow(r);
}

function inspectElement(e, t, r) {
 const s = t.children;
 for (let t = 0, n = s.length; t < n; t++) {
  const n = s[t], o = n.nodeName.toLowerCase();
  if (o.includes("-")) {
   const t = e.components.find((e => e.tag === o));
   null != t && (t.count++, r > t.depth && (t.depth = r));
  } else switch (o) {
  case "a":
   const t = collectAttributes(n);
   t.href = n.href, "string" == typeof t.href && (e.anchors.some((e => e.href === t.href)) || e.anchors.push(t));
   break;

  case "img":
   const r = collectAttributes(n);
   r.src = n.src, "string" == typeof r.src && (e.imgs.some((e => e.src === r.src)) || e.imgs.push(r));
   break;

  case "link":
   const s = collectAttributes(n);
   s.href = n.href, "string" == typeof s.rel && "stylesheet" === s.rel.toLowerCase() && "string" == typeof s.href && (e.styles.some((e => e.link === s.href)) || (delete s.rel, 
   delete s.type, e.styles.push(s)));
   break;

  case "script":
   const o = collectAttributes(n);
   if (n.hasAttribute("src")) o.src = n.src, "string" == typeof o.src && (e.scripts.some((e => e.src === o.src)) || e.scripts.push(o)); else {
    const t = n.getAttribute("data-stencil-static");
    t && e.staticData.push({
     id: t,
     type: n.getAttribute("type"),
     content: n.textContent
    });
   }
  }
  inspectElement(e, n, ++r);
 }
}

function collectAttributes(e) {
 const t = {}, r = e.attributes;
 for (let e = 0, s = r.length; e < s; e++) {
  const s = r.item(e), n = s.nodeName.toLowerCase();
  if (SKIP_ATTRS.has(n)) continue;
  const o = s.nodeValue;
  "class" === n && "" === o || (t[n] = o);
 }
 return t;
}

function patchDomImplementation(e, t) {
 let r;
 if (null != e.defaultView ? (t.destroyWindow = !0, patchWindow(e.defaultView), r = e.defaultView) : (t.destroyWindow = !0, 
 t.destroyDocument = !1, r = new MockWindow(!1)), r.document !== e && (r.document = e), 
 e.defaultView !== r && (e.defaultView = r), "function" != typeof e.documentElement.constructor.prototype.getRootNode && (e.createElement("unknown-element").constructor.prototype.getRootNode = getRootNode), 
 "function" == typeof e.createEvent) {
  const t = e.createEvent("CustomEvent").constructor;
  r.CustomEvent !== t && (r.CustomEvent = t);
 }
 try {
  e.baseURI;
 } catch (t) {
  Object.defineProperty(e, "baseURI", {
   get() {
    const t = e.querySelector("base[href]");
    return t ? new URL(t.getAttribute("href"), r.location.href).href : r.location.href;
   }
  });
 }
 return r;
}

function getRootNode(e) {
 const t = null != e && !0 === e.composed;
 let r = this;
 for (;null != r.parentNode; ) r = r.parentNode, !0 === t && null == r.parentNode && null != r.host && (r = r.host);
 return r;
}

function normalizeHydrateOptions(e) {
 const t = Object.assign({
  serializeToHtml: !1,
  destroyWindow: !1,
  destroyDocument: !1
 }, e || {});
 return "boolean" != typeof t.clientHydrateAnnotations && (t.clientHydrateAnnotations = !0), 
 "boolean" != typeof t.constrainTimeouts && (t.constrainTimeouts = !0), "number" != typeof t.maxHydrateCount && (t.maxHydrateCount = 300), 
 "boolean" != typeof t.runtimeLogging && (t.runtimeLogging = !1), "number" != typeof t.timeout && (t.timeout = 15e3), 
 Array.isArray(t.excludeComponents) ? t.excludeComponents = t.excludeComponents.filter(filterValidTags).map(mapValidTags) : t.excludeComponents = [], 
 Array.isArray(t.staticComponents) ? t.staticComponents = t.staticComponents.filter(filterValidTags).map(mapValidTags) : t.staticComponents = [], 
 t;
}

function filterValidTags(e) {
 return "string" == typeof e && e.includes("-");
}

function mapValidTags(e) {
 return e.trim().toLowerCase();
}

function generateHydrateResults(e) {
 "string" != typeof e.url && (e.url = "https://hydrate.stenciljs.com/"), "string" != typeof e.buildId && (e.buildId = createHydrateBuildId());
 const t = {
  buildId: e.buildId,
  diagnostics: [],
  url: e.url,
  host: null,
  hostname: null,
  href: null,
  pathname: null,
  port: null,
  search: null,
  hash: null,
  html: null,
  httpStatus: null,
  hydratedCount: 0,
  anchors: [],
  components: [],
  imgs: [],
  scripts: [],
  staticData: [],
  styles: [],
  title: null
 };
 try {
  const r = new URL(e.url, "https://hydrate.stenciljs.com/");
  t.url = r.href, t.host = r.host, t.hostname = r.hostname, t.href = r.href, t.port = r.port, 
  t.pathname = r.pathname, t.search = r.search, t.hash = r.hash;
 } catch (e) {
  renderCatchError(t, e);
 }
 return t;
}

function renderBuildDiagnostic(e, t, r, s) {
 const n = {
  level: t,
  type: "build",
  header: r,
  messageText: s,
  relFilePath: null,
  absFilePath: null,
  lines: []
 };
 return e.pathname ? "/" !== e.pathname && (n.header += ": " + e.pathname) : e.url && (n.header += ": " + e.url), 
 e.diagnostics.push(n), n;
}

function renderBuildError(e, t) {
 return renderBuildDiagnostic(e, "error", "Hydrate Error", t);
}

function renderCatchError(e, t) {
 const r = renderBuildError(e, null);
 return null != t && (null != t.stack ? r.messageText = t.stack.toString() : null != t.message ? r.messageText = t.message.toString() : r.messageText = t.toString()), 
 r;
}

function runtimeLog(e, t, r) {
 global.console[t].apply(global.console, [ `[ ${e}  ${t} ] `, ...r ]);
}

function renderToString(e, t) {
 const r = normalizeHydrateOptions(t);
 return r.serializeToHtml = !0, new Promise((t => {
  let s;
  const n = generateHydrateResults(r);
  if (hasError(n.diagnostics)) t(n); else if ("string" == typeof e) try {
   r.destroyWindow = !0, r.destroyDocument = !0, s = new MockWindow(e), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else if (isValidDocument(e)) try {
   r.destroyDocument = !1, s = patchDomImplementation(e, r), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else renderBuildError(n, 'Invalid html or document. Must be either a valid "html" string, or DOM "document".'), 
  t(n);
 }));
}

function hydrateDocument(e, t) {
 const r = normalizeHydrateOptions(t);
 return r.serializeToHtml = !1, new Promise((t => {
  let s;
  const n = generateHydrateResults(r);
  if (hasError(n.diagnostics)) t(n); else if ("string" == typeof e) try {
   r.destroyWindow = !0, r.destroyDocument = !0, s = new MockWindow(e), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else if (isValidDocument(e)) try {
   r.destroyDocument = !1, s = patchDomImplementation(e, r), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else renderBuildError(n, 'Invalid html or document. Must be either a valid "html" string, or DOM "document".'), 
  t(n);
 }));
}

function render(e, t, r, s) {
 if (process.__stencilErrors || (process.__stencilErrors = !0, process.on("unhandledRejection", (e => {
  console.log("unhandledRejection", e);
 }))), function n(e, t, r, s) {
  try {
   e.location.href = r.url;
  } catch (e) {
   renderCatchError(s, e);
  }
  if ("string" == typeof r.userAgent) try {
   e.navigator.userAgent = r.userAgent;
  } catch (e) {}
  if ("string" == typeof r.cookie) try {
   t.cookie = r.cookie;
  } catch (e) {}
  if ("string" == typeof r.referrer) try {
   t.referrer = r.referrer;
  } catch (e) {}
  if ("string" == typeof r.direction) try {
   t.documentElement.setAttribute("dir", r.direction);
  } catch (e) {}
  if ("string" == typeof r.language) try {
   t.documentElement.setAttribute("lang", r.language);
  } catch (e) {}
  if ("string" == typeof r.buildId) try {
   t.documentElement.setAttribute("data-stencil-build", r.buildId);
  } catch (e) {}
  try {
   e.customElements = null;
  } catch (e) {}
  return r.constrainTimeouts && constrainTimeouts(e), function n(e, t, r) {
   try {
    const s = e.location.pathname;
    e.console.error = (...e) => {
     const n = e.reduce(((e, t) => {
      if (t) {
       if (null != t.stack) return e + " " + String(t.stack);
       if (null != t.message) return e + " " + String(t.message);
      }
      return String(t);
     }), "").trim();
     "" !== n && (renderCatchError(r, n), t.runtimeLogging && runtimeLog(s, "error", [ n ]));
    }, e.console.debug = (...e) => {
     renderBuildDiagnostic(r, "debug", "Hydrate Debug", [ ...e ].join(", ")), t.runtimeLogging && runtimeLog(s, "debug", e);
    }, t.runtimeLogging && [ "log", "warn", "assert", "info", "trace" ].forEach((t => {
     e.console[t] = (...e) => {
      runtimeLog(s, t, e);
     };
    }));
   } catch (e) {
    renderCatchError(r, e);
   }
  }(e, r, s), e;
 }(e, e.document, t, r), "function" == typeof t.beforeHydrate) try {
  const n = t.beforeHydrate(e.document);
  isPromise(n) ? n.then((() => {
   hydrateFactory(e, t, r, afterHydrate, s);
  })) : hydrateFactory(e, t, r, afterHydrate, s);
 } catch (n) {
  renderCatchError(r, n), finalizeHydrate(e, e.document, t, r, s);
 } else hydrateFactory(e, t, r, afterHydrate, s);
}

function afterHydrate(e, t, r, s) {
 if ("function" == typeof t.afterHydrate) try {
  const n = t.afterHydrate(e.document);
  isPromise(n) ? n.then((() => {
   finalizeHydrate(e, e.document, t, r, s);
  })) : finalizeHydrate(e, e.document, t, r, s);
 } catch (n) {
  renderCatchError(r, n), finalizeHydrate(e, e.document, t, r, s);
 } else finalizeHydrate(e, e.document, t, r, s);
}

function finalizeHydrate(e, t, r, s, n) {
 try {
  if (inspectElement(s, t.documentElement, 0), !1 !== r.removeUnusedStyles) try {
   ((e, t) => {
    try {
     const r = e.head.querySelectorAll("style[data-styles]"), s = r.length;
     if (s > 0) {
      const n = (e => {
       const t = {
        attrs: new Set,
        classNames: new Set,
        ids: new Set,
        tags: new Set
       };
       return collectUsedSelectors(t, e), t;
      })(e.documentElement);
      for (let e = 0; e < s; e++) removeUnusedStyleText(n, t, r[e]);
     }
    } catch (e) {
     ((e, t, r) => {
      const s = {
       level: "error",
       type: "build",
       header: "Build Error",
       messageText: "build error",
       relFilePath: null,
       absFilePath: null,
       lines: []
      };
      null != t && (null != t.stack ? s.messageText = t.stack.toString() : null != t.message ? s.messageText = t.message.length ? t.message : "UNKNOWN ERROR" : s.messageText = t.toString()), 
      null == e || shouldIgnoreError(s.messageText) || e.push(s);
     })(t, e);
    }
   })(t, s.diagnostics);
  } catch (e) {
   renderCatchError(s, e);
  }
  if ("string" == typeof r.title) try {
   t.title = r.title;
  } catch (e) {
   renderCatchError(s, e);
  }
  s.title = t.title, r.removeScripts && removeScripts(t.documentElement);
  try {
   ((e, t) => {
    let r = e.head.querySelector('link[rel="canonical"]');
    "string" == typeof t ? (null == r && (r = e.createElement("link"), r.setAttribute("rel", "canonical"), 
    e.head.appendChild(r)), r.setAttribute("href", t)) : null != r && (r.getAttribute("href") || r.parentNode.removeChild(r));
   })(t, r.canonicalUrl);
  } catch (e) {
   renderCatchError(s, e);
  }
  try {
   (e => {
    const t = e.head;
    let r = t.querySelector("meta[charset]");
    null == r ? (r = e.createElement("meta"), r.setAttribute("charset", "utf-8")) : r.remove(), 
    t.insertBefore(r, t.firstChild);
   })(t);
  } catch (e) {}
  hasError(s.diagnostics) || (s.httpStatus = 200);
  try {
   const e = t.head.querySelector('meta[http-equiv="status"]');
   if (null != e) {
    const t = e.getAttribute("content");
    t && t.length > 0 && (s.httpStatus = parseInt(t, 10));
   }
  } catch (e) {}
  r.clientHydrateAnnotations && t.documentElement.classList.add("hydrated"), r.serializeToHtml && (s.html = serializeDocumentToString(t, r));
 } catch (e) {
  renderCatchError(s, e);
 }
 if (r.destroyWindow) try {
  r.destroyDocument || (e.document = null, t.defaultView = null), e.close && e.close();
 } catch (e) {
  renderCatchError(s, e);
 }
 n(s);
}

function serializeDocumentToString(e, t) {
 return serializeNodeToHtml(e, {
  approximateLineWidth: t.approximateLineWidth,
  outerHtml: !1,
  prettyHtml: t.prettyHtml,
  removeAttributeQuotes: t.removeAttributeQuotes,
  removeBooleanAttributeQuotes: t.removeBooleanAttributeQuotes,
  removeEmptyAttributes: t.removeEmptyAttributes,
  removeHtmlComments: t.removeHtmlComments,
  serializeShadowRoot: !1
 });
}

function isValidDocument(e) {
 return null != e && 9 === e.nodeType && null != e.documentElement && 1 === e.documentElement.nodeType && null != e.body && 1 === e.body.nodeType;
}

function removeScripts(e) {
 const t = e.children;
 for (let e = t.length - 1; e >= 0; e--) {
  const r = t[e];
  removeScripts(r), ("SCRIPT" === r.nodeName || "LINK" === r.nodeName && "modulepreload" === r.getAttribute("rel")) && r.remove();
 }
}

const templateWindows = new Map, isPromise = e => !!e && ("object" == typeof e || "function" == typeof e) && "function" == typeof e.then, hasError = e => null != e && 0 !== e.length && e.some((e => "error" === e.level && "runtime" !== e.type)), shouldIgnoreError = e => e === TASK_CANCELED_MSG, TASK_CANCELED_MSG = "task canceled", parseCss = (e, t) => {
 let r = 1, s = 1;
 const n = [], o = e => {
  const t = e.match(/\n/g);
  t && (r += t.length);
  const n = e.lastIndexOf("\n");
  s = ~n ? e.length - n : s + e.length;
 }, i = () => {
  const e = {
   line: r,
   column: s
  };
  return t => (t.position = new z(e), m(), t);
 }, a = o => {
  const i = e.split("\n"), a = {
   level: "error",
   type: "css",
   language: "css",
   header: "CSS Parse",
   messageText: o,
   absFilePath: t,
   lines: [ {
    lineIndex: r - 1,
    lineNumber: r,
    errorCharStart: s,
    text: e[r - 1]
   } ]
  };
  if (r > 1) {
   const t = {
    lineIndex: r - 1,
    lineNumber: r - 1,
    text: e[r - 2],
    errorCharStart: -1,
    errorLength: -1
   };
   a.lines.unshift(t);
  }
  if (r + 2 < i.length) {
   const e = {
    lineIndex: r,
    lineNumber: r + 1,
    text: i[r],
    errorCharStart: -1,
    errorLength: -1
   };
   a.lines.push(e);
  }
  return n.push(a), null;
 }, l = () => u(/^{\s*/), c = () => u(/^}/), u = t => {
  const r = t.exec(e);
  if (!r) return;
  const s = r[0];
  return o(s), e = e.slice(s.length), r;
 }, d = () => {
  let t;
  const r = [];
  for (m(), h(r); e.length && "}" !== e.charAt(0) && (t = w() || A()); ) r.push(t), 
  h(r);
  return r;
 }, m = () => u(/^\s*/), h = e => {
  let t;
  for (e = e || []; t = p(); ) e.push(t);
  return e;
 }, p = () => {
  const t = i();
  if ("/" !== e.charAt(0) || "*" !== e.charAt(1)) return null;
  let r = 2;
  for (;"" !== e.charAt(r) && ("*" !== e.charAt(r) || "/" !== e.charAt(r + 1)); ) ++r;
  if (r += 2, "" === e.charAt(r - 1)) return a("End of comment missing");
  const n = e.slice(2, r - 2);
  return s += 2, o(n), e = e.slice(r), s += 2, t({
   type: 1,
   comment: n
  });
 }, f = () => {
  const e = u(/^([^{]+)/);
  return e ? trim(e[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, (function(e) {
   return e.replace(/,/g, "‌");
  })).split(/\s*(?![^(]*\)),\s*/).map((function(e) {
   return e.replace(/\u200C/g, ",");
  })) : null;
 }, g = () => {
  const e = i();
  let t = u(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
  if (!t) return null;
  if (t = trim(t[0]), !u(/^:\s*/)) return a("property missing ':'");
  const r = u(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/), s = e({
   type: 4,
   property: t.replace(commentre, ""),
   value: r ? trim(r[0]).replace(commentre, "") : ""
  });
  return u(/^[;\s]*/), s;
 }, y = () => {
  const e = [];
  if (!l()) return a("missing '{'");
  let t;
  for (h(e); t = g(); ) e.push(t), h(e);
  return c() ? e : a("missing '}'");
 }, C = () => {
  let e;
  const t = [], r = i();
  for (;e = u(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/); ) t.push(e[1]), u(/^,\s*/);
  return t.length ? r({
   type: 9,
   values: t,
   declarations: y()
  }) : null;
 }, S = (e, t) => {
  const r = new RegExp("^@" + e + "\\s*([^;]+);");
  return () => {
   const s = i(), n = u(r);
   if (!n) return null;
   const o = {
    type: t
   };
   return o[e] = n[1].trim(), s(o);
  };
 }, E = S("import", 7), b = S("charset", 0), T = S("namespace", 11), w = () => "@" !== e[0] ? null : (() => {
  const e = i();
  let t = u(/^@([-\w]+)?keyframes\s*/);
  if (!t) return null;
  const r = t[1];
  if (t = u(/^([-\w]+)\s*/), !t) return a("@keyframes missing name");
  const s = t[1];
  if (!l()) return a("@keyframes missing '{'");
  let n, o = h();
  for (;n = C(); ) o.push(n), o = o.concat(h());
  return c() ? e({
   type: 8,
   name: s,
   vendor: r,
   keyframes: o
  }) : a("@keyframes missing '}'");
 })() || (() => {
  const e = i(), t = u(/^@media *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]);
  if (!l()) return a("@media missing '{'");
  const s = h().concat(d());
  return c() ? e({
   type: 10,
   media: r,
   rules: s
  }) : a("@media missing '}'");
 })() || (() => {
  const e = i(), t = u(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
  return t ? e({
   type: 2,
   name: trim(t[1]),
   media: trim(t[2])
  }) : null;
 })() || (() => {
  const e = i(), t = u(/^@supports *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]);
  if (!l()) return a("@supports missing '{'");
  const s = h().concat(d());
  return c() ? e({
   type: 15,
   supports: r,
   rules: s
  }) : a("@supports missing '}'");
 })() || E() || b() || T() || (() => {
  const e = i(), t = u(/^@([-\w]+)?document *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]), s = trim(t[2]);
  if (!l()) return a("@document missing '{'");
  const n = h().concat(d());
  return c() ? e({
   type: 3,
   document: s,
   vendor: r,
   rules: n
  }) : a("@document missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@page */)) return null;
  const t = f() || [];
  if (!l()) return a("@page missing '{'");
  let r, s = h();
  for (;r = g(); ) s.push(r), s = s.concat(h());
  return c() ? e({
   type: 12,
   selectors: t,
   declarations: s
  }) : a("@page missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@host\s*/)) return null;
  if (!l()) return a("@host missing '{'");
  const t = h().concat(d());
  return c() ? e({
   type: 6,
   rules: t
  }) : a("@host missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@font-face\s*/)) return null;
  if (!l()) return a("@font-face missing '{'");
  let t, r = h();
  for (;t = g(); ) r.push(t), r = r.concat(h());
  return c() ? e({
   type: 5,
   declarations: r
  }) : a("@font-face missing '}'");
 })(), A = () => {
  const e = i(), t = f();
  return t ? (h(), e({
   type: 13,
   selectors: t,
   declarations: y()
  })) : a("selector missing");
 };
 class z {
  constructor(e) {
   this.start = e, this.end = {
    line: r,
    column: s
   }, this.source = t;
  }
 }
 return z.prototype.content = e, {
  diagnostics: n,
  ...addParent((() => {
   const e = d();
   return {
    type: 14,
    stylesheet: {
     source: t,
     rules: e
    }
   };
  })())
 };
}, trim = e => e ? e.trim() : "", addParent = (e, t) => {
 const r = e && "string" == typeof e.type, s = r ? e : t;
 for (const t in e) {
  const r = e[t];
  Array.isArray(r) ? r.forEach((function(e) {
   addParent(e, s);
  })) : r && "object" == typeof r && addParent(r, s);
 }
 return r && Object.defineProperty(e, "parent", {
  configurable: !0,
  writable: !0,
  enumerable: !1,
  value: t || null
 }), e;
}, commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, getCssSelectors = e => {
 SELECTORS.all.length = SELECTORS.tags.length = SELECTORS.classNames.length = SELECTORS.ids.length = SELECTORS.attrs.length = 0;
 const t = (e = e.replace(/\./g, " .").replace(/\#/g, " #").replace(/\[/g, " [").replace(/\>/g, " > ").replace(/\+/g, " + ").replace(/\~/g, " ~ ").replace(/\*/g, " * ").replace(/\:not\((.*?)\)/g, " ")).split(" ");
 for (let e = 0, r = t.length; e < r; e++) t[e] = t[e].split(":")[0], 0 !== t[e].length && ("." === t[e].charAt(0) ? SELECTORS.classNames.push(t[e].slice(1)) : "#" === t[e].charAt(0) ? SELECTORS.ids.push(t[e].slice(1)) : "[" === t[e].charAt(0) ? (t[e] = t[e].slice(1).split("=")[0].split("]")[0].trim(), 
 SELECTORS.attrs.push(t[e].toLowerCase())) : /[a-z]/g.test(t[e].charAt(0)) && SELECTORS.tags.push(t[e].toLowerCase()));
 return SELECTORS.classNames = SELECTORS.classNames.sort(((e, t) => e.length < t.length ? -1 : e.length > t.length ? 1 : 0)), 
 SELECTORS;
}, SELECTORS = {
 all: [],
 tags: [],
 classNames: [],
 ids: [],
 attrs: []
}, serializeCssVisitNode = (e, t, r, s) => {
 const n = t.type;
 return 4 === n ? serializeCssDeclaration(t, r, s) : 13 === n ? serializeCssRule(e, t) : 1 === n ? "!" === t.comment[0] ? `/*${t.comment}*/` : "" : 10 === n ? serializeCssMedia(e, t) : 8 === n ? serializeCssKeyframes(e, t) : 9 === n ? serializeCssKeyframe(e, t) : 5 === n ? serializeCssFontFace(e, t) : 15 === n ? serializeCssSupports(e, t) : 7 === n ? "@import " + t.import + ";" : 0 === n ? "@charset " + t.charset + ";" : 12 === n ? serializeCssPage(e, t) : 6 === n ? "@host{" + serializeCssMapVisit(e, t.rules) + "}" : 2 === n ? "@custom-media " + t.name + " " + t.media + ";" : 3 === n ? serializeCssDocument(e, t) : 11 === n ? "@namespace " + t.namespace + ";" : "";
}, serializeCssRule = (e, t) => {
 const r = t.declarations, s = e.usedSelectors, n = t.selectors.slice();
 if (null == r || 0 === r.length) return "";
 if (s) {
  let t, r, o = !0;
  for (t = n.length - 1; t >= 0; t--) {
   const i = getCssSelectors(n[t]);
   o = !0;
   let a = i.classNames.length;
   if (a > 0 && e.hasUsedClassNames) for (r = 0; r < a; r++) if (!s.classNames.has(i.classNames[r])) {
    o = !1;
    break;
   }
   if (o && e.hasUsedTags && (a = i.tags.length, a > 0)) for (r = 0; r < a; r++) if (!s.tags.has(i.tags[r])) {
    o = !1;
    break;
   }
   if (o && e.hasUsedAttrs && (a = i.attrs.length, a > 0)) for (r = 0; r < a; r++) if (!s.attrs.has(i.attrs[r])) {
    o = !1;
    break;
   }
   if (o && e.hasUsedIds && (a = i.ids.length, a > 0)) for (r = 0; r < a; r++) if (!s.ids.has(i.ids[r])) {
    o = !1;
    break;
   }
   o || n.splice(t, 1);
  }
 }
 if (0 === n.length) return "";
 const o = [];
 let i = "";
 for (const e of t.selectors) i = removeSelectorWhitespace(e), o.includes(i) || o.push(i);
 return `${o}{${serializeCssMapVisit(e, r)}}`;
}, serializeCssDeclaration = (e, t, r) => "" === e.value ? "" : r - 1 === t ? e.property + ":" + e.value : e.property + ":" + e.value + ";", serializeCssMedia = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules);
 return "" === r ? "" : "@media " + removeMediaWhitespace(t.media) + "{" + r + "}";
}, serializeCssKeyframes = (e, t) => {
 const r = serializeCssMapVisit(e, t.keyframes);
 return "" === r ? "" : "@" + (t.vendor || "") + "keyframes " + t.name + "{" + r + "}";
}, serializeCssKeyframe = (e, t) => t.values.join(",") + "{" + serializeCssMapVisit(e, t.declarations) + "}", serializeCssFontFace = (e, t) => {
 const r = serializeCssMapVisit(e, t.declarations);
 return "" === r ? "" : "@font-face{" + r + "}";
}, serializeCssSupports = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules);
 return "" === r ? "" : "@supports " + t.supports + "{" + r + "}";
}, serializeCssPage = (e, t) => "@page " + t.selectors.join(", ") + "{" + serializeCssMapVisit(e, t.declarations) + "}", serializeCssDocument = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules), s = "@" + (t.vendor || "") + "document " + t.document;
 return "" === r ? "" : s + "{" + r + "}";
}, serializeCssMapVisit = (e, t) => {
 let r = "";
 if (t) for (let s = 0, n = t.length; s < n; s++) r += serializeCssVisitNode(e, t[s], s, n);
 return r;
}, removeSelectorWhitespace = e => {
 let t = "", r = "", s = !1;
 for (let n = 0, o = (e = e.trim()).length; n < o; n++) if (r = e[n], "[" === r && "\\" !== t[t.length - 1] ? s = !0 : "]" === r && "\\" !== t[t.length - 1] && (s = !1), 
 !s && CSS_WS_REG.test(r)) {
  if (CSS_NEXT_CHAR_REG.test(e[n + 1])) continue;
  if (CSS_PREV_CHAR_REG.test(t[t.length - 1])) continue;
  t += " ";
 } else t += r;
 return t;
}, removeMediaWhitespace = e => {
 let t = "", r = "";
 for (let s = 0, n = (e = e.trim()).length; s < n; s++) if (r = e[s], CSS_WS_REG.test(r)) {
  if (CSS_WS_REG.test(t[t.length - 1])) continue;
  t += " ";
 } else t += r;
 return t;
}, CSS_WS_REG = /\s/, CSS_NEXT_CHAR_REG = /[>\(\)\~\,\+\s]/, CSS_PREV_CHAR_REG = /[>\(\~\,\+]/, collectUsedSelectors = (e, t) => {
 if (null != t && 1 === t.nodeType) {
  const r = t.children, s = t.nodeName.toLowerCase();
  e.tags.add(s);
  const n = t.attributes;
  for (let r = 0, s = n.length; r < s; r++) {
   const s = n.item(r), o = s.name.toLowerCase();
   if (e.attrs.add(o), "class" === o) {
    const r = t.classList;
    for (let t = 0, s = r.length; t < s; t++) e.classNames.add(r.item(t));
   } else "id" === o && e.ids.add(s.value);
  }
  if (r) for (let t = 0, s = r.length; t < s; t++) collectUsedSelectors(e, r[t]);
 }
}, removeUnusedStyleText = (e, t, r) => {
 try {
  const s = parseCss(r.innerHTML);
  if (t.push(...s.diagnostics), hasError(t)) return;
  try {
   r.innerHTML = ((e, t) => {
    const r = t.usedSelectors || null, s = {
     usedSelectors: r || null,
     hasUsedAttrs: !!r && r.attrs.size > 0,
     hasUsedClassNames: !!r && r.classNames.size > 0,
     hasUsedIds: !!r && r.ids.size > 0,
     hasUsedTags: !!r && r.tags.size > 0
    }, n = e.rules;
    if (!n) return "";
    const o = n.length, i = [];
    for (let e = 0; e < o; e++) i.push(serializeCssVisitNode(s, n[e], e, o));
    return i.join("");
   })(s.stylesheet, {
    usedSelectors: e
   });
  } catch (e) {
   t.push({
    level: "warn",
    type: "css",
    header: "CSS Stringify",
    messageText: e
   });
  }
 } catch (e) {
  t.push({
   level: "warn",
   type: "css",
   header: "CSS Parse",
   messageText: e
  });
 }
}, SKIP_ATTRS = new Set([ "s-id", "c-id" ]), createHydrateBuildId = () => {
 let e = "abcdefghijklmnopqrstuvwxyz", t = "";
 for (;t.length < 8; ) t += e[Math.floor(Math.random() * e.length)], 1 === t.length && (e += "0123456789");
 return t;
};

exports.createWindowFromHtml = createWindowFromHtml;
exports.hydrateDocument = hydrateDocument;
exports.renderToString = renderToString;
exports.serializeDocumentToString = serializeDocumentToString;
