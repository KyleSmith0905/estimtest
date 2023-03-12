![Estimtest, experiment your website accessibility](/media/estimtest-banner.png)

---

# Estimtest
Estimtest is an experimentation tool that simulates accessibility concerns. Accessibility is crucial, but unexpectedly, difficult to test.

## Usage
Feel free to checkout the [examples](examples), or open an [issue](https://github.com/KyleSmith0905/estimtest/issues) for support.

- Apply the component as a sibling or child of a container. For example, as a child of `<body></body>`.
- The `estimtest-core` element should cover up the entire screen in absolute position.

### Vanilla
Load the component by importing it
```html
<script type="module">
  // Must deploy on CDN to implement this.
  import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/estimtest-core/loader/index.es2017.js';
  defineCustomElements();
</script>
```
Add the component 
```html
<estimtest-core
  active='true'
  move-selector='body'
  experiments='[{"name": "Hello World", "description": "hello", "fontSize": 32}]'
></estimtest-core>
```

### React
Load the component by importing it
```jsx
// index.tsx
import { EstimtestCore, defineCustomElements } from 'estimtest-react'

defineCustomElements();
```
Add the component
```jsx
// index.tsx
<EstimtestCore
  active={true}
  experiments={[
    {name: "Hello World", description: "hello", fontSize: 32}
  ]}
  moveSelector='body'
  className='full-screen'
/>
```

### Angular
Load the component by adding the Estimtest module to the app module imports.
```ts
// app.module.ts
import { EstimtestModule } from "estimtest-angular";

@NgModule({
  ...
  imports: [..., EstimtestModule],
  ...
})
export class AppModule { }
```
Add the component
```html
<!-- app.component.html -->
<estimtest-core
  move-selector="body"
  [active]="true"
  [experiments]="[{name: 'Hello World', description: 'hello', fontSize: 32}]"
/>
```

### Vue
Load the component by adding the Estimtest module to the app module imports.
```ts
// main.ts
import { EstimtestLibrary } from 'estimtest-vue';

...
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('estimtest');
app.use(EstimtestLibrary);
...
```

```vue
<!-- App.vue -->
<estimtest-core
  class="full-screen"
  move-selector="body"
  :active="true"
  :experiments="JSON.stringify([{name: 'Hello World', description: 'hello', fontSize: 32}])"
/>
```

## Configuration

Use HTML attributes to modify props.

**active** `boolean` - Whether to activate the Estimtest prompt. Having this as false still imports the library but does not use it. Look at the [examples](examples) for sloppy implementations of fully removing Estimtest in production.

**experiments** `{
  name: string,
  description: string,
  fontSize?: number,
  colorBlind?: ColorBlind,
  keyboardOnly?: boolean
}[]` - The experiments to be performed on the app. This is set by default to perform multiple standard tests of common accessibility problems. This field accepts an array of objects each with the properties:
- `name` A quick ~15 letters title summarizing the test.
- `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).
- `fontSize` The font size to set the page. Many users have difficulty reading text at the default font size, users fix this by increasing the default font size.
- `colorBlind` A change of colors on the page reflecting what colorblind users may see.
- `keyboardOnly` Many users may use keyboard navigation for a variety of reasons such as: Motor impairment, saving time, and more.

**moveSelector** `string` - An element selector containing the parent of where the element should be at. You could use this property in the event that your code does not permit you to place the element there.

## Contributing
If you have suggestions, feedback, issues, or bugs, please open an issue.

If are willing to contribute to Estimtest, please open a pull request.