import { Component, createSignal, createSelector, createEffect, For, Index, createMemo } from "solid-js";
import { loop } from "./loop";

type DataPoint = { value: number };

const initialList = [{ value: 100 }, { value: 50 }, { value: 20 }];

const Chart: Component<{ data: DataPoint[] }> = (props) => {
  const DUR = 4000;
  let prevList: DataPoint[] = [];

  const [data, setData] = createSignal<DataPoint[]>([]);
  const [transitionList, setTransitionList] = createSignal<DataPoint[]>(props.data);

  const isUpdating = () => prevList.some((o, i) => o.value !== data()[i].value);

  createEffect(() => {
    if (isUpdating()) {
      console.log({ prevList, dataProps: props.data });
    }
    prevList = data();
    setData(props.data);
    setTransitionList(props.data);
  });

  createEffect(() => {
    data().forEach((d, idx, arr) => {
      if (prevList.length && prevList[idx] && prevList[idx].value !== arr[idx].value) {
        console.log("loop! is updating!", { prevList, arr });
        loop({
          id: String(idx),
          initial: prevList[idx].value || 0,
          final: arr[idx].value || 0,
          duration: DUR,
          cb: (curr) => setTransitionList((list) => list.map((d, i) => (i === idx ? { value: curr } : d))),
        });
      }
    });

    // console.log(data());
  });

  return (
    <div style={{ border: "1px solid" }}>
      <p>Chart</p>

      <svg width="100%" height="200px" style={{ background: "#eee" }}>
        <For each={transitionList()}>
          {(item, i) => <rect x={`${(i() + 1) * 100}px`} width="20px" height={`${item.value}px`} y="0" fill="#0f9" />}
        </For>
      </svg>

      <pre>{JSON.stringify(data(), null, 2)}</pre>
      <pre>{JSON.stringify(transitionList(), null, 2)}</pre>
    </div>
  );
};

const App: Component = () => {
  const [dataList, setDataList] = createSignal<DataPoint[]>(initialList);

  return (
    <div>
      <h1>Transition Value</h1>
      <div>
        <ul style={{ padding: 0 }}>
          {/* <For each={dataList()}>
            {(item, idx) => (
              <li style={{ border: "1px dashed", "list-style": "none" }}>
                <label>{item.value}</label>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => {
                    setDataList((list) => list.map((d, i) => (i === idx() ? { value: +e.currentTarget.value } : d)));
                  }}
                />
              </li>
            )}
          </For> */}
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
            setDataList((list) => [...list, { value: Math.random() * 100 }]);
            // setDataList((list) => [...list, { value: 0 }]);
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default App;
