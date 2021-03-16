const fetch = require("node-fetch");
const fs = require("fs");
const cred = require("./key");

// helper
const percentageFluctuation = (check, open) => {
  let percentage = ((check - open) / open) * 100;
  return Math.round(percentage * 100) / 100;
};

const yearDate = {
  2017: {
    start: new Date("Dec 20 2016 13:00:00").getTime() / 1000,
    end: new Date("Dec 20 2017 12:59:59").getTime() / 1000,
  },
  2018: {
    start: new Date("Dec 20 2017 13:00:00").getTime() / 1000,
    end: new Date("Dec 20 2018 12:59:59").getTime() / 1000,
  },
  2019: {
    start: new Date("Dec 20 2018 13:00:00").getTime() / 1000,
    end: new Date("Dec 20 2019 12:59:59").getTime() / 1000,
  },
  2020: {
    start: new Date("Dec 20 2019 13:00:00").getTime() / 1000,
    end: new Date("Dec 20 2020 12:59:59").getTime() / 1000,
  },
};

// console.log(yearDate);

const index = async () => {
  let stringData = "";

  for (let year in yearDate) {
    const response = await fetch(
      `https://finnhub.io/api/v1/crypto/candle?symbol=BITFINEX:ETHUSD&resolution=M&from=${yearDate[year].start}&to=${yearDate[year].end}&token=${cred.key}`
    );
    const rawStockAPI = await response.json();

    console.log(rawStockAPI);

    let totleWeeks = rawStockAPI.c.length;
    for (let week = 0; week < totleWeeks; week++) {
      stringData += `- ${year} ETH Week ${week + 1}: ${percentageFluctuation(
        rawStockAPI.l[week],
        rawStockAPI.o[week]
      )}% | ${percentageFluctuation(
        rawStockAPI.c[week],
        rawStockAPI.o[week]
      )}%,\n`;
    }

    if (rawStockAPI.s == "ok") {
      console.log("Number of items: " + totleWeeks);

      fs.appendFile(`data/weekly/2017-2020_eth_M.txt`, stringData, (err) => {
        if (err) throw err;
        console.log("Saved!");
      });
    }
  }
};

index();
