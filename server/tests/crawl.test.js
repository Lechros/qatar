const crawl = require('../crawl');

test("test getDataByScrap", async () => {
  const res = await crawl.getDataByScrap();
  expect(res).not.toBeUndefined();
})

test("test getFromAtlas", async () => {
  const res = await crawl.getFromAtlas();
  expect(res).not.toBeUndefined();
})