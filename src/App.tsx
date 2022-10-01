import { Component, createSignal, createSelector, createEffect, For, Index, createMemo } from "solid-js";
import { useTransitionValue } from "./useTransitionValue";

type DataPoint = { value: number };

const initialList = [{ value: 100 }, { value: 50 }, { value: 20 }];
// const initialList = [{ value: 100 }, { value: 50 }, { value: 20 }];

const Chart: Component<{ data: DataPoint[] }> = (props) => {
  const DUR = 600;
  let prevList: DataPoint[] = [];

  const [data, setData] = createSignal<DataPoint[]>([]);
  const [transitionList, setTransitionList] = createSignal<DataPoint[]>(props.data);

  const update = (curr: number, idx: number) =>
    setTransitionList((list) => list.map((d, i) => (i === idx ? { value: curr } : d)));

  // data setup: receiving bulk data via props
  createEffect(() => {
    prevList = data();
    setData(props.data);
    setTransitionList(props.data);
  });

  // transitions setup: tell what values should update when
  createEffect(() => {
    // Initial Transition
    if (prevList.length === 0) {
      data().forEach((d, idx, arr) => {
        useTransitionValue({
          id: String(idx),
          initial: 0,
          final: arr[idx].value,
          duration: DUR,
          cb: (val) => update(val, idx),
        });
      });
    }

    // new element added
    if (prevList.length !== 0 && prevList.length < props.data.length) {
      let idx = props.data.length - 1;
      // console.log("added new element!", { data: data(), item: data()[idx], idx });

      useTransitionValue({
        id: String(idx),
        initial: 0,
        final: data()[idx].value || 0,
        duration: DUR,
        cb: (val) => update(val, idx),
      });
    }

    // standalone value updated
    data().forEach((d, idx, arr) => {
      if (prevList[idx] && prevList[idx].value !== arr[idx].value) {
        // console.log("useTransitionValue! value updating!", { prevList, arr, value: arr[idx].value });
        useTransitionValue({
          id: String(idx),
          initial: prevList[idx].value,
          final: arr[idx].value,
          duration: DUR,
          cb: (val) => update(val, idx),
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
          ADD
        </button>
      </div>
    </div>
  );
};

export default App;
