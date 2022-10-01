import { Component, createSignal, createEffect, For } from "solid-js";
import { DataPoint } from "./constants";
import { useTransitionValue } from "./useTransitionValue";

const Chart: Component<{ data: DataPoint[] }> = (props) => {
  const DUR = 4000;
  let prevList: DataPoint[] = [];

  const [data, setData] = createSignal<DataPoint[]>([]);
  const [transitionList, setTransitionList] = createSignal<DataPoint[]>(props.data);

  const updateTransitionList = (curr: number, idx: number) =>
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
          cb: (val) => updateTransitionList(val, idx),
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
        cb: (val) => updateTransitionList(val, idx),
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
          cb: (val) => updateTransitionList(val, idx),
        });
      }
    });
  });

  return (
    <div style={{ border: "1px solid" }}>
      <p>Chart</p>

      <svg width="100%" height="200px" style={{ background: "#eee" }}>
        {/* Bar Chart Tosco */}
        <For each={transitionList()}>
          {(item, i) => <rect x={`${(i() + 1) * 100}px`} width="20px" height={`${item.value}px`} y="0" fill="#0f9" />}
        </For>
      </svg>

      {/* <pre>{JSON.stringify(data(), null, 2)}</pre>
      <pre>{JSON.stringify(transitionList(), null, 2)}</pre> */}
    </div>
  );
};

export { Chart };
