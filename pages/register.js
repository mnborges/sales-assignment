import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthUserContext";
/*
Register page: user should be able to register a new sale with all info
sale: {
  client,
  seller,
  product,
  price,
  date,
  commission
}
 */

export default function Register() {
  const router = useRouter();
  // this info will come from db
  const sellerOptions = ["Jane", "Clare", "John", "Harry"];
  const client = useRef(null);
  const seller = useRef(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const extraPercent = true; // (monthSells > 10000)
    const firstAbove800 = false;
    const firstAbove1200 = false;
    let commission = 0;
    const value = Number(price.current.value);
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
      // add 1% more if sells of the month
      if (extraPercent) commission = commission + value * 0.01;
    }
    // if it's the first sell above 1200 of the month, extra = 100
    if (firstAbove1200) commission += 100.0;
    //if it's the first sell above 800 of the month, extra = 50
    if (firstAbove800) commission += 50.0;
    // check whether data is valid and insertion was successful
    const successful = true;
    if (!successful) {
      return false;
    }
    const obj = {
      clientName: client.current.value,
      sellerName: seller.current.value,
      productName: product.current.value,
      productPrice: price.current.value,
      date: date.current.value,
      commissionValue: commission,
    };
    console.log(obj);
    client.current.value = "";
    seller.current.value = "";
    product.current.value = "";
    price.current.value = "";
    date.current.value = "";
  };
  // today should be the maximum date allowed to be registered
  const dateMax = new Date().toLocaleDateString("en-ca");
  return (
    authUser && (
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
              Seller
            </span>
            <select
              ref={seller}
              required
              className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            >
              {sellerOptions.map((option, index) => (
                //change key and value in the future to match seller id
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
        <div className="invisible">
          Inform User whether submit was successful
        </div>
      </div>
    )
  );
}
