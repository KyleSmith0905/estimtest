## Examples

All examples should have minimal editing applied from the default "getting started" app; the only thing changed should be related to adding Estimtest to the app. Unless specified the all scrips will not have Estimtest active.

| Tools | Before Estimtest[^1] | After Estimtest[^1] |
|---|---|
| Angular | n/a |
| Next JS | n/a |
| Vite React | 53040B | 53545B |
| Vite Vue | 112 Bytes | 109316B |

[^1]: Size of application is measured by using Chrome's dev tools and see the amount of bytes transferred. Both builds were production. `Before Estimtest` sizes were measured by entirely removing estimtest from the project.