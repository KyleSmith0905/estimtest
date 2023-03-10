![Estimtest, experiment your website accessibility](/media/estimtest-banner.png)

---

# Estimtest Angular
Estimtest is an experimentation tool that simulates accessibility concerns. Accessibility is crucial, but unexpectedly, difficult to test.

## Usage
Feel free to checkout the [examples](examples), or open an [issue](https://github.com/KyleSmith0905/estimtest/issues) for support.

- Apply the component as a sibling or child of a container. For example, as a child of `<body></body>`.
- The `estimtest-core` element should cover up the entire screen in absolute position.

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
  [active]="true"
  [experiments]="[{name: 'Hello World', description: 'hello', fontSize: 32}]"
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