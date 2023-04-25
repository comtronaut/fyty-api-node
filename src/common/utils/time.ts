import dayjs from "dayjs";

export function diffMinute(startAt: Parameters<typeof dayjs>[0], endAt: Parameters<typeof dayjs>[0]): number {
  return Math.abs(dayjs(startAt).diff(dayjs(endAt), "minute"));
}
