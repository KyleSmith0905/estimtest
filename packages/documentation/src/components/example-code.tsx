import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React from 'react';

const exampleCode = [
  {
    name: 'Vanilla HTML',
    id: 'vanilla',
    codes: [
      {
        language: 'html',
        title: '/index.html',
        code: `\
<head>
  <script type="module">
    import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/estimtest-core/loader/index.es2017.js';
    defineCustomElements();
  </script>
</head>
<body>
  <!-- APP -->
  <estimtest-core></estimtest-core>
</body>\
        `
      },
    ],
  },
  {
    name: 'Angular',
    id: 'angular',
    codes: [
      {
        language: 'ts',
        title: '/src/app/app.module.ts',
        code: `\
import { EstimtestModule } from "estimtest-angular";

@NgModule({
  imports: [EstimtestModule],
})
export class AppModule { }\
        `
      },
      {
        language: 'html',
        title: '/src/app/app.component.html',
        code: `\
<!-- APP -->
<estimtest-core/>\
        `
      },
    ],
  },
  {
    name: 'React',
    id: 'react',
    codes: [
      {
        language: 'tsx',
        title: '/src/index.tsx',
        code: `\
import { EstimtestCore, defineCustomElements } from 'estimtest-react'

defineCustomElements();

const Root = () => {
  return (
    {/* APP */}
    <EstimtestCore />
  )
}\
        `
      },
    ],
  },
  {
    name: 'Vue',
    id: 'vue',
    codes: [
      {
        language: 'ts',
        title: '/src/main.ts',
        code: `\
import { EstimtestLibrary } from 'estimtest-vue';

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('estimtest');
app.use(EstimtestLibrary);
app.mount('#app')\
        `
      },
      {
        language: 'html',
        title: '/src/App.vue',
        code: `\
<template>
  <!-- APP -->
  <estimtest-core/>
</template>\
        `
      },
    ],
  },
]

const ExampleCode = () => {
  return (
    <div>
      <Tabs
        defaultValue='vanilla'
        groupId='framework'
      >
        {exampleCode.map((framework) => (
          <TabItem key={framework.id} value={framework.id} label={framework.name}>
            {framework.codes.map((codeDetails) => (
              <CodeBlock
                key={codeDetails.code}
                language={codeDetails.language}
                title={codeDetails.title}
                showLineNumbers={true}
              >
                {codeDetails.code}
              </CodeBlock>
            ))}
          </TabItem>
        ))}
      </Tabs>
    </div>
  )
}

export default ExampleCode;