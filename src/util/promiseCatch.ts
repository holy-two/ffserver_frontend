type TR<R> = [result: R, error: null]
type TE<E> = [result: null, error: E]

export default async function promiseCatch<T, E = string>(p: Promise<T>): Promise<TR<T> | TE<E>> {
  try {
    const result = await p;
    return [result, null]
  } catch (error) {
    return [null, error]
  }
}