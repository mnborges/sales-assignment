import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useAuth } from "../context/AuthUserContext";
import SaleCard from "../components/saleCard";
import {
  getSales,
  deleteSale,
  updateSale,
  getAuthenticatedUser,
} from "../lib/sanityData";

const SHOULD_MOCK = false;

export default function Sales({ sales }) {
  const { loading, authUser } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    //user not registered
    if (!loading && !authUser) router.push("/login");
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

  // wait for authUser
  if (loading || !userRole) return;

  // transform data to return only sales from authenticated user (if not manager)
  const filteredSales =
    userRole === "manager"
      ? sales
      : sales.filter((elem) => elem.seller.authUserId === authUser.uid);

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
    updateStatus: async (sid, newStatus) => {
      if (
        !confirm(`Are you sure you want to set the status to "${newStatus}"?`)
      )
        return false;
      return await updateSale(sid, { status: newStatus });
    },
  };
  return (
    authUser && (
      <>
        <div className="flex flex-col items-center">
          <h1 className="my-5 text-3xl font-bold">Sales page</h1>
          <div className="flex flex-col gap-2 w-10/12">
            {filteredSales.map((sale) => {
              return (
                <SaleCard
                  key={sale._id}
                  sale={sale}
                  admin={userRole === "manager"}
                  handler={buttonHandler}
                />
              );
            })}
            {!filteredSales.length && (
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
      </>
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

Sales.getLayout = function getLayout(page) {
  return <Layout title="View and manage sales">{page}</Layout>;
};
