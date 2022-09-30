import { Component, createSignal, createSelector, createEffect } from "solid-js";
import { useTransitionValue } from "./useTransitionValue";

// import logo from './logo.svg';
// import styles from './App.module.css';
const DUR = 1000;
const App: Component = () => {
	let prevVal: number | undefined;
	const [val, setVal] = createSignal(10);
	const [transitionVal, setTransitionVal] = createSignal(10);

	return (
		<div>
			<h1>Transition Value</h1>
			<div>
				<input
					type="number"
					value={val()}
					onChange={e => {
						if (e) {
							prevVal = val();

							setVal(+e.currentTarget.value);

							console.log({ prevVal, val: val() });

							useTransitionValue({
								start: prevVal || 0,
								final: +e.currentTarget.value,
								duration: DUR,
								cb: curr => {
									setTransitionVal(curr);
								},
							});
						}
					}}
				/>
			</div>
			<div>value: {val()}</div>
			<div>
				transitionValue:{" "}
				{Math.abs(transitionVal()) > 1
					? transitionVal().toFixed()
					: transitionVal().toPrecision(2)}
			</div>
		</div>
	);
};

export default App;
