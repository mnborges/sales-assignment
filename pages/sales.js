import Link from "next/link";
import { useRouter } from "next/router";
import { PencilSimpleLine, TrashSimple } from "phosphor-react";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useAuth } from "../context/AuthUserContext";
import { getSales, deleteSale } from "../lib/sanityData";

const SHOULD_MOCK = false;

/*
Sales page: listing of all registered sales
 */
const SaleCard = ({ sale, handler }) => {
  // create state hook for each card to expand/shrink content
  const [extendedContent, setExtendedContent] = useState(false);

  const toggleExpand = (e) => {
    // if user clicked a button just skip the toggle -- parentNode to work if user clicks an icon
    if (e.target.type === "button" || e.target.parentNode.type === "button")
      return;
    setExtendedContent(!extendedContent);
  };
  const { client, seller, product, price, date, commission, _id } = sale;
  const { editSale, removeSale } = handler;
  return (
    <div
      className="cursor-pointer relative group rounded-lg shadow-lg flex hover:ring-2 "
      data-bs-toggle="tooltip"
      title={`Click to view ${extendedContent ? "less" : "more"} information`}
      onClick={toggleExpand}
    >
      <div className="top-3 right-1 invisible group-hover:visible absolute z-20 flex items-center justify-center">
        <div
          className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
          role="group"
        >
          <button
            onClick={() => editSale(_id)}
            type="button"
            data-bs-toggle="tooltip"
            title="Edit sale"
            className="rounded-l inline-block p-2 bg-slate-400 bg-opacity-50 hover:bg-slate-500 hover:opacity-100 text-white font-medium text-xs leading-tight uppercase  focus:bg-slate-500 focus:outline-none focus:ring-0 active:bg-slate-800 transition duration-150 ease-in-out"
          >
            <PencilSimpleLine size={18} type="button" />
          </button>
          <button
            onClick={() => removeSale(_id)}
            type="button"
            data-bs-toggle="tooltip"
            title="Delete sale"
            className=" rounded-r inline-block p-2 bg-slate-400 bg-opacity-50 hover:bg-slate-500 hover:opacity-100 text-white font-medium text-xs leading-tight uppercase  focus:bg-slate-500 focus:outline-none focus:ring-0 active:bg-slate-800 transition duration-150 ease-in-out"
          >
            <TrashSimple size={18} />
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-grow rounded-lg p-2 max-w-full bg-slate-100 relative">
        <div className="text-slate-500 text-xs mr-auto absolute ">{date}</div>
        <h1 className="text-slate-900 text-lg leading-none font-medium mx-auto">
          {product}
        </h1>
        <p className="text-center text-slate-700 text-base">
          R$ {price.toFixed(2)}
        </p>
        <div
          className={(extendedContent ? "block " : "hidden ").concat(
            "text-slate-900 text-center"
          )}
        >
          Sold to <b>{client}</b> by <b>{seller.email}</b>
          <div className="text-center text-sm text-blue-900">
            <b>Commission (R$): </b>
            {commission.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Sales({ sales }) {
  const { loading, authUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    //user not registered
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [loading, authUser, router]);
  // transform data to update seller object with information from firebase and return only sales from authenticated user
  const reducedSales = sales.reduce((acc, cur) => {
    if (cur.seller.authUserId === authUser?.uid) {
      cur.seller = { ...cur.seller, email: authUser.email };
      acc.push(cur);
    }
    return acc;
  }, []);
  const buttonHandler = {
    editSale: (sid) => {
      // redirect to edit page
      router.push(`edit/${sid}`);
    },
    removeSale: (sid) => {
      deleteSale(sid)
        // force page reload after delete is made
        // TODO: could update DOM removing SaleCard with an animation instead of reloading
        .then(() => router.reload("/sales"))
        .catch((error) => {
          throw new Error(error.message);
        });
    },
  };
  return (
    authUser && (
      <div>
        <Link href="/">
          <a className="flex justify-end m-2 p-2 text-slate-700">
            Return to homepage
          </a>
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="my-5 text-3xl font-bold">Sales page</h1>
          <div className="flex flex-col gap-2 w-10/12">
            {reducedSales &&
              reducedSales.map((sale) => {
                return (
                  <SaleCard
                    key={sale._id}
                    sale={sale}
                    handler={buttonHandler}
                  />
                );
              })}
            {!reducedSales.length && (
              <div className="inline-block">
                <p className="text-lg text-slate-900 text-center mb-0">
                  Sorry! You have no sales yet.
                </p>
                <Link href="/register">
                  <span className=" text-base flex justify-center gap-1 text-slate-500">
                    Go to the
                    <a className="underline hover:text-slate-900 hover:cursor-pointer">
                      Register
                    </a>
                    page and save your new sales.
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}
export async function getStaticProps() {
  const mockSales = [
    {
      _createdAt: "2022-08-03T20:46:06Z",
      _id: "918e7871-e898-4930-acd7-fd4d22aac00e",
      _rev: "1G2UUznivPiFPf3sr7iNgd",
      _type: "sale",
      _updatedAt: "2022-08-04T14:02:56Z",
      client: "Jane Johnson",
      commission: 10.52,
      date: "2022-08-02",
      price: 526,
      product: "Smartphone",
      seller: {
        _createdAt: "2022-08-03T20:41:31Z",
        _id: "825ff807-6f8e-4ba9-9fb9-164295447d25",
        _rev: "mdf7a5C49O897Yop9nxAF2",
        _type: "user",
        _updatedAt: "2022-08-03T20:41:31Z",
        authUserId: "ehxmkjuOR1gwE0D4P1aOOmezduV2",
        role: "salesman",
      },
    },
  ];
  // ternary to make mocking easier
  const sales = SHOULD_MOCK ? mockSales : await getSales();

  return {
    props: {
      sales,
    },
  };
}
