import { useRouter } from "next/router";
import { useState } from "react";
import calculateCommission from "../lib/commission";
import {
  getAuthenticatedUser,
  updateSale,
  createSale,
} from "../lib/sanityData";

export default function RegisterForm({ sale = false, authUser }) {
  const [clientName, setClientName] = useState(sale ? sale.client : "");
  const [productName, setProducName] = useState(sale ? sale.product : "");
  const [price, setPrice] = useState(sale ? sale.price : "");
  const [date, setDate] = useState(sale ? sale.date : "");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // calculate commission
    const commission = await calculateCommission(price);
    // prepare object to create/update document in sanity's content lake
    const doc = {
      client: clientName,
      seller: {
        _ref: sale
          ? // sale already has seller's info
            sale.seller._id
          : // get seller's id
            (await getAuthenticatedUser(authUser.uid))?._id,
        _type: "reference",
      },
      product: productName,
      price: parseFloat(price),
      date: date,
      commission: commission,
      status: "pending",
    };
    if (!sale) {
      // Submit a new sale by creating new sanity's document
      createSale(doc)
        .then(() => {
          alert("Sale successfully created.");
          setClientName("");
          setProducName("");
          setPrice("");
          setDate("");
        })
        .catch((error) => {
          throw new Error(error.message);
        });
      return;
    }
    // Submit sale's edition
    if (
      !confirm(
        "Please confirm you'd like to submit these changes.\nOnce you do, the sale will be pending approval."
      )
    )
      return false;
    // update sanity content lake
    return await updateSale(sale._id, doc)
      .then(() => {
        alert("Sale successfully updated.");
        router.push("/sales");
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const dateMax = new Date().toLocaleDateString("en-ca");
  return (
    <div className="mt-6 mx-auto w-fit flex flex-col justify-center bg-slate-100 shadow-lg p-4 rounded-lg">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h2 className="text-slate-900 text-lg mb-2 font-medium">
          {!sale ? "Register Sale" : "Edit Sale"}
        </h2>
        <label className="block m-1">
          <span className="block text-sm font-medium text-slate-700">
            Client name
          </span>
          <input
            onChange={(e) => setClientName(e.target.value)}
            value={clientName}
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
            id="product"
            onChange={(e) => setProducName(e.target.value)}
            value={productName}
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
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            min="0"
            required
            step=".01"
            placeholder="E.g. 249.90"
            type="number"
            className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </label>
        <label className="block m-1">
          <span className="block text-sm font-medium text-slate-700">Date</span>
          <input
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
            type="date"
            max={dateMax}
            className="rounded-none relative block w-full px-3 py-2 border border-gray-300 invalid:text-grey-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </label>
        <div className="flex flex-row gap-1 justify-between mt-4">
          {sale && (
            <button
              onClick={() => router.push("/sales")}
              type="button"
              value="cancel"
              data-bs-toggle="tooltip"
              title="Cancel edit and return to sales page"
              className="uppercase font-semibold text-xs flex px-5 p-2 rounded-lg hover:bg-slate-900 hover:text-slate-100 bg-slate-100 text-slate-900"
            >
              Cancel
            </button>
          )}
          <input
            type="submit"
            value="submit"
            data-bs-toggle="tooltip"
            title={
              !sale
                ? "Register a new sale"
                : "Save changes and return to sales page"
            }
            className="uppercase font-semibold text-xs flex ml-auto px-5 p-2 rounded-lg hover:bg-slate-900 hover:text-slate-100 bg-slate-400 text-slate-900"
          />
        </div>
      </form>
    </div>
  );
}
