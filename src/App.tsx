import { Component, createSignal, createSelector, createEffect, For } from "solid-js";
import { loop } from "./loop";
import { useTransitionValue } from "./useTransitionValue";

const DUR = 1000;
const initialList = [{ value: 10 }, { value: 20 }];

const App: Component = () => {
  let prevList: { value: number }[] = [];
  const [dataList, setDataList] = createSignal<{ value: number }[]>(initialList);
  const [transitionList, setTransitionList] = createSignal<{ value: number }[]>(initialList);

  return (
    <div>
      <h1>Transition Value</h1>
      <div>
        <ul style={{ padding: 0 }}>
          <For each={dataList()}>
            {(item, idx) => (
              <li style={{ border: "1px solid", "list-style": "none" }}>
                <p>{item.value}</p>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => {
                    if (e) {
                      prevList = dataList();

                      setDataList((list) => {
                        const copy = [...list];
                        copy.splice(idx(), 1, { value: +e.currentTarget.value });
                        return copy;
                      });

                      // useTransitionValue({
                      //   start: prevList[idx()].value || 0,
                      //   final: dataList()[idx()].value,
                      //   duration: DUR,
                      //   cb: (curr) => {
                      //     setTransitionList((list) => {
                      //       const copy = [...list];
                      //       copy.splice(idx(), 1, { value: curr });
                      //       return copy;
                      //     });
                      //   },
                      // });

                      loop({
                        start: prevList[idx()].value || 0,
                        final: dataList()[idx()].value,
                        duration: DUR,
                        cb: (curr) => {
                          setTransitionList((list) => {
                            const copy = [...list];
                            copy.splice(idx(), 1, { value: curr });
                            return copy;
                          });
                        },
                      });
                    }
                  }}
                />
              </li>
            )}
          </For>
        </ul>
      </div>
      <pre>{JSON.stringify(transitionList(), null, 2)}</pre>
      {/* <div>
				transitionValue:
				{Math.abs(transitionVal()) > 1
					? transitionVal().toFixed()
					: transitionVal().toPrecision(2)}
			</div> */}
    </div>
  );
};

export default App;
