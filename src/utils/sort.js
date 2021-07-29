const recentFirst = (a, b, par) => {
  if (a.SortDate > b.SortDate) {
    return -1
  }
  if (a.SortDate < b.SortDate) {
    return 1
  }
  return 0
}

export { recentFirst }
