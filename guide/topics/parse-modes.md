# Parse modes

::: warning
This concept is subject to change in the following updates.

It will likely be changed entirely and mostly removed from the API

The following usage will definitely not change and can be relied upon:

```ts
const greeting = html`Hi, <i>${user.displayName}</i>!`

await tg.sendText(user, html`<b>${greeting}</b> How are you?`)
// (and the same for Markdown)
```

The rest of the page describes pre-alpha API that is likely to change very soon
:::

You may be familiar with parse modes from the Bot API. Indeed,
the idea is pretty much the same - parse mode defines the syntax to use
for formatting entities in messages.

Parse modes are used virtually everywhere where a message is being sent:

```ts
await tg.sendText('Hi, <b>User</b>!', { parseMode: 'html' })
```

## Message entities

Instead of using parse mode, you can directly provide list of message
entities to the function:

```ts
await tg.sendText(
    'Hi, User!',
    {
        entities: [
            {
                _: 'messageEntityBold',
                offset: 4,
                length: 4
            }
        ]
    })
```

`entities` uses [MessageEntity](https://core.telegram.org/type/MessageEntity) types
from the TL schema, and automatically replaces `messageEntityMentionName`
with `inputMessageEntityMentionName`, so you don't have to think
about manually fetching the peers.

## Registering parse modes

Before you can use a parse mode, you need to register it
using `registerParseMode`:

```ts
tg.registerParseMode(new AwesomeParseMode())
```

This will register the given parse mode under
the name is determined by the parser (`.name` field),
which can later be used in `parseMode` parameter.

The first mode registered for the client becomes the default
parse mode, which is used when `parseMode` parameter is omitted.
You can still change it manually, though:

```ts
tg.setDefaultParseMode('html')
```

::: tip
When using `@mtcute/node`, HTML and Markdown parsers
are registered automatically, and HTML is used by default.
:::

## Escaping

Often, parse modes have some limitations on what characters are allowed
inside entities without breaking the syntax.

That is why parse modes also provide a static `escape()` method
that should always be used when putting unknown data inside an entity:

```ts
msg.answerText(
    'Hello, **' +
        MarkdownMessageEntityParser.escape(username) +
        '**'
)
```

The above is pretty verbose though. Parse modes also
export a tagged template helper function that you can use instead:

```ts
msg.answerText(md`Hello, **${username}**`)
```

### Avoiding escaping

Sometimes with tagged literals you may want to pass the string as-is,
without escaping it (e.g. this is an already formatted string from the outside).

For that, you can use `FormattedString` class:

```ts
function buildUserWelcome(user: User): FormattedString {
    return new FormattedString(`Welcome, <b>${user.displayName}</b>!`, 'html')
    // or, even better
    return html`Welcome, <b>${user.displayName}</b>!`
}

// later
msg.answerText(html`${buildUserWelcome(msg.sender)} Enjoy your stay.`)
```

FormattedString also implements `toString`, so you can use it in normal
template strings as well:

```ts
msg.answerText(
    `${buildUserWelcome(msg.sender)} Enjoy your stay.`, { parseMode: 'html' }
)
```

::: tip
`md` and `html` both return FormattedString with the respective parse mode set.

FormattedString also overrides parse mode when passed to methods
like `sendText`:

```ts
tg.setDefaultParseMode('html')

await tg.sendText(md`Hello, **${username}**`)
// Message is sent with Markdown parse mode,
// despite HTML being the default one
```
:::

## Markdown

Markdown parser is implemented in `@mtcute/markdown-parser` package:

```ts
import { MarkdownMessageEntityParser, md } from '@mtcute/markdown-parser'

tg.registerParseMode(new MarkdownMessageEntityParser())

dp.onNewMessage(async (msg) => {
    await msg.answerText(md`Hello, **${msg.sender.username}**`)
})
```

It registers under the name `markdown`.

**Note**: the syntax used by this parser is **not** compatible
with Bot API's Markdown or MarkdownV2 syntax.
See [documentation](https://ref.mtcute.dev/modules/_mtcute_markdown_parser.html)
to learn about the syntax.

## HTML

HTML parser is implemented in `@mtcute/html-parser` package:

```ts
import { HtmlMessageEntityParser, html } from '@mtcute/html-parser'

tg.registerParseMode(new HtmlMessageEntityParser())

dp.onNewMessage(async (msg) => {
    await msg.answerText(html`Hello, <b>${msg.sender.username}</b>`)
})
```

It registers under the name `html`.

**Note**: the syntax used by this parser is **not entirely**
compatible with Bot API's HTML syntax.
See [documentation](https://ref.mtcute.dev/modules/_mtcute_html_parser.html)
to learn about the syntax.

::: warning
If you are using **Prettier** to format your code, be aware that Prettier
formats tagged template literals with `html` as normal HTML and may add
unwanted line breaks.

Use `htm` instead (which is just an alias):
```ts
import { htm } from '@mtcute/html-parser'

await msg.answerText(htm`Hello, <b>${msg.sender.username}</b>`)
```
:::

## Un-parsing

A powerful feature of the parse modes in mtcute is the ability
to un-parse a text message given its entities.

For example, this might be useful to display the HTML of the
message in UI:

```ts
const msg = await tg.sendText('Hi, <b>User</b>!', { parseMode: 'html' })

console.log(msg.text)
// Hi, User!
console.log(msg.unparse('html'))
// Hi, <b>User</b>!
```

## Implementing custom parse mode

Tired of these old-school things and want to try out
something cool and new? You are welcome to implement
custom parse mode!

Simply write a class that implements `IMessageEntityParser`
and register it as usual:

```ts
import { IMessageEntityParser } from '@mtcute/client'

class IncredibleEntityParser implements IMessageEntityParser {
    // ... implementation ...
}

tg.registerParseMode(new IncredibleEntityParser())
```

::: tip
You can skip implementing `unparse` if you are not going to use it,
and just return the original text (however don't do this if you plan
on sharing this parser :P).
:::
