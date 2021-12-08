# Webpack Trigger Route on Emit Plugin

This plugin allows you to have designated routes be pinged each time assets are emitted

Pass a configuration object to each instance of the plugin (one instance for each baseURL)

Pass a baseURL as a string, and routes as an array of strings

The options passed to the plugin is represented as follows:

```typescript
type CheckTriggerType = () => Promise<boolean> | boolean;

interface IOptions {
  routes: string[];
  baseURL: string;
  initialCheckTrigger?: CheckTriggerType;
  beforeCheckTrigger?: CheckTriggerType;
}
```

If you pass an initalCheckTrigger function (has to return either a boolean value or a Promise that resolves to a boolean value), then the pinging will only happen after the first time the initialCheckTrigger returns true

It will be called each time on emit, and the pinging on routes will happen only after it resolves to true

If you also specifiy a beforeCheckTrigger, then before the pinging happens, each time the beforeCheckTrigger function would be called. Whenever it resolves to true, pinging will occur

## Motivation

### The Story

So I have webpack workflow [(the titans-branches branch)](https://github.com/Komefumi/scully-blastique/tree/titan-branches) of [scully-blastique](https://github.com/Komefumi/scully-blastique)

Here I import a handlebars template into the index.tsx entry file, and ping a koa-js server that receives the request with a designated file name and contents

It then emits the file to a top level directory in the project named generated-pages

This has to happen each time the handlebars files are updated. The generated-pages folder is served by a third livereload server

All in all, a bit chaotic but why not? I wanted to have some fun.

Plus I've got to learn a great deal lot in the process.

### And Now What I've Got

You have a plugin that's reasonably straightforward to reason out the internals of. You can fork it, parse the contents, build something entirely new using this code as a basis. I will be maintaining this but I'll accept pull requests.

Just make sure you keep your pulls systematic so we can try to track things properly :)

Thanks for coming to my TED talk
