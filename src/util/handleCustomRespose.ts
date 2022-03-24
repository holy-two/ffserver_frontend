export default function handleCustomRespose<T, E>(res: T, err: E, callback: Function) {
  if (!err && res) {
    callback();
  } else if (!res) {
    return;
  } else {
    alert(err);
  }
} 