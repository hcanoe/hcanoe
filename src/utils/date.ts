import moment from 'moment'

// prettier-ignore
const indexDayOfWeek = {
  Mon: 0, mon: 0, Monday: 0,    monday: 0,
  Tue: 1, tue: 1, Tuesday: 1,   tuesday: 1,   Tues: 1,
  Wed: 2, wed: 2, Wednesday: 2, wednesday: 2,
  Thu: 3, thu: 3, Thursday: 3,  thursday: 3,
  Fri: 4, fri: 4, Friday: 4,    friday: 4,
  Sat: 5, sat: 5, Saturday: 5,  saturday: 5,
  Sun: 6, sun: 6, Sunday: 6,    sunday: 6,
}

const getDate = (date: string, day_of_week: number) => {
  const process_date = moment(date, "DD/MM/YYYY")
  process_date.add(indexDayOfWeek[day_of_week], 'days')
  return process_date.format('DD/MM/YYYY')
}

export { getDate }
