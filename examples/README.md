## Examples

All examples should have minimal editing applied from the default "getting started" app; the only thing changed should be related to adding Estimtest to the app. Unless specified scrips will not have Estimtest active.

`npm run dev` runs the dev server with Estimtest disabled.
`npm run dev:estimtest` runs the dev server with Estimtest enabled.

| Tools | Before Estimtest[^1] | After Estimtest[^1] |
|---|---|
| Angular | 288951B | 289372B |
| Vite React | 53040B | 53545B |
| Vite Vue | 41200B | 41568B |

[^1]: Size of application is measured by using Chrome's dev tools and see the amount of bytes transferred. Both builds were production. `Before Estimtest` sizes were measured by entirely removing estimtest from the project.