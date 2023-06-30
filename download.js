import { DOMParser } from "https://js.sabae.cc/DOMParser.js";
import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { Day, Time, DateTime } from "https://js.sabae.cc/DateTime.js";

const parseTable = (tbl) => {
  const trs = tbl.querySelectorAll("tr");
  const ths = trs[0].querySelectorAll("th");
  const names = [];
  for (const th of ths) {
    names.push(th.textContent);
  }
  const res = [];
  for (let i = 1; i < trs.length; i++) {
    const tr = trs[i];
    const tds = tr.querySelectorAll("td");
    const d = {};
    let j = 0;
    for (const name of names) {
      d[name] = tds[j++].textContent;
    }
    res.push(d);
  }
  return res;
};

const parseDateTime = (s) => {
  const n = s.indexOf("（");
  const m = s.indexOf("）");
  const day = new Day(s.substring(0, n));
  const time = new Time(s.substring(m + 1));
  const d = new DateTime(day, time).toString();
  console.log(day, time, d);
  return d;
};

const url = "https://www.tokaikisen.co.jp/schedule/";
const html = await fetchOrLoad(url);
const dom = new DOMParser().parseFromString(html, "text/html");
const schs = dom.querySelectorAll(".scheduleTable");
const data = [];
for (const sch of schs) {
  const title = sch.querySelector("h3").textContent;
  //console.log(title);
  const captiond = sch.querySelector(".caption");
  if (!captiond) {
    break;
  }
  const caption = parseDateTime(captiond.textContent);
  const tbl = sch.querySelector("table");
  const json = parseTable(tbl);
  const head = {
    "更新日時": caption,
    "便名": title,
  };
  for (const j of json) {
    const d = {};
    Object.assign(d, head);
    Object.assign(d, j);
    data.push(d);
  }
}
const csv = CSV.stringify(data);
const day = new Day(data[0].更新日時);
await Deno.writeTextFile("data/latest.csv", csv);
await Deno.writeTextFile("data/" + day.toString() + ".csv", csv);
