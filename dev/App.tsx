import { Component, createSignal } from "solid-js";

const App: Component = () => {
  const [value, setValue] = createSignal(0);

  return (
    <div>
      <h1>Test</h1>

      <input type="number" value={value()} onChange={(e) => setValue(+e.currentTarget.value)} />

      <pre>{value()}</pre>
    </div>
  );
};

export default App;
