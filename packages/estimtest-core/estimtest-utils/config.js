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
export { defaultEstimtestAttributes };
