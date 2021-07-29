// prettier-ignore
export const indexDayOfWeek = {
  Mon: 0, mon: 0, Monday: 0,    monday: 0,
  Tue: 1, tue: 1, Tuesday: 1,   tuesday: 1,   Tues: 1,
  Wed: 2, wed: 2, Wednesday: 2, wednesday: 2,
  Thu: 3, thu: 3, Thursday: 3,  thursday: 3,
  Fri: 4, fri: 4, Friday: 4,    friday: 4,
  Sat: 5, sat: 5, Saturday: 5,  saturday: 5,
  Sun: 6, sun: 6, Sunday: 6,    sunday: 6,
}

export const getDate = (date, dayOfWeek) => {
  const [D, M, Y] = date.split('/')
  var proc = new Date(Y, parseInt(M), parseInt(D))

  /*
   * some dank correction,
   * honestly baffled as to why I have to do this
   */
  proc.setMonth(proc.getMonth() - 1)
  proc.setDate(proc.getDate() + 1)

  /*
   * implement the shift based on day of week
   */
  const shift = indexDayOfWeek[dayOfWeek]
  proc.setDate(proc.getDate() + shift)

  /*
   * fix the date before reading it into a string
   */
  const DD = proc.getDate() - 1
  const MM = proc.getMonth() + 1
  const YY = proc.getFullYear()
  return [DD, MM, YY].join('/')
}
