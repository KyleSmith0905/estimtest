import { h, proxyCustomElement, HTMLElement as HTMLElement$1, Fragment, Host } from '@stencil/core/internal/client';

const defaultEstimtestAttributes = {
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
const transferElement = (moveElement, newParent) => {
  moveElement.parentNode.removeChild(moveElement);
  newParent.appendChild(moveElement);
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
  wrapper.foreground.style.setProperty('backdrop-filter', `url("data:image/svg+xml,${colorBlindFilter}#estimtest-filter-color-blind")`);
};

const activateFontSize = (wrapper, test) => {
  const fontSizeBefore = getComputedStyle(document.documentElement).getPropertyValue('font-size');
  // Ensure that the estimtest components are not effected by the font size changes.
  wrapper.host.style.setProperty('font-size', fontSizeBefore);
  // Save the font size style property for when it resets.
  document.documentElement.dataset.beforeFontSize = fontSizeBefore;
  // Change the font size of the root element.
  document.documentElement.style.setProperty('font-size', `${test.fontSize}px`);
};

const activateKeyboardOnly = (wrapper, _) => {
  wrapper.content.style.setProperty('pointer-events', 'none');
};

const resetTest = (hostElement) => {
  const parent = hostElement.parentElement;
  let container = parent.querySelector(':scope > #estimtest-container');
  let content = parent.querySelector(':scope > #estimtest-container > #estimtest-content');
  // Revert back the estimtest container structure
  if (content) {
    transferChildren(content, hostElement.parentElement, (node) => { var _a; return (_a = node.id) === null || _a === void 0 ? void 0 : _a.startsWith('estimtest'); });
    container.remove();
  }
  // Revert changes in font-size
  document.documentElement.style.setProperty('font-size', document.documentElement.dataset.beforeFontSize);
  document.documentElement.removeAttribute('data-before-font-size');
};
const performTest = (hostElement, test, config) => {
  resetTest(hostElement);
  // Move estimtest-core component to user-specified location
  if (typeof config.moveSelector === 'string') {
    const newParent = document.querySelector(config.moveSelector);
    transferElement(hostElement, newParent);
  }
  // Create wrapper element
  const container = document.createElement('div');
  container.id = 'estimtest-container';
  container.style.setProperty('width', '100%');
  hostElement.before(container);
  const content = document.createElement('div');
  content.id = 'estimtest-content';
  container.appendChild(content);
  const foreground = document.createElement('div');
  foreground.id = 'foreground-content';
  foreground.style.setProperty('position', 'fixed');
  foreground.style.setProperty('inset', '0rem');
  foreground.style.setProperty('z-index', '1000');
  foreground.style.setProperty('pointer-events', 'none');
  container.appendChild(foreground);
  transferChildren(hostElement.parentElement, content, (node) => { var _a; return ((_a = node.id) === null || _a === void 0 ? void 0 : _a.startsWith('estimtest')) || node.tagName === 'ESTIMTEST-CORE'; });
  const elements = {
    container: container,
    content: content,
    foreground: foreground,
    host: hostElement,
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
const require$$1$1 = {
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
const require$$1 = {
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
const require$$0$1 = {
	amp: amp,
	apos: apos,
	gt: gt,
	lt: lt,
	quot: quot
};

const require$$0 = {
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
  return (h("svg", { class: 'square', style: { '--size': '1.7em' }, viewBox: '0 0 110.07 135.47' },
    h("title", null, "Estimtest, a manual testing library"),
    h("path", { fill: '#fff', d: 'M23.95 84.67H0v23.94l26.85 26.86h74.75V101.6H40.88ZM26.85 0 0 26.85V50.8h23.95l16.93-16.93h60.72V0Zm-2.9 50.8v33.87h86.12V50.8Z', color: '#000' })));
};
const CloseIcon = () => {
  return (h("svg", { class: 'square', style: { '--size': '1em' }, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 67.7 67.7' },
    h("title", null, "Close"),
    h("path", { fill: 'none', stroke: '#fff', "stroke-linecap": 'round', "stroke-linejoin": 'round', "stroke-width": '16.9', d: 'm8.5 8.5 50.8 50.8m-50.8 0L59.3 8.5' })));
};
const ChevronIcon = ({ direction }) => {
  return (h("svg", { style: { '--size': '1em' }, class: {
      'upside-down': direction === 'down',
      square: true,
    }, viewBox: '0 0 67.7 36' },
    h("path", { fill: 'none', stroke: '#fff', "stroke-linecap": 'round', "stroke-linejoin": 'round', "stroke-width": '16.9', d: 'm8.5 27.5 25.4-19 25.4 19' })));
};

const coreCss = ".full-screen{position:fixed;width:100%;height:100%;top:0em;pointer-events:none;z-index:1000}.full-width{width:100%}.absolute-bottom{position:absolute;bottom:0.5em;left:50%;transform:translateX(-50%)}.absolute-top{position:absolute;top:0.5em;left:50%;transform:translateX(-50%)}.absolute-center{position:absolute;top:0.5em;left:50%;top:50%;transform:translateX(-50%) translateY(-50%)}.flex-row{display:flex;align-items:center;gap:0.8em}.flex-column{display:flex;flex-direction:column;align-items:center;gap:0.8em}.upside-down{transform:rotateZ(180deg)}.bold{font-weight:bold}.square{width:var(--size);height:var(--size)}.clickable{cursor:pointer;filter:drop-shadow(0em 0em 0em hsla(0, 0%, 100%, 0.7));transition:filter ease 250ms}.clickable:hover{filter:drop-shadow(rgba(255, 255, 255, 0.7) 0em 0em 1em)}.auto-resize-textarea{resize:none;overflow:hidden;height:18px}.will-animate-blur{opacity:0;filter:blur(16px);pointer-events:none !important;transition:filter ease 300ms, opacity ease 300ms}.will-animate-blur.animate-blur{pointer-events:all !important;opacity:1;filter:blur(0px)}.title{font-size:1.2em;font-weight:bold;margin:0em;z-index:1000}.caption{font-size:1.1em;opacity:0.6;margin:0em}.paragraph{margin:0em;opacity:0.9;text-align:left}.box{width:fit-content;max-width:90%;max-height:calc(100% - 3em);padding:0.7em 1.4em;border-radius:1em;border-style:solid;border-width:1px;border-color:hsl(0, 0%, 30%);background:linear-gradient(45deg, hsl(0, 0%, 0%), hsl(0, 0%, 10%));color:hsl(0, 0%, 100%);box-shadow:0em 0em 1em 0em hsl(0, 0%, 15%);pointer-events:all;overflow-x:hidden;overflow-y:auto}.button{display:flex;padding:0.5em 1em;border-style:solid;border-color:hsl(0, 0%, 20%);border-width:1px;border-radius:1em;background:hsl(0, 0%, 10%);color:hsl(0, 0%, 100%);font-size:0.9em;cursor:pointer}.button:hover{border-color:hsl(0, 0%, 40%)}.full-screen,button{font-family:\"Azeret Mono\", monospace;font-weight:200}.results-grid{gap:0.2em;text-align:left}.results-grid>*{padding:0.3em 1em;border-radius:0.5em;border-style:solid;border-width:1px;}.results-grid>*.fail{background-color:hsla(0, 100%, 50%, 0.1);border-color:hsl(0, 100%, 50%)}.results-grid>*.pass{background-color:hsla(120, 100%, 30%, 0.1);border-color:hsl(120, 100%, 30%)}.results-grid>*>*:first-child{max-width:12em;min-width:12em}";

const Estimtest = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.experiments = undefined;
    this.moveSelector = undefined;
    this.active = true;
    this.status = 'inactive';
    this.activeConfig = defaultEstimtestAttributes;
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
    if (this.active.toString() === 'true') {
      this.promptBeginExperiments();
    }
  }
  componentDidLoad() {
    // Add custom font to page DOM since font-face doesn't work within Shadow DOM.
    const fontCssUrl = 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@300&display=swap';
    let element = document.querySelector(`link[href="${fontCssUrl}"]`);
    // Only inject the element if it's not yet present
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', 'stylesheet');
      element.setAttribute('href', fontCssUrl);
      document.head.appendChild(element);
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
    performTest(this.hostElement, this.activeTest, this.activeConfig);
  }
  /**
   * Progress to the next test in the config.
   * This does not need to be manually implemented, the UI elements perform the same event.
   */
  async nextExperiment(results) {
    this.testResults.push(Object.assign({ results: results, notes: this.activeTest.notes }, this.activeTest));
    const nextIndex = this.activeTest.index + 1;
    if (nextIndex >= this.activeConfig.experiments.length) {
      this.finishExperiments();
      return;
    }
    this.activeTest = Object.assign({ index: nextIndex }, this.activeConfig.experiments[nextIndex]);
    // Delay the auto resize to ensure text is removed during resize
    setTimeout(() => {
      autoResizeTextarea(this.testFeedbackElement);
    });
    performTest(this.hostElement, this.activeTest, this.activeConfig);
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
    // Build together a config from the multiple props.
    else {
      this.activeConfig = defaultEstimtestAttributes;
      if (typeof this.moveSelector === 'string') {
        this.activeConfig.moveSelector = this.moveSelector;
      }
      if (this.experiments !== undefined) {
        if (typeof this.experiments === 'string') {
          this.activeConfig.experiments = JSON.parse(this.experiments);
        }
        else {
          this.activeConfig.experiments = this.experiments;
        }
      }
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
    // Print the exported results to the console.
    console.log(this.testResults);
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
    if (this.active.toString() !== 'true')
      return h(Fragment, null);
    else if (this.status === 'inactive')
      return h(Fragment, null);
    return (h(Host, null, h("div", { class: 'full-screen' }, h("div", null, Object.values(this.errors).map((element, i) => (h("div", { key: i, class: 'absolute-top box' }, h("h2", { class: 'title' }, "Error"), h("p", null, element.message))))), h("div", { "data-test": "prompt-box", class: {
        'absolute-bottom box will-animate-blur': true,
        'animate-blur': this.status === 'prompted',
      }, ref: conditionallySetInert(this.status === 'prompted') }, h("div", { class: 'flex-row' }, h(EstimtestLogo, null), h("button", { class: 'button', onClick: () => this.startExperiments() }, "Start Testing"))), h("div", { "data-test": "test-box", class: {
        'absolute-bottom box will-animate-blur': true,
        'animate-blur': this.status === 'active',
      }, ref: conditionallySetInert(this.status === 'active') }, h("div", { class: 'flex-column' }, h("div", { class: 'flex-row' }, h("p", { class: 'title' }, (_b = (_a = this.activeTest) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ''), h("p", { class: 'caption' }, ((_c = this.activeTest) === null || _c === void 0 ? void 0 : _c.index) + 1, "/", (_d = this.activeConfig) === null || _d === void 0 ? void 0 :
      _d.experiments.length), h("button", { onClick: () => this.toggleTestDetails(), class: 'button' }, h(ChevronIcon, { direction: this.expandedTestActive ? 'down' : 'up' }))), h("div", { class: 'flex-row' }, h("textarea", { class: 'auto-resize-textarea button', value: (_e = this.activeTest) === null || _e === void 0 ? void 0 : _e.notes, ref: (el) => this.testFeedbackElement = el, onChange: (event) => (this.activeTest = Object.assign(Object.assign({}, this.activeTest), { notes: getEventValue(event) })), onInput: (event) => (this.activeTest = Object.assign(Object.assign({}, this.activeTest), { notes: getEventValue(event) })) }), h("button", { class: 'button', onClick: () => this.nextExperiment('pass') }, "Pass"), h("button", { class: 'button', onClick: () => this.nextExperiment('fail') }, "Fail")))), h("div", { "data-test": "finish-box", class: {
        'absolute-center box will-animate-blur': true,
        'animate-blur': this.status === 'finished',
      }, ref: conditionallySetInert(this.status === 'finished') }, h("div", { class: 'flex-column' }, h("h2", { class: 'title' }, "Estimtest Finished"), h("div", { class: 'flex-column results-grid' }, this.testResults.map((result) => (h("div", { class: `flex-row full-width ${result.results}` }, h("p", { onClick: () => this.toggleTestDetails(result), class: 'paragraph clickable bold' }, result.name), h("p", { class: 'paragraph', style: {
        opacity: result.notes === undefined ? '0.5' : '0.9',
      } }, result.notes === undefined
      ? 'No notes added'
      : result.notes))))), h("div", { class: 'flex-row' }, h("button", { onClick: () => this.exportResults(), class: 'button' }, "Export Results"), h("button", { onClick: () => this.promptBeginExperiments(), class: 'button' }, "Start Another Test")))), h("div", { "data-test": "details-box", class: {
        'absolute-center box will-animate-blur': true,
        'animate-blur': this.expandedTestActive,
      }, ref: conditionallySetInert(this.expandedTestActive) }, h("div", { class: 'flex-column' }, h("div", { class: 'flex-row' }, h("h2", { class: 'title' }, (_f = this.expandedTest) === null || _f === void 0 ? void 0 : _f.name), h("button", { class: 'button', onClick: () => this.toggleTestDetails() }, h(CloseIcon, null))), h("div", { class: 'paragraph', innerHTML: this.testDetailsDescription }))), h("div", { class: {
        'absolute-center box will-animate-blur': true,
        'animate-blur': this.exportedResultsActive,
      }, ref: conditionallySetInert(this.exportedResultsActive) }, h("div", { class: 'flex-column' }, h("h2", { class: 'title' }, "Exported Test Results"), h("p", { class: 'paragraph', innerHTML: this.exportedResults }), h("button", { onClick: () => this.exportedResultsActive = false, class: 'button' }, "Back"))))));
  }
  get hostElement() { return this; }
  static get watchers() { return {
    "experiments": ["watchConfigHandler"],
    "activeTest": ["watchActiveTestHandler"]
  }; }
  static get style() { return coreCss; }
}, [1, "estimtest-core", {
    "experiments": [1],
    "moveSelector": [1, "move-selector"],
    "active": [8],
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
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["estimtest-core"];
  components.forEach(tagName => { switch (tagName) {
    case "estimtest-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Estimtest);
      }
      break;
  } });
}

const EstimtestCore = Estimtest;
const defineCustomElement = defineCustomElement$1;

export { EstimtestCore, defineCustomElement };
