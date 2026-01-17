export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export function getDayOfYear(date: Date) {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 0);
  return Math.floor((date.getTime() - firstDayOfYear.getTime()) / DAY);
}

export const toSeconds = (date: Date) => Math.floor(date.getTime() / SECOND);

export function parseISODate(input: string): Date | undefined {
  if (!input) return;
  if (typeof input !== "string") return;

  switch (input.length) {
    // 2016
    case 4:
    // 2016-10
    case 7:
    // 2016-10-23
    case 10: {
      const [year, month = 0, day = 1] = input
        .split("-")
        .map((item) => Number(item));

      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    default: {
      // Assume ISODate 2016-10-23T15:15:14
      const result = new Date(input);
      return Number.isNaN(result.getTime()) ? undefined : result;
    }
  }
}
