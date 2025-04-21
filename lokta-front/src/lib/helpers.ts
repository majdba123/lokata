import dayjs from "dayjs";

export const formatTimestamp = (timestamp: Date | string) => {
  const date = dayjs(timestamp);
  const now = dayjs();

  if (date.isToday()) {
    return date.format("HH:mm");
  } else if (date.isYesterday()) {
    return `Yesterday ${date.format("HH:mm")}`;
  } else if (
    date.isSameOrBefore(now.subtract(2, "day")) &&
    date.isSameOrBefore(now.subtract(7, "day"))
  ) {
    return date.format("ddd HH:mm");
  } else {
    return date.format("DD/MM/YY");
  }
};

export const fixInvalidUserId = (userId: string | undefined) => {
  const id = Number(userId);
  if (Number.isNaN(id)) return -1;
  return id;
};

export const truncateString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};
