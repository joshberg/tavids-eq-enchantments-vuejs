const puppeteer = require('puppeteer');

const p99root = "https://wiki.project1999.com/";
const mobInfoItems = ['AC',
  'agro_radius', 'attack_speed', 'attacks_per_round', 'class', 'damage_per_hit',
  'HP', 'HP_regen', 'level', 'mana_regen', 'name', 'race', 'respawn_time',
  'run_speed', 'special', 'zone', 'location', 'known_loot', 'factions',
  'opposing_factions', 'related_quests', 'description'
];

let browser;

var GetMobInfo = async (target) => {
  // ipcRenderer.send('logme', 'SearchTarget: ' + target);
  target = target.split(' ').join('_');
  console.log("Attempting to lookup: ", target);

  if (browser === undefined) browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(p99root + "index.php?title=" + target + "&action=edit");
  const selector = '#wpTextbox1';
  const textSelector = await page.waitForSelector(selector);
  const text = await textSelector.evaluate(el => el.textContent);

  page.close();

  let mob = {};
  let lines = text.split('|');
  lines.shift();
  for (let k = 0; k < lines.length; k++) {
    let splitLine = lines[k].split('=');
    let key = splitLine[0].trim();
    if (mobInfoItems.indexOf(key) > -1) {
      let value;
      if (splitLine[1] === undefined) {
        value = '';
      } else if (splitLine.length > 2) {
        splitLine.shift();
        splitLine[splitLine.length - 1] = splitLine[splitLine.length - 1].substring(0, splitLine[splitLine.length - 1].indexOf('}}'));
        value = splitLine.join('=');
      } else {
        value = splitLine[1].trim();
      }

      value = value.replace(/\[/g,'').replace(/\]/g,'');

      if (key === "level") {
        if (value.includes('-')) {
          const numbs = value.split('-');
          mob[key] = {
            min: numbs[0],
            max: numbs[1]
          }
        }
      } else if (key === "location"){
        mob[key] = value.split('), ').map(x => x.replace('(','').replace(')','').trim());
      } else {
        mob[key] = value;
      }
    }
  }

  return mob;
}

export default {
  GetMobInfo
}
