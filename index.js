const fetch = require("node-fetch");
const cred = require("./key");

let addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

getDate = (date) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}: `;
};

const index = async () => {
  // Feb 26 2021
  // Oct 15 2019
  // Jun 2 2018
  // Jan 18 2017
  let startDate = new Date("Aug 17 2017");
  let endDate = new Date("Jun 2 2018");
  // endDate.setHours(0, 0, 0, 0);

  let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
  let endDateTimestamp = Math.floor(endDate.getTime() / 1000);

  const response = await fetch(
    `https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:BTCUSDT&resolution=D&from=${startDateTimestamp}&to=${endDateTimestamp}&token=${cred.key}`
  );
  const rawStockAPI = await response.json();

  let sortByPercentage = {
    upLessThanOne: 0,
    upOneToThree: 0,
    upThreeToFive: 0,
    upFivetoTen: 0,
    upmoreThenTen: 0,
    downLessThanOne: 0,
    downOneToThree: 0,
    downThreeToFive: 0,
    downFivetoTen: 0,
    downmoreThenTen: 0,
    didNotChange: 0,
  };

  if (rawStockAPI.s == "ok") {
    console.log("Number of days: " + rawStockAPI.c.length);

    let numberOfDays = rawStockAPI.c.length;
    for (var i = 0; i < numberOfDays; i++) {
      let percentageChange = (
        ((rawStockAPI.c[i] - rawStockAPI.o[i]) / rawStockAPI.o[i]) *
        100
      ).toFixed(2);

      console.log(`${getDate(addDays(startDate, i))}${percentageChange}%,`);

      if (percentageChange == 0) sortByPercentage.didNotChange++;

      if (percentageChange <= 0 && percentageChange > -1)
        sortByPercentage.downLessThanOne++;

      if (percentageChange <= -1 && percentageChange > -3)
        sortByPercentage.downOneToThree++;

      if (percentageChange <= -3 && percentageChange > -5)
        sortByPercentage.downThreeToFive++;

      if (percentageChange <= -5 && percentageChange > -10)
        sortByPercentage.downFivetoTen++;

      if (percentageChange <= -10) sortByPercentage.downmoreThenTen++;

      if (percentageChange >= 0 && percentageChange < 1)
        sortByPercentage.upLessThanOne++;

      if (percentageChange >= 1 && percentageChange < 3)
        sortByPercentage.upOneToThree++;

      if (percentageChange >= 3 && percentageChange < 5)
        sortByPercentage.upThreeToFive++;

      if (percentageChange >= 5 && percentageChange < 10)
        sortByPercentage.upFivetoTen++;

      if (percentageChange >= 10) sortByPercentage.upmoreThenTen++;
    }

    console.log(sortByPercentage);
  }
};

index();
