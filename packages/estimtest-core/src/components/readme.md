e# estimtest-core



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Type                                                                                                    | Default     |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------- |
| `active` | `active`  | Whether to show the testing prompt on the bottom of the screen. Set this value to `false` to no longer see the estimtest bar.                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                               | `true`      |
| `tests`  | --        | The tests to be performed on the app. This is set by default to perform a `Large Font Size` and `Mobile Screen Size` test. This field accepts an array of objects each with the properties:  `name` A quick ~15 letters title summarizing the test\ `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).\ `fontSize` The font size to set the page.\ `width` The width to set the page.\ `height` The height to set the page. | `Pick<EstimtestTest, "name" \| "height" \| "width" \| "description" \| "fontSize" \| "keyboardOnly">[]` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
