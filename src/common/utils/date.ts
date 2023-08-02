import dayjs from "dayjs";

export function getDayRangeWithin(
  rawDate: ConstructorParameters<typeof Date>[0],
  timezoneOffset?: number
): { start: Date; end: Date } {
  const today = new Date(rawDate);

  const dayStart = timezoneOffset
    ? dayjs(today).utcOffset(timezoneOffset * 60)
    : dayjs(today);
  const dayEnd = timezoneOffset
    ? dayjs(today).utcOffset(timezoneOffset * 60)
    : dayjs(today);

  return {
    start: dayStart.startOf("day").toDate(),
    end: dayEnd.endOf("day").toDate()
  };
}
