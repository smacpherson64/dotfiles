export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export function getDayOfYear(date: Date) {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 0)
  return Math.floor((date.getTime() - firstDayOfYear.getTime()) / DAY)
}

export const toSeconds = (date: Date) => Math.floor(date.getTime() / SECOND)
