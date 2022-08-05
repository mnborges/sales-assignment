import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthUserContext";
import Link from "next/link";
import {
  getUsers,
  createSale,
  getAuthenticatedUser,
  getMonthSales,
} from "../lib/sanityData";

export default function Register() {
  const router = useRouter();
  const client = useRef(null);
  const product = useRef(null);
  const price = useRef(null);
  const date = useRef(null);
  const { loading, authUser } = useAuth();

  useEffect(() => {
    //user not registered
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [loading, authUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // get user object that matches seller logged in
    const seller = await getAuthenticatedUser(authUser.uid);
    const monthSales = await getMonthSales();
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
    let commission = 0;
    const value = Number(price.current.value);
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

    const doc = {
      client: client.current.value,
      seller: {
        _ref: seller._id,
        _type: "reference",
      },
      product: product.current.value,
      price: parseFloat(price.current.value),
      date: date.current.value,
      commission: parseFloat(commission.toFixed(2)),
      status: "pending", // new document so the sale is neither rejected or approved
    };
    createSale(doc)
      .then(alert("Sale successfully created."))
      .catch((error) => {
        throw new Error(error.message);
      });

    client.current.value = "";
    product.current.value = "";
    price.current.value = "";
    date.current.value = "";
  };
  // today should be the maximum date allowed to be registered
  const dateMax = new Date().toLocaleDateString("en-ca");
  return (
    authUser && (
      <div>
        <Link href="/">
          <a className="flex justify-end m-2 p-2 text-slate-700">
            Return to homepage
          </a>
        </Link>
        <div className="mt-6 mx-auto w-fit flex flex-col justify-center bg-slate-100 shadow-lg p-4 rounded-lg">
          <form onSubmit={handleSubmit}>
            <h2 className="text-slate-900 text-lg mb-2 font-medium">
              Register New Sale
            </h2>
            <label className="block m-1">
              <span className="block text-sm font-medium text-slate-700">
                Client name
              </span>
              <input
                ref={client}
                required
                placeholder="E.g. Jane Doe"
                type="text"
                className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </label>
            <label className="block m-1">
              <span className="block text-sm font-medium text-slate-700">
                Product name
              </span>
              <input
                ref={product}
                required
                placeholder="E.g. Magic wand"
                type="text"
                className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </label>
            <label className="block m-1">
              <span className="block text-sm font-medium text-slate-700">
                Price R$
              </span>
              <input
                min="0"
                ref={price}
                required
                step=".01"
                placeholder="E.g. 249.90"
                type="number"
                className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </label>
            <label className="block m-1">
              <span className="block text-sm font-medium text-slate-700">
                Date
              </span>
              <input
                ref={date}
                required
                type="date"
                max={dateMax}
                className="rounded-none relative block w-full px-3 py-2 border border-gray-300 invalid:text-grey-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </label>
            <input
              type="submit"
              value="submit"
              className="uppercase font-semibold text-xs flex ml-auto px-5 mt-4 p-2 rounded-lg hover:bg-slate-900 hover:text-slate-100 bg-slate-400 text-slate-900"
            />
          </form>
        </div>
      </div>
    )
  );
}
