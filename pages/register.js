import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthUserContext";
import { createSale, getAuthenticatedUser } from "../lib/sanityData";
import calculateCommission from "../lib/commission";
import Layout from "../components/layout";

export default function Register() {
  const router = useRouter();
  const client = useRef(null);
  const product = useRef(null);
  const price = useRef(null);
  const date = useRef(null);
  const { loading, authUser } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    //user not registered
    if (!loading && !authUser) {
      router.push("/login");
    }
    //user logged in
    if (!loading && authUser) {
      // IIFE to update userRole state
      (async () => await getAuthenticatedUser(authUser.uid))()
        .then(({ role }) => {
          setUserRole(role);
        })
        .catch((e) => {
          throw new Error(e.message);
        });
    }
  }, [loading, authUser, router]);

  if (loading || !userRole) return;
  // prevent who's not sale's seller to edit it
  else if (userRole !== "salesman") {
    return <h1 className="text-4xl p-6 text-center">Not allowed.</h1>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // get user object that matches seller logged in
    const seller = await getAuthenticatedUser(authUser.uid);
    const commission = await calculateCommission(price.current.value);
    const doc = {
      client: client.current.value,
      seller: {
        _ref: seller._id,
        _type: "reference",
      },
      product: product.current.value,
      price: parseFloat(price.current.value),
      date: date.current.value,
      commission: commission,
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

Register.getLayout = function getLayout(page) {
  return <Layout title="Register a new sale">{page}</Layout>;
};
