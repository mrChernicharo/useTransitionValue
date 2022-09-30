export const loop = (config: { start: number; final: number; duration: number; cb: (currentValue: number) => void }) => {
  const { start, final, duration, cb } = config;

  const startTime = Date.now();
  const finalTime = startTime + duration - 32;
  let currTime = startTime;

  // console.log({ start, final });

  let curr = start;
  let diff = final - start;
  let itCount = 60 * (duration / 1000);
  const step = diff / itCount;

  const repeat = () => {
    // console.log({
    //   i,
    //   startTime: startTime.toString().slice(-5),
    //   finalTime: finalTime.toString().slice(-5),
    //   currTime: currTime.toString().slice(-5),
    // });
    cb(curr);
    currTime = Date.now();
    curr += step;

    if (currTime < finalTime) {
      requestAnimationFrame(repeat);
    } else {
      cb(final);
    }
  };

  // cb(curr);
  // currTime = Date.now();
  // curr += step;

  requestAnimationFrame(repeat);
};
