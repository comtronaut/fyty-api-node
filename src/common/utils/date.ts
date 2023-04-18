import dayjs from "dayjs";

export function getDayRangeWithin(rawDate: any): { start: Date; end: Date } {
  const today = new Date(rawDate);

  const dayStart = dayjs(today).startOf("day").toDate();
  const dayEnd = dayjs(today).endOf("day").toDate();

  return { start: dayStart, end: dayEnd };
}
