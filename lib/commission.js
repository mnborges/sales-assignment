import { getMonthSales } from "./sanityData";

export default async function calculateCommission(price) {
  const value = Number(price);
  const monthSales = await getMonthSales();
  let commission = 0;
  // reduce array of sales to an object with "bonuses count" and total amount sold
  const bonusCheck = monthSales.reduce(
    (acc, cur) => {
      acc.total += cur.price;
      if (cur.price >= 1200) acc.case1++;
      // count this bonus only if price is more than 800 but less than 1200
      else if (cur.price >= 800) acc.case2++;
      return acc;
    },
    { case1: 0, case2: 0, total: 0 }
  );
  // calculate seller's commission amount
  if (value <= 1600) {
    commission = value * 0.04;
    if (value < 1200) {
      commission = value * 0.03;
      if (value < 800) {
        commission = value * 0.02;
        if (value < 400) {
          commission = value * 0.01;
        }
      }
    }
    // add 1% more if sells of the month exceed R$10000
    if (bonusCheck.total > 10000) commission += value * 0.01;
  }
  // if it's the first sell above 1200 of the month, add extra R$ 100
  if (!bonusCheck.case1 && value > 1200) commission += 100.0;
  //if it's the first sell above 800 of the month, add extra R$ 50
  if (!bonusCheck.case2 && value > 800) commission += 50.0;
  return parseFloat(commission.toFixed(2));
}
