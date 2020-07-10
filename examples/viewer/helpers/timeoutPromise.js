
export function timeoutPromise (ms = 1000) {
  return new Promise((resolve, reject) => {
    // wait for 50 ms.
    setTimeout(function () { resolve() }, ms)
  })
}
