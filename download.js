import { DOMParser } from "https://js.sabae.cc/DOMParser.js";
import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { Day } from "https://js.sabae.cc/DateTime.js";
import { parseDateTime } from "./parseDateTime.js";
import { parseTable } from "./parseTable.js";

const url = "https://www.tokaikisen.co.jp/schedule/";
const html = await fetchOrLoad(url);
const dom = new DOMParser().parseFromString(html, "text/html");
const schs = dom.querySelectorAll(".scheduleTable");
const data = [];
for (const sch of schs) {
  const title = sch.querySelector("h3").textContent;
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
