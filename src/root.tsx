import { component$, useSignal, render } from '@builder.io/qwik';

const App = component$(() => {
  // The literal ten characters \x3Cscript (backslash x 3 C s c r i p t).
  // String.raw keeps the backslash literal. Qwik 1 stores this in qwik/json
  // state as "\\x3Cscript"; the browser's unescapeText regex eats one
  // backslash, leaving an invalid JSON escape, so JSON.parse throws and no
  // handler on the page works.
  const subject = useSignal(String.raw`\x3Cscript`);
  const clicks = useSignal(0);
  return (
    <div>
      <h1>Qwik 1.20.4 \x3Cscript repro</h1>
      <p>Subject: {subject.value}</p>
      <p>Clicks: {clicks.value}</p>
      <button onClick$={() => clicks.value++}>Click me</button>
    </div>
  );
});

render(document.getElementById('app')!, <App />);
