// prettier-ignore
export const indexDayOfWeek = {
  Mon: 0, mon: 0, Monday: 0,    monday: 0,
  Tue: 1, tue: 1, Tuesday: 1,   tuesday: 1,
  Wed: 2, wed: 2, Wednesday: 2, wednesday: 2,
  Thu: 3, thu: 3, Thursday: 3,  thursday: 3,
  Fri: 4, fri: 4, Friday: 4,    friday: 4,
  Sat: 5, sat: 5, Saturday: 5,  saturday: 5,
  Sun: 6, sun: 6, Sunday: 6,    sunday: 6,
}

export const getDate = (date, dayOfWeek) => {
  const [D, M, Y] = date.split('/')
  const DD = parseInt(D) + indexDayOfWeek[dayOfWeek]
  const MM = parseInt(M) - 1 // honestly no idea why but M is weird
  return new Date(Y, MM, DD)
}
