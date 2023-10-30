# Introduction

We've already briefly [touched](../intro/updates.html) on what Dispatcher is,
but as a quick reminder: Dispatcher is a class that processes
updates from the client and *dispatches* them to the registered handlers.

It is implemented by `@mtcute/dispatcher` package and is also exported
from `@mtcute/node`.

## Setting up

To use a dispatcher, you need to first create a bound dispatcher
using `Dispatcher.for` method:

```ts
import { NodeTelegramClient, Dispatcher } from '@mtcute/node'

const tg = new NodeTelegramClient({...})
const dp = Dispatcher.for(tg)
```

