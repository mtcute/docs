# FAQ

Miscellaneous questions about the library and Telegram API as a whole
that don't really belong to any other topic.

If you are new to the library or Telegram API, you can skip this page
for now and return later.

## What is mtcute?

mtcute is a TypeScript library and framework for MTProto clients and bots.

It was written from scratch, however some logic was borrowed from TDLib and
similar projects like [Pyrogram](https://github.com/pyrogram/pyrogram) and
[Telethon](https://github.com/LonamiWebs/Telethon)

## Can I use it with JavaScript?

While you surely can, this is **not recommended**, since you would lose
any benefits TypeScript gives, including type checking and smart suggestions.

## How old is mtcute?

mtcute is pretty late to the party. Work on the library started
in early 2021, was first published on GitHub in spring, and the first
alpha release was published in the end of October 2023.

## Why mtcute?

First of all, apart from mtcute, there aren't many libraries for
MTProto in TypeScript (and even JS, for that matter).

There's [@mtproto/core](https://github.com/alik0211/mtproto-core), which is extremely
low-level and not TS-friendly; there's [GramJS](https://github.com/gram-js/gramjs),
which is a port of Telethon, and pretty much nothing else (at the moment of writing).

mtcute tries to provide a simple, elegant and type-safe API even for advanced
use cases, while also achieving good performance, staying up-to-date
with the current schema and providing near-complete documentation.

## Why are API keys needed for bots?

Because Telegram requires you to. Bot API internally is just a
TDLib instance running with its own API ID and hash for the connection.

## Webhooks?

Webhooks are only used by Bot API because there's no persistent connection
to the client to send updates.

mtcute, on the other hand, has a persistent server connection, and receives
updates from Telegram. This is **not** polling, because the updates are
sent by Telegram, and not requested by the library.

## What are the IPs of the DCs?

The primary DC (and primary Test DC) is always available at
[my.telegram.org](https://my.telegram.org).

List of other DCs is fetched by the client on demand. You can use
this code (it doesn't even require authorization):

<!-- TODO link to repl -->

```ts
tg.call({ _: 'help.getConfig' })
    .then((res) => console.log(res.dcOptions))
```

## How to migrate an account?

You can't.

Even though Telegram docs state that the server might decide to do that,
this feature was confirmed to be unimplemented yet by Levin (source unavailable).

## Why does it work slower sometimes?

Because of Telegram's infrastructure.

Firstly, supergroups reside in the same DC as
the (original) creator, and if it is not the same as yours, it must first be
passed through that DC, which incurs some delay.

In the worst case, you, creator and other user are all in different DCs,
and it takes some time before the client receives an update about that.

The same goes for text-mentioning a user from another DC. It takes time for
the server to check access hash for that user since it is
stored in another DC, and thus sending a message takes more time.

> By the way, it seems that all bots reside in DC 2, so users from CIS
> might have better time using the bots 😛

Another reason is that updates in supergroups are sent in order of priority
([source](https://docs.pyrogram.org/faq#why-is-my-client-reacting-slowly-in-supergroups), unverified):

1. Creator
2. Administrators
3. Bots
4. Mentioned users
5. Recently online users
6. Everyone else

This is **not** affected by the library, and we can't do anything about it.
This can also be reproduced in TDLib and Bot API.

## Why do I get PEER_ID_INVALID?

First, make sure that the ID you pass is actually correct.

If it is, then probably the problem is that you haven't met this
peer in the current session. As described in [Peers section](../topics/peers.html),
you need access hash to interact with the user, which is only sent by the server.

Think of how you find peers in normal clients - you search for usernames,
open them from dialogs, messages, members lists, etc. The same goes for
mtcute - you need to encounter the user before you can interact with them.

## Why is my verification code expired?

That's probably because you have sent it to someone.

To protect users from potential scammers, Telegram checks if the
outgoing message contains the verification code, and if it does,
immediately revokes it.

If you actually want to share it, consider somehow scrambling it,
for example: `12345` → `1 2 3 4 5`

## How to avoid flood errors?

Write code with care, make less requests and do not abuse Telegram.

Nobody knows the exact reason why flood waits occur, and that is intentional.
Publicly available information often contradicts with other,
so there is no definitive answer.

You might find helpful information in
[this article](https://telegra.ph/So-your-bot-is-rate-limited-01-26).

This might also be an issue with the library. Currently mtcute doesn't do a lot of caching, 
though it is on the roadmap. Particularly, issues may arise if your bot is high-load. 

If you receive transport error -429, however, 
please [let us know](https://t.me/mt_cute), so we can investigate further.

## How to not get banned?

Do not abuse Telegram. If you use the API for spamming, flooding,
faking counters or similar, you *will* be banned.

Accounts created using unofficial API clients are automatically
put under observation to prevent violation of the ToS
([source](https://core.telegram.org/api/obtaining_api_id#using-the-api-id)).

In some cases, even logging in with an unofficial client to an
account created using an official one may trigger the system
(I've had that issue multiple times with US VOIP phone numbers)

If you are planning to implement an active userbot, be extra careful,
avoid using VOIP numbers and try to minimize server load generated
(for example, implement local caching and rate limiting).

Anya from [@theyforcedme](https://t.me/theyforcedme) has shared her thoughts on this
in Pyrogram chat:

<iframe src="https://t.me/PyrogramChat/69424?embed=1" height="331px" />

## I was banned, help!

The library only does the things you told it to do. If you abuse Telegram,
then the ban is justified.

If you still have access to the phone number used when registering
the account, you can try contacting the Telegram support and ask them
to recover your account:
[recover@telegram.org](mailto:recover@telegram.org).

If you don't, then welp. Create a new account and be *even more* careful.
