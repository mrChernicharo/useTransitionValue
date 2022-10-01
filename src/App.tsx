import { Component, createSignal, createSelector, createEffect, For, Index, createMemo } from "solid-js";
import { DataPoint, initialList } from "./constants";
import { Chart } from "./Chart";

const App: Component = () => {
  const [dataList, setDataList] = createSignal<DataPoint[]>(initialList);

  return (
    <div>
      <h1>Transition Value</h1>
      <div>
        <ul style={{ padding: 0 }}>
          {/* <For> had the <input> lose its focus onChange. <Index> worked better instead */}
          <Index each={dataList()}>
            {(item, idx) => (
              <li style={{ border: "1px dashed", "list-style": "none" }}>
                <label>{item().value}</label>
                <input
                  type="number"
                  value={item().value}
                  onChange={(e) => {
                    setDataList((list) => list.map((d, i) => (i === idx ? { value: +e.currentTarget.value } : d)));
                  }}
                />
              </li>
            )}
          </Index>
        </ul>
      </div>

      <div>
        <Chart data={dataList()} />
      </div>

      <div>
        <button
          onClick={(e) => {
            setDataList((list) => [...list, { value: Math.round(Math.random() * 100) }]);
          }}
        >
          <span>ADD</span>
        </button>
      </div>
    </div>
  );
};

export default App;
