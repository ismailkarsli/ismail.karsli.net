---
title: I sped up my library's type checking by 95% with TypeScript 7.1's content mappers
description: How TypeSQL caches type-level SQL analysis between TypeScript runs, without ever giving a wrong type.
date: 2026-10-23
---

I maintain [TypeSQL](https://typesql.karsli.net), a library that type-checks raw Postgres SQL.
You write a query as a plain string, and TypeScript tells you the row type, the parameter types,
and whether you misspelled a column:

```ts
const q = sql("SELECT id, email FROM users WHERE id = $1", 42);
//    ^? Query<{ id: number; email: string }, [number | null], "SELECT id, ...">

sql("SELECT nmae FROM users");
//  ~~~~~~~~~~~~~~~~~~~~~~~~ column "nmae" does not exist. Perhaps you meant the column "name"?
```

There is no codegen step and no database connection. The trick is that the whole SQL parser is
written in TypeScript's type system. The lexer, the parser, name resolution, nullability rules:
all of it is conditional types and template literal types, running inside the type checker.

That is fun, and it works.

## The problem: the checker forgets

A typical query costs about 9,000 "type instantiations", which is roughly 5 milliseconds of
check time. That sounds like nothing until you have a real app. With 500 queries, a cold
`tsc` run spends about 2.6 seconds just on my types.

TypeScript does remember results, but only within one program. Check the same query text twice
in one run, and the second time is free. Start a new program, and everything is computed again.
That happens on every `tsc` run, and in the editor it happens after every edit: a new snapshot
gets a fresh checker, and the fresh checker knows nothing.

So the same 9,000 instantiations get spent over and over, for queries that did not change.

What I wanted was simple to say: remember the answer somewhere, and reuse it next time. The hard
part was that TypeScript gives a library no way to do that. Types cannot write files, and a
plugin system for the type checker never existed in the native compiler.

## Then TypeScript 7.1 added content mappers

Content mappers are a new TypeScript 7.1 feature, meant for files like `.vue` or `.svelte`.
You tell `tsconfig.json` that a package handles some file extension:

```jsonc
{
  "contentMappers": [{ "package": "@typesql/core", "extensions": [".typesqlcache"] }]
}
```

When TypeScript finds a file with that extension in the project, it starts a small process
from that package and asks it: "here is the content of this file, give me TypeScript for it".
The process answers with code, and the checker treats it like any other source file.

I am not using it the way it was designed for. My file is not a component. It is a cache. It
holds JSON that the mapper turns into type declarations:

```ts
declare module "@typesql/core" {
  interface QueryCache {
    "…": {
      "SELECT id, email FROM users WHERE id = $1": {
        a: { kind: "select"; cols: [ /* … */ ] };   // the analysis, already done
        c: { q: Query<{ id: number; email: string }, [number | null], "…"> };
        // …
      };
    };
  }
}
```

And inside the library, before running the parser, the types look up the query text in that
interface. If an answer is there, they use it. If not, they parse as before.

The second piece is the part I like most. The same mapper process can do work in the
background. While the project is open in the editor, it opens its own TypeScript session
through the new API (`typescript/async`), finds every `sql()` call, computes the results, and
writes them to the cache file. The editor notices the file changed, asks the mapper again, and
from then on those queries are cheap. No CLI, no editor extension, no code in your app.

## Why content mappers, and not something else

Before settling on this, I went through every other way I could think of. Each one failed on at
least one of the things I needed: it has to work in every editor and in `tsc`, it must not add
a step you have to remember, and it must never give a wrong type.

**Make the parser faster.** I tried. It saved less than 1% per query; the only big win left is
not doing the work again.

**A codegen step.** "No codegen" is the point of TypeSQL, and a generated file you forgot to
regenerate silently lies.

**A language service plugin.** TypeScript 7 has no `tsserver` and loads no plugins. They never
ran in `tsc` anyway.

**Just the TypeScript API.** The new `typescript/async` API can compute every result, and my
job uses it. But it runs in its own process and cannot put types into your checker. A script
could write them to a `.ts` file, but then someone has to run it: that is codegen again.

**A VS Code extension.** Only helps VS Code users, and does nothing for `tsc` or CI.

**A Vite, Vitest or bundler plugin.** Only runs while the dev server or tests do; the editor's
checker never sees it.

**Patching the compiler.** Tools like `ttsc` are unofficial, break on upgrades, and do nothing in
the editor.

**TypeScript's own caching.** `incremental` and project references help `tsc`, but not the
editor, and an edited file is still checked from scratch.

Content mappers were the first option that ticked every box. They are an official TypeScript
feature, the same mapper runs in the language server and in `tsc`, and it is the user's
`tsconfig.json` that decides whether it runs at all. The price is that TypeScript asks the user
for permission before running it, which I think is fair.

## Making the lookup cheap

A cache hit has to be much cheaper than the work it replaces, or there is no point. My target
was under 250 instantiations per query, against about 9,000 for the real thing.

The first version cost 790. Most of it was not the lookup itself, but everything around a
`sql()` call: rewriting `:name` parameters, building the row type, building the parameter
tuple. So the cache stores the final results of the call too, not only the analysis.

The freshness check was the next problem. Checking every dependency of every entry on every
lookup added up. The answer was to group entries by the schema snapshot they were computed
against, and to work out once per program which names in that snapshot changed. After that,
a lookup is mostly one indexed access.

Where it ended up: about 230 instantiations per cached query.

## The numbers

From my benchmark, compiled against the built package with `skipLibCheck`, the way an app
compiles it, on a 4-core machine:

| | Instantiations | Check time |
|---|---|---|
| 500 queries, no cache | 4.6M | 2.6 s |
| 500 queries, with the cache | 123K | 0.13 s |
| 50 queries, no cache | 517K | 0.31 s |
| 50 queries, with the cache | 20K | 0.02 s |

That is about 95% less check time, and 97% fewer instantiations. A cache that is completely
stale (generated for a different schema) costs about the same as no cache at all, 1.01×,
which was the other number I cared about.

The background job is incremental too. After an edit it only recomputes the queries the edit
can affect, and a pass over a 550-query project takes well under a second when little changed.

## How I convinced myself it is not wrong

Fast and wrong is easy. I spent most of the testing effort on "same answer":

- I run my entire type test suite (285 tests, over a thousand type assertions) a second time,
  against a cache generated from those same tests. Every assertion still passes, with about
  73% of the work coming from the cache.
- The error snapshots have to be byte-identical with and without a cache.
- A test changes one thing at a time (rename a column, change nullability, add an enum value,
  add a table named like an alias, augment the function catalog) and checks that the affected
  entries are not used and the others still are.
- A language server test starts `tsc --lsp`, checks that hovers come from the cache, waits for
  the background job to write new entries, and checks that the server picks them up.
- And one test compares hover text with and without the cache. That one found a real bug: two
  calls with the same SQL text produced a duplicated entry, and the hover showed
  `Query<…> | Query<…>`. The types were equivalent, but "looks different" is still different.

## The caveats

It is opt-in, and I want to be honest about what opting in means:

- You need TypeScript 7.1, which is still in beta, and content mappers may change before it is
  final.
- `tsc` needs `--runExternalCode`, and the editor needs your permission to run the mapper. It is
  code from a package running in your editor, so that is a fair question to be asked.
- While the job runs, it is a second TypeScript instance holding your project. It closes after
  a few idle minutes.

If you do not opt in, nothing changes. Without the cache, a query costs about 0.2% more than
before, from the one extra check for "is there a cache?".

## What I learned

The idea is boring: remember answers. What made it interesting was the rule that a cached
answer must be indistinguishable from a computed one. That rule shaped every decision: record
more dependencies than needed, compare structures instead of trusting aliases, test the hover
text and not only the types.

And content mappers turned out to be more than a way to support new file formats. They are the
first sanctioned way for a library to run alongside the TypeScript checker, in the editor and
in `tsc`. I suspect I will not be the last library author to use them for something other than
components.

If you want to try it, the setup is three lines of config and an empty file. The details are in
the [type cache guide](https://typesql.karsli.net/guide/caching).
