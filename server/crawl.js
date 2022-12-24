const puppeteer = require("puppeteer");

const { MongoClient } = require('mongodb');
const atlasURI = require('./atlas.myconfig');
const client = new MongoClient(atlasURI);

async function getDataByScrap() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto('https://m.sports.naver.com/qatar2022/schedule/index', {
    waitUntil: 'networkidle0'
  })

  const container = await page.$("#content > div > div.Schedule_main_section__1SpMt > div.content > div > div");

  const data = await container.$$eval(".ScheduleGameBox_game_box__23m0b", ($posts) => {
    const tdata = [];
    $posts.forEach(($post) => {
      tdata.push({
        type: $post.querySelector(".ScheduleGameBox_game_info__2Iapg").innerText,
        teams: Array.from($post.querySelectorAll(".ScheduleGameBox_name__3QDbf")).map(q => q.innerText),
        scores: Array.from($post.querySelectorAll(".ScheduleGameBox_number__3T3_C")).map(q => Number(q.innerText)),
      })
    })
    return tdata;
  })

  return data;
}

function saveToAtlas(data) {
  client.db('qatar').collection('scores').insertOne({
    data: data
  });
}

async function getFromAtlas() {
  const arr = await client.db('qatar').collection('scores').find().sort({ _id: -1 }).limit(1).toArray()
  const v = arr[0]
  return v.data
}

module.exports = { getDataByScrap, saveToAtlas, getFromAtlas }