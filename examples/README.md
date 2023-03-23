## Examples

All examples should have minimal editing applied from the default "getting started" app; the only thing changed should be related to adding Estimtest to the app. Unless specified scrips will not have Estimtest active.

`npm run dev` runs the dev server with Estimtest disabled.
`npm run dev:estimtest` runs the dev server with Estimtest enabled.

All the examples that use Estimtest component libraries will have slightly increased bundle sizes. In those examples (`angular`, `vite-react`, and `vite-vue`) you can explore ways I attempted to conditionally remove Estimtest in production builds. This is not an issue with the Estimtest CLI.