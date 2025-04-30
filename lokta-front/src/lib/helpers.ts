import dayjs from "dayjs";

export const formatTimestamp = (timestamp: Date | string) => {
  const date = dayjs(timestamp);

  if (date.isToday()) {
    return date.format("h:mm A");
  }
  if (date.isYesterday()) {
    if (dayjs().diff(date, "hour") < 24) {
      return date.fromNow();
    }
    return "Yesterday";
  }
  if (dayjs().diff(date, "day") < 7) {
    return date.fromNow();
  }
  return date.format("MMM D, YYYY");
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
