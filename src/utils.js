/**
 * Request animation frame utility.
 * @param {!Function} func Callback.
 * @param {number} timeCallback Time to init callback.
 * @return {Function} SetTimeout.
 */
 export const requestAnimationUtil = (func, timeCallback) => {
  let start = null;

  if (!window.requestAnimationFrame) {
    return window.setTimeout(func, timeCallback);
  }

  /**
  * Callback requestAnimationFrame.
  * @param {number} timestamp
  * @private
  */
  const visibleStep_ = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    if (progress < timeCallback) {
      window.requestAnimationFrame(visibleStep_);
    } else {
      func();
    }
  };

  return window.requestAnimationFrame(visibleStep_);
};

/**
 * Cancels all the request animation frame.
 */
export const cancelAllAnimationFrames = () => {
  let id = window.requestAnimationFrame(() => {});

  while(id--) {
    window.cancelAnimationFrame(id);
  }
}
