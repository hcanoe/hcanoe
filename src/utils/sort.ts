const recentFirst = (a: any, b: any) => {
  if (a.SortDate > b.SortDate) {
    return -1
  }
  if (a.SortDate < b.SortDate) {
    return 1
  }
  return 0
}

export const by_date = (a: any, b: any) => {
  if (a.SortDate > b.SortDate) {
    return -1
  }
  if (a.SortDate < b.SortDate) {
    return 1
  }
  return 0
}

export const by_pace = (a: any, b: any) => {
  if (a.si_pace > b.si_pace) {
    return 1
  }
  if (a.si_pace < b.si_pace) {
    return -1
  }
  return 0
}

export { recentFirst }
