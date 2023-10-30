# Signing in

::: warning
Before we start, **please do not** use mtcute to abuse Telegram services
or harm other users by any means (including spamming, scraping,
scamming, etc.)

Bots are meant to help people, not hurt them, so
**please** make sure you don't :)
:::


## API Keys

Before you can use this library (or any other MTProto library, for that matter),
you need to obtain API ID and API Hash from Telegram:

1. Go to [https://my.telegram.org/apps](https://my.telegram.org/apps)
   and log in with your Telegram account
2. Fill out the form to create a new application

::: tip
You can leave URL field empty.
App name and short name can (currently) be changed later.

Note that you **will not** be able to create
another application using the same account.
:::

3. Press *Create Application*, and you'll see your `api_id` and `api_hash`.

:::warning
Never give away your API hash. It can not be revoked.
:::

## Signing in

Now that we have got our API keys, we can sign in into our account:

```ts
import { NodeTelegramClient } from '@mtcute/node'

// Replace with your own values
const tg = new NodeTelegramClient({
    apiId: API_ID,
    apiHash: 'API_HASH'
})

tg.run({
    phone: () => tg.input('Phone > '),
    code: () => tg.input('Code > '),
    password: () => tg.input('Password > ')
}, async (self) => {
    console.log(`Logged in as ${self.displayName}`)
})
```

::: tip
`tg.input` is a tiny wrapper over `readline` module in NodeJS,
that will ask you for input in the console.

It's not available in `@mtcute/client`, since it is platform-agnostic
:::

`.run()` is a convenient wrapper method over `.start()` that logs you in using
the given parameters and then calls a given function with the current user, and 
handles all errors with the client's error handler.

When using ESM, you may want to use `.start()` directly:

```ts
const self = await tg.start({ ... })

console.log(`Logged in as ${self.displayName}`)
```

## Signing in as a bot

You can also use mtcute for bots (created via [@BotFather](https://t.me/BotFather)).
You will still need API ID and Hash, though:

```ts{10}
import { NodeTelegramClient } from '@mtcute/node'

// Replace with your own values
const tg = new NodeTelegramClient({
    apiId: API_ID,
    apiHash: 'API_HASH'
})

tg.run({
    botToken: '12345678:0123456789abcdef0123456789abcdef'
}, async (self) => {
    console.log(`Logged in as ${self.displayName}`)
})
```

## Storing your API ID and Hash

In the examples above, we hard-coded the API keys. It works
fine, but it is better to not keep that kind of stuff in the code,
let alone publish them to public repositories.

Instead, it is a good practice to use environment variables
and a `.env` that will contain them.  
You can load it then using [dotenv-cli](https://npmjs.org/package/dotenv-cli):

```bash
# .env
API_ID=123456
API_HASH=0123456789abcdef0123456789abcdef
```

```ts
// your-file.ts
import { NodeTelegramClient } from '@mtcute/node'

const tg = new NodeTelegramClient({
    apiId: process.env.API_ID,
    apiHash: process.env.API_HASH
})
```

```bash
dotenv ts-node your-file.ts
```

## Using a proxy

When using NodeJS, you can also connect to Telegram through proxy.
This is particularly useful in countries like Iran or Russia, where
Telegram might be limited.

To learn how to set up a connection through proxy,
refer to [Transport](../topics/transport.html#http-s-proxy-transport) documentation
