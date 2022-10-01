import { createSignal } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

// const [isLooping, setIsLooping] = createSignal(false);

let frameID: number;
let lastCurr!: number;

const [instances, setInstances] = createStore<{ [id: string]: { isLooping: boolean; frameId: number; lastCurr: number } }>({});

export const loop = (config: {
  id: string;
  initial: number;
  final: number;
  duration: number;
  cb: (currentValue: number) => void;
}) => {
  const { id, initial, final, duration, cb } = config;

  if (!(id in instances)) {
    setInstances(id, { isLooping: false, frameId: 0, lastCurr: 0 });
  }

  const startTime = Date.now();
  const finalTime = startTime + duration;
  let currTime = startTime;

  let start = instances[id].isLooping ? instances[id].lastCurr : initial;
  let curr = start;
  let diff = final - start;
  let itCount = 60 * (duration / 1000);
  let step = diff / itCount;

  if (!instances[id].isLooping) {
    setInstances(id, "frameId", requestAnimationFrame(repeat));
  }

  if (instances[id].isLooping) {
    cancelAnimationFrame(instances[id].frameId);
    curr = instances[id].lastCurr;
    setInstances(id, "frameId", requestAnimationFrame(repeat));
  }

  function repeat(timestamp: number) {
    currTime = Date.now();

    setInstances(id, "isLooping", true);
    setInstances(id, "lastCurr", curr);

    cb(curr);
    curr += step;

    if (currTime < finalTime) {
      setInstances(id, "frameId", requestAnimationFrame(repeat));
    } else {
      curr = final;
      cb(curr);
      setInstances(id, "isLooping", false);
    }
    // console.log(unwrap(instances[id]));
    // console.log({ curr, final });
  }
};
