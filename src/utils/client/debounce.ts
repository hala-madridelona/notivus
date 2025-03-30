/* eslint-disable */
// @ts-nocheck
const debounceMyFun = (coreFn: any, delay: number) => {
  let currentTimer: number | null = null;
  return (...args) => {
    currentTimer && clearTimeout(currentTimer);
    currentTimer = setTimeout(() => {
      coreFn.apply(null, args);
    }, delay);
  };
};

export { debounceMyFun };
