# MTProto vs. Bot API

Unlike many existing libraries and frameworks for Telegram in
TypeScript/JavaScript, mtcute uses MTProto, and not Bot API.

This allows mtcute to be much more flexible and support
many features that Bot API does not.

## What is Bot API?

[**Telegram Bot API**](https://core.telegram.org/bots/api), or simply
**Bot API**, is an HTTP(s) interface provided and hosted by Telegram
that allows developers to build bots.

Under the hood, Bot API uses TDLib (which in turn uses MTProto API),
and simply provides HTTP methods that closely correlate with TDLib methods.

## What is MTProto API?

[MTProto](https://core.telegram.org/mtproto) is the custom protocol
invented by Nikolai Durov and his team, consisting of six ACM champions,
half of them Ph.Ds in math. It took them about two years
to roll out the current version of MTProto
([source](https://news.ycombinator.com/item?id=6916860)).
It is used to communicate between clients and Telegram servers.

MTProto API by itself is a rather common these days RPC-like API,
where MTProto and TL are used to serialize, encrypt and process the requests.
~~*Sounds like VK API with extra steps, right?*~~

## Why MTProto?

MTProto clients (like mtcute) connect directly to Telegram, removing
the need to use additional transport layers like HTTP, polling or webhooks.
This means **less overhead**, since the data is sent directly to you,
and not passed through the Bot API server and then sent to you via HTTP:

<v-img
    src="/guide/assets/mtproto_vs_botapi.svg"
    adaptive="true"
/>

Apart from smaller overhead, using MTProto has many other advantages, including:

|  | Bot API | MTProto |
|---|---|---|
| Userbots | Bot API only allows logging in as a bot. | Both bots and users.
| Files | 20 MB download, 50 MB upload.<br/>(on public instance) | No limits (except global limit of 2000 MB)
| Objects | Often brief and miss important information. | Contain *a lot* of information
| Methods | Lots of methods for the same thing (`send_*`), missing more important methods (like `getMessages`). | Powerful and concise methods
| Updates | Only a limited subset. | Updates about virtually anything that had happened.
| Errors | Often non-informative (e.g. slow mode is the same as flood wait) and not machine-readable. | Informative and simple to use.
| Version | Updates rarely, gets new features slowly | Updates with the TL layer
| Compatibility | Updates randomly, you have to prepare for the upcoming breaking changes. | You can stay on older version for as long as you need.

## Drawbacks

Everything has its drawbacks though.

Using mtcute instead of Bot API (or TDLib) for high-load bots might currently
not be the best idea, since TDLib caches basically everything, while mtcute doesn't.
This is our primary focus for the next releases, though.

If your bot is high-load, and you receive errors like 500 and 429, this
definitely means a problem on mtcute side. Please
[let us know](https://t.me/mt_cute), so we can
investigate further.

