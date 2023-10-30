# Quick start

This is a quick guide on how to get mtcute up and running as fast as possible.

## NodeJS

For bots in NodeJS, there's a special package that scaffolds a project for you:

```bash
pnpm create @mtcute/bot my-awesome-bot
```

Just follow the instructions and you'll get a working bot in no time!

### Manually

For existing projects, you'll probably want to add it manually, though.

> **Note**: mtcute is currently targeting TypeScript 5.1. 
> If you are using an older version of TypeScript, please consider upgrading.

1. Get your API ID and Hash at
   [https://my.telegram.org/apps](https://my.telegram.org/apps).
2. Install `@mtcute/node` meta-package:

```bash
pnpm add @mtcute/node
```

3. Import the package and create a client:

```ts
import { NodeTelegramClient } from '@mtcute/node'

const tg = new NodeTelegramClient({
    apiId: API_ID,
    apiHash: 'API_HASH'
})

tg.run({ ... }, async (self) => {
    console.log(`Logged in as ${self.displayName}`)

    await tg.sendText('self', 'Hello from <b>MTCute</b>!')
})
```
4. That's literally it! Happy hacking 🚀

### Native crypto addon
mtcute also provides `@mtcute/crypto-node` package, that implements
a native NodeJS addon for crypto functions used in MTProto.

Using this addon improves overall library performance (especially when uploading/downloading files), 
so it is advised that you install it as well:

```bash
pnpm add @mtcute/crypto-node
```

When using `@mtcute/node`, native addon is loaded automatically,
no extra steps are required. Otherwise, you'll need to enable it manually:

```ts{4}
import { NodeNativeCryptoProvider } from '@mtcute/crypto-node'

const tg = new TelegramClient({
    crypto: () => new NodeNativeCryptoProvider(),
    ...
})
```

## Browser

For browsers, it is recommended to use [vite](https://vitejs.dev). 
Webpack is probably also fine, but you may need to do some extra configuration.

Usage in browsers is a less common use case, so there's no scaffolding tool for it yet.
You can still add the library manually, though:

```bash
pnpm add @mtcute/client
```

and then use it as you wish:

```ts
import { TelegramClient } from '@mtcute/client'

const tg = new TelegramClient({
    apiId: 123456,
    apiHash: '0123456789abcdef0123456789abcdef',
})

tg.call({ _: 'help.getConfig' }).then((res) => console.log(res))
```

See also: [Tree-shaking](/guide/topics/treeshaking.md)

## Other runtimes

### Bun
Bun is not actively supported, but mtcute seems to work fine with it.

You can use it the same way as in NodeJS.

### Deno
If your project is using Deno, you should consider deleting your project.

Deno is not supported and **will never be supported**.
It is a terrible platform that is not suitable for anything.

### Anything else?

mtcute supports both ESM and CJS, so it should work in any environment that supports either of them,
as long as it also supports these featues:
  - `ArrayBuffer`, `Uint8Array`, `TextEncoder/TextDecoder` - for binary data
  - `ReadableStream` - for uploading/downloading files

Of course, nothing is stopping you from bundling the library with Webpack or Rollup and using some polyfills.

You'll also likely have to implement custom storage, networking and crypto, 
see [Storage](/guide/topics/storage.md) and [Transport](/guide/topics/transport.md) for more info.

If you manage to get mtcute working in some exotic environment, please let me know!