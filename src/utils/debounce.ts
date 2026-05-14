/**
 * Runs `fn` only after `delayMs` have passed without another call.
 * Use `.cancel()` to clear a pending run (for example on unmount).
 */
export function debounce<Args extends readonly unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): ((...args: Args) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Args) => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      fn(...args)
    }, delayMs)
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
  }

  return debounced
}
