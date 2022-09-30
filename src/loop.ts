import { createSignal } from "solid-js";

const [isLooping, setIsLooping] = createSignal(false);

let frameID: number;
let lastCurr!: number;

export const loop = (config: {
  id: string;
  initial: number;
  final: number;
  duration: number;
  cb: (currentValue: number) => void;
}) => {
  const { id, initial, final, duration, cb } = config;

  const startTime = Date.now();
  const finalTime = startTime + duration;
  let currTime = startTime;

  let start = isLooping() ? lastCurr : initial;
  let curr = start;
  let diff = final - start;
  let itCount = 60 * (duration / 1000);
  let step = diff / itCount;

  if (!isLooping()) {
    console.log("no loop", frameID);
    frameID = requestAnimationFrame(repeat);
  }

  if (isLooping()) {
    console.log("isLooping", frameID);
    cancelAnimationFrame(frameID);
    curr = lastCurr;
    frameID = requestAnimationFrame(repeat);
  }

  function repeat(timestamp: number) {
    setIsLooping(true);

    cb(curr);
    lastCurr = curr;
    currTime = Date.now();
    curr += step;

    if (currTime < finalTime) {
      frameID = requestAnimationFrame(repeat);
    } else {
      curr = final;
      cb(curr);
      setIsLooping(false);
    }

    console.log({ curr, final });
  }
};
