export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useTransitionValue = async (config: {
  start: number;
  final: number;
  duration: number;
  cb: (currentValue: number) => void;
}) => {
  const { start, final, duration, cb } = config;

  let curr = start;
  let diff = final - start;
  let itCount = 60 * (duration / 1000);
  const step = diff / itCount;

  // console.time("transitionValue");
  // console.log({ itCount, diff, step });

  let i = 0;
  while (i <= itCount) {
    await wait(duration / itCount);

    i === itCount ? cb(final) : cb(curr);

    curr += step;
    i++;
  }
  // console.timeEnd("transitionValue");
};
