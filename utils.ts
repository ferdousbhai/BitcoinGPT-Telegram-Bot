// deno-lint-ignore no-explicit-any
export function random(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
  }