import { Component, createSignal, createSelector, createEffect, For, Index } from "solid-js";
import { loop } from "./loop";

const initialList = [{ value: 100 }, { value: 50 }, { value: 20 }];

const Chart: Component<{ data: { value: number }[] }> = (props) => {
  const DUR = 4000;
  let prevList: { value: number }[] = [];

  const [data, setData] = createSignal<{ value: number }[]>([]);
  const [transitionList, setTransitionList] = createSignal<{ value: number }[]>(props.data);

  createEffect(() => {
    prevList = data();
    setData(props.data);
  });

  createEffect(() => {
    console.log({ prevList, data: data() });
    data().forEach((d, idx, arr) => {
      if (prevList.length && prevList[idx] && prevList[idx].value !== arr[idx].value) {
        loop({
          id: String(idx),
          initial: prevList[idx].value || 0,
          final: arr[idx].value || 0,
          duration: DUR,
          cb: (curr) => setTransitionList((list) => list.map((d, i) => (i === idx ? { value: curr } : d))),
        });
      }
    });
  });

  return (
    <div style={{ border: "1px solid" }}>
      <p>Chart</p>

      <svg width="100%" height="200px" style={{ background: "#eee" }}>
        <For each={transitionList()}>
          {(item, i) => <rect x={`${(i() + 1) * 100}px`} width="20px" height={`${item.value}px`} y="0" fill="#0f9" />}
        </For>
      </svg>

      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
      <pre>{JSON.stringify(transitionList(), null, 2)}</pre>
    </div>
  );
};

const App: Component = () => {
  const [dataList, setDataList] = createSignal<{ value: number }[]>(initialList);

  return (
    <div>
      <h1>Transition Value</h1>
      <div>
        <ul style={{ padding: 0 }}>
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

      <div>{/* <button onClick={(e) => setDataList((list) => [...list, { value: Math.random() * 100 }])}>ADD</button> */}</div>
    </div>
  );
};

export default App;
