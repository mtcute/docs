# Storage

Storage is a very important aspect of the library,
which should not be overlooked. It is primarily used to
handle caching and authorization (you wouldn't want to
log in every time, right?).

## In-memory storage

The simplest way to store data is to store it in-memory
and never persist it anywhere, and this is exactly
what `MemoryStorage` does.

```ts{4}
import { MemoryStorage } from '@mcute/core'

const tg = new TelegramClient({
    storage: new MemoryStorage()
})
```

::: warning
It is highly advised that you use some kind of persisted storage!

With in-memory storage, you will need to re-authorize every time
(assuming you don't use [session strings](#session-strings)),
and also caching won't work past a single run.
:::

## JSON-based storage

`MemoryStorage` internally uses a simple JavaScript object
containing all the data that should be persisted.
`JsonMemoryStorage` is a subclass that implements methods
to import and export the current storage to/from JSON string.

### `localStorage` storage

On top of `JsonMemoryStorage`, mtcute implements `LocalstorageStorage`
that persists that JSON string in browser's `localStorage`:

```ts{4}
import { LocalstorageStorage } from '@mcute/core'

const tg = new TelegramClient({
    storage: new LocalstorageStorage('mtcute:my-account')
})
```

### JSON file storage

For Node JS, there is an option to use JSON file based storage.
mtcute implements that in `JsonFileStorage` class:

```ts{4}
import { JsonFileStorage } from '@mcute/core'

const tg = new TelegramClient({
    storage: new JsonFileStorage('my-account.json')
})
```

::: warning
JSON file based storage is **not recommended** because of numerous issues
that are out of library's control. The idea itself is broken, not the
implementation.

Instead, prefer [SQLite](#sqlite-storage) storage.
:::


## SQLite storage

The preferred storage for a NodeJS application is the one using SQLite,
because it does not require loading the entire thing into memory, and
is also faster than simply reading/writing a file.

mtcute implements it in a separate package, `@mtcute/sqlite`, and internally
uses [better-sqlite3](https://www.npmjs.com/package/better-sqlite3)

```ts{4}
import { SqliteStorage } from '@mcute/sqlite'

const tg = new TelegramClient({
    storage: new SqliteStorage('my-account.session')
})
```

::: tip
If you are using `@mtcute/node`, SQLite storage is the default,
and you can simply pass a string with file name instead
of instantiating `SqliteStorage` manually:

```ts
const tg = new NodeTelegramClient({
    storage: 'my-account.session'
})
```
:::

To improve performance, `@mtcute/sqlite` by default uses
WAL mode ([Learn more](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md)).

When using WAL, along with your SQLite file there will also
be `-shm` and `-wal` files. If you don't like seeing those files,
instead of disabling WAL altogether, consider putting your storage in a folder
(i.e. `new SqliteStorage('storage/mtcute.db')`).

If you are in fact having problems with WAL mode, you can disable it
with `disableWal` parameter.

## Session strings

Sometimes it might be useful to export storage data to a string, and
import it later to another storage. For example, when deploying userbot
applications to a server, where you'll be using another storage.

To generate a session string, simply call `exportSession`:

```ts
tg.run({}, async () => {
    console.log(await tg.exportSession())
})
```

This will output a fairly long string (about 400 chars) to your console,
which can then be imported:

```ts
const tg = new TelegramClient({...})

tg.importSession(SESSION_STRING)
// or
tg.run({ session: SESSION_STRING })
```

You can import session into any storage, including in-memory storage.
This may be useful when deploying to services like [Heroku](https://www.heroku.com),
where their ephemeral file system makes it impossible to use file-based storage.

::: warning
Anyone with this string will be able to authorize as you and do anything.
Treat this as your password, and **never give it away**!

In case you have accidentally leaked this string, make sure to revoke
this session in account settings: "Privacy & Security" > "Active sessions" >
find the one containing "mtcute" > Revoke, or, in case this is a bot,
revoke bot token with [@BotFather](https://t.me/botfather)

Also note that you can't log in with the same session
string from multiple IPs at once, and that would immediately
revoke that session.
:::

::: tip
Calling `importSession` does not immediately import the session.
Instead, it will be imported once the storage is ready.
:::

::: details What is included?
You might be curious about the information that the session
string includes, and why is it so long.

Most of the string is occupied by 256 bytes long
MTProto authorization key, which, when Base64 encoded,
results in **344** characters. Additionally, information
about user (their ID and whether the user is a bot) and their DC
is included, which results in an average of **407** characters
:::

## Implementing custom storage

The easiest way to implement a custom storage would be to
make a subclass of `MemoryStorage` or `JsonMemoryStorage`,
or check the [source code of SqliteStorage](https://github.com/mtcute/mtcute/blob/master/packages/sqlite/index.ts)
and implement something similar with your DB of choice.

## Storage for Dispatcher

We are getting a bit ahead of ourselves, but it is still important
to mention.

All of the storages provided by `@mtcute/*` packages are also compatible with
Dispatcher's FSM and Scenes storage interface, and can be re-used there.
