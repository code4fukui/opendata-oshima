export const parseTable = (tbl) => {
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
