// Standalone reproduction using the exact regexes from @builder.io/qwik 1.20.4
// dist/core.mjs: escapeText at line 7029, unescapeText at line 3181.
const esc = (s) => s.replace(/<(\/?script)/gi, '\\x3C$1');
const un = (s) => s.replace(/\\x3C(\/?script)/gi, '<$1');

const subject = String.raw`\x3Cscript`;
const json = esc(JSON.stringify({ s: subject }));
console.log('qwik/json state text:', json);
try {
  console.log(JSON.parse(un(json)));
  console.log('no error (unexpected)');
} catch (e) {
  console.error('REPRODUCED:', e.name + ': ' + e.message);
}
