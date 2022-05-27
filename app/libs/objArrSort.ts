export function objArrSort<T = unknown>(
  arr: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
) {
  if (order === "asc")
    return arr.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
  else
    return arr.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
}
