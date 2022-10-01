import { createStore } from "solid-js/store";

const [instances, setInstances] = createStore<{
  [id: string]: { isLooping: boolean; frameId: number; lastCurr: number };
}>({});

/**
 * @function useTransitionValue
 *
 * @param {object} config
 *
 * @description transition between two values over time. and act upon every micro update passing in a callback function, where you'll have access to the current transitioning value.
 */
export const useTransitionValue = (config: {
  id: string;
  initial: number;
  final: number;
  duration: number;
  cb: (value: number) => void;
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

  function repeat() {
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
  }
};
