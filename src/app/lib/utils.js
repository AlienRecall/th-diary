import { format, formatDistanceToNow } from "date-fns";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isEmailValid = (email) => {
  if (!email || email.length > 254) return false;

  if (!emailRegex.test(email)) return false;

  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");
  if (domainParts.some((part) => part.length > 63)) return false;

  return true;
};

export const formatDistanceToNowCreatedAt = (d) => {
  const gmtDate = new Date(d);
  const localDate = new Date(gmtDate.getTime() - gmtDate.getTimezoneOffset() * 60000);
  return formatDistanceToNow(localDate, { addSuffix: true });
}

export const formatCreatedAt = (d) => {
  const gmtDate = new Date(d);
  const localDate = new Date(gmtDate.getTime() - gmtDate.getTimezoneOffset() * 60000);
  return format(localDate, "yyyy-MM-dd HH:mm:ss");
}