import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

function mediaBlock(styles, query) {
  const marker = `@media(${query}){`;
  const blocks = [];
  let start = styles.indexOf(marker);

  while (start !== -1) {
    let depth = 0;
    let end = -1;
    for (let index = start + marker.length - 1; index < styles.length; index += 1) {
      if (styles[index] === "{") depth += 1;
      if (styles[index] === "}") depth -= 1;
      if (depth === 0) {
        end = index;
        break;
      }
    }

    assert.notEqual(end, -1, `unterminated @media(${query})`);
    blocks.push(styles.slice(start + marker.length, end));
    start = styles.indexOf(marker, end + 1);
  }

  assert.ok(blocks.length > 0, `missing @media(${query})`);
  return blocks.join("\n");
}

test("phone taskbar remains readable and touch sized", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");

  assert.match(phone, /\.project-taskbar\{[^}]*min-height:48px/);
  assert.match(phone, /\.project-taskbar-back\{[^}]*min-height:44px[^}]*display:inline-flex[^}]*align-items:center/);
  assert.match(phone, /\.project-taskbar-title\{[^}]*min-width:0[^}]*overflow:hidden[^}]*text-overflow:ellipsis[^}]*white-space:nowrap/);
});

test("sub-800 detail layouts preserve image ratios and remove sticky columns", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const detailPhoneAndTablet = mediaBlock(styles, "max-width:799px");

  assert.match(detailPhoneAndTablet, /\.woof-explanation-sticky\{[^}]*position:static[^}]*max-height:none[^}]*overflow:visible/);
  assert.match(detailPhoneAndTablet, /\.metakeys-detail-aside-inner,\.editorial-detail-aside-inner\{[^}]*position:static/);
  assert.match(detailPhoneAndTablet, /\.woof-image-stream img,\.editorial-story img,\.daily-reading-page img\{[^}]*width:100%[^}]*height:auto[^}]*object-fit:contain/);
  assert.match(detailPhoneAndTablet, /\.editorial-story-pair,\.editorial-story-asymmetric,\.editorial-story-remainder,\.metakeys-portrait-pair,\.metakeys-system-grid,\.metakeys-square-pair\{[^}]*grid-template-columns:1fr/);
});

test("phone pager and shared footer collapse without horizontal overflow", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");

  assert.match(phone, /\.project-pager\{[^}]*grid-template-columns:1fr[^}]*padding-bottom:4rem/);
  assert.match(phone, /\.project-pager-next\{[^}]*align-items:flex-start[^}]*text-align:left/);
  assert.match(phone, /\.footer\{[^}]*padding:1\.5rem var\(--pad\) \.75rem/);
  assert.match(phone, /\.footer-contact-link\{[^}]*overflow-wrap:anywhere/);
});

test("portrait tablets retain a two-column pager and inset taskbar", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const tablet = mediaBlock(styles, "min-width:600px) and (max-width:899px");

  assert.match(tablet, /\.project-pager\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)[^}]*gap:2rem/);
  assert.match(tablet, /\.project-taskbar\{[^}]*width:calc\(100% - 24px\)/);
});
