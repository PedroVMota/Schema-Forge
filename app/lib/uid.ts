let _counter = 0

export function uid(): string {
  return `${Date.now().toString(36)}-${(++_counter).toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
