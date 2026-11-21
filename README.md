# Qwik 1.20.4: text `\x3Cscript` in state breaks JSON.parse

A signal holds the literal ten characters `\x3Cscript` (backslash, x, 3, C, s, c, r, i, p, t).
On resume, Qwik 1's browser `unescapeText` regex turns `\\x3Cscript` into `\<script`, an invalid
JSON escape. `JSON.parse` throws `Bad escaped character in JSON` and every event handler on the
page dies. Any user-supplied text (an email subject, a comment) can hold these characters.

## Run the app

    npm install
    npm start

Open the preview and click the button. The click counter never changes once the bug fires; the
console shows the SyntaxError.

## Standalone check

    node repro.mjs

Prints `REPRODUCED: SyntaxError: Bad escaped character in JSON at position 7`.

## Cause

`escapeText` in `dist/core.mjs:7029` is `str.replace(/<(\/?script)/gi, '\\x3C$1')`.
`unescapeText` in `dist/core.mjs:3181` is `str.replace(/\\x3C(\/?script)/gi, '<$1')`.
Neither counts backslashes. A string already holding `\x3Cscript` is written to `qwik/json` state
as `"\\x3Cscript"`. The browser regex matches the second backslash and replaces `\x3Cscript` with
`<script`, leaving `"\<script"`, which is not valid JSON.

## Not affected: Qwik 2

`@qwik.dev/core` 2.0.0-rc.5 writes state as `<script type="qwik/state">`, escapes only `</` as
`<\/` and `<!--` as `\u003C`, and reads it back with plain `JSON.parse`. The string round-trips
unchanged. This repro is about Qwik 1 only.
