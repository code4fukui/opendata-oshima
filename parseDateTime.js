import { Day, Time, DateTime, TimeZone } from "https://js.sabae.cc/DateTime.js";

export const parseDateTime = (s) => {
  const n = s.indexOf("（");
  const m = s.indexOf("）");
  const day = new Day(s.substring(0, n));
  const time = new Time(s.substring(m + 1));
  const d = new DateTime(day, time, TimeZone.JST).toString();
  return d;
};
