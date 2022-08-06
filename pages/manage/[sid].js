import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthUserContext";
import calculateCommission from "../../lib/commission";
import { getSaleById, getSalesIds, updateSale } from "../../lib/sanityData";

const Edit = ({ sale }) => {
  const router = useRouter();
  const { loading, authUser } = useAuth();
  const [clientName, setClientName] = useState(sale.client);
  const [productName, setProducName] = useState(sale.product);
  const [price, setPrice] = useState(sale.price);
  const [date, setDate] = useState(sale.date);

  useEffect(() => {
    // user not registered
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [loading, authUser, router]);

  if (loading) {
    return <div>Loading...</div>;
  }
  // prevent who's not sale's seller to edit it
  if (!loading && authUser.uid !== sale.seller.authUserId) {
    return <h1 className="text-4xl p-6 text-center">Not allowed.</h1>;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      confirm(
        "Please confirm you'd like to submit these changes.\nOnce you do, the sale will be pending approval."
      )
    ) {
      // recalculate commission and update sanity content lake
      const commission = await calculateCommission(price);
      const doc = {
        client: clientName,
        seller: {
          _ref: sale.seller._id,
          _type: "reference",
        },
        product: productName,
        price: parseFloat(price),
        date: date,
        commission: commission,
        status: "pending",
      };
      return await updateSale(sale._id, doc)
        .then(() => {
          alert("Sale successfully updated.");
          router.push("/sales");
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    }
    return console.log("canceled");
  };
  const dateMax = new Date().toLocaleDateString("en-ca");
  return (
    <div>
      <Link href="/">
        <a className="flex justify-end m-2 p-2 text-slate-700">
          Return to homepage
        </a>
      </Link>
      <div className="mt-6 mx-auto w-fit flex flex-col justify-center bg-slate-100 shadow-lg p-4 rounded-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-slate-900 text-lg mb-2 font-medium">Edit Sale</h2>
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
            <span className="block text-sm font-medium text-slate-700">
              Date
            </span>
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
            <input
              type="submit"
              value="submit"
              data-bs-toggle="tooltip"
              title="Save changes and return to sales page"
              className="uppercase font-semibold text-xs flex ml-auto px-5 p-2 rounded-lg hover:bg-slate-900 hover:text-slate-100 bg-slate-400 text-slate-900"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;

export async function getStaticProps(context) {
  // get sale accessed
  const sale = await getSaleById(context.params.sid);
  return {
    props: {
      sale: sale,
    },
  };
}
// get paths allowed for this component
export async function getStaticPaths() {
  // getSalesIds returns an array only with the Ids of every registered sale
  const sales = await getSalesIds();
  // transform data to return expected array of objects
  const paths = sales.map((sale) => ({
    params: { sid: sale._id },
  }));
  return {
    paths,
    fallback: false,
  };
}
