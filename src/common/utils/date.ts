import dayjs from "dayjs";

export function getDayRangeWithin(
  rawDate: any,
  timezoneShift?: number
): { start: Date; end: Date } {
  const today = new Date(rawDate);

  const dayStart = dayjs(today).startOf("day");
  const dayEnd = dayjs(today).endOf("day");

  if (timezoneShift) {
    dayStart.add(timezoneShift, "hour");
    dayEnd.add(timezoneShift, "hour");
  }

  return { start: dayStart.toDate(), end: dayEnd.toDate() };
}
