import Link from "next/link";
import { useRouter } from "next/router";
import { CaretDoubleRight } from "phosphor-react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthUserContext";

const Card = ({ page }) => {
  const { title, subtext, link } = page;
  return (
    <Link href={link}>
      <a className="group rounded-lg shadow-lg basis-1/4 flex hover:ring-2">
        <div className=" rounded-l-lg block p-6 max-w-sm flex-grow bg-slate-100">
          <h5 className="text-slate-900 text-xl leading-tight font-medium mb-2">
            {title}
          </h5>
          <p className="text-slate-700 text-base mb-4">{subtext}</p>
        </div>
        <div className="rounded-r-lg flex p-5 bg-blue-300 group-hover:bg-blue-500">
          <span className="my-auto">
            <CaretDoubleRight size={24} />
          </span>
        </div>
      </a>
    </Link>
  );
};
// Should introduce user to the app and provide links to all other pages
export default function Home() {
  const pages = [
    { title: "Register", subtext: "Register a new sale", link: "register" },
    { title: "Manage", subtext: "Edit or remove a sale", link: "manage" },
    { title: "Sales", subtext: "Check out registered sales", link: "sales" },
  ];
  const { logOut, authUser, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    //user not registered
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [loading, authUser, router]);
  const handleSignOut = (e) => {
    e.preventDefault();
    logOut()
      .then(router.push("/login"))
      .catch((e) => console.log(e));
  };
  // if user is not yet logged in, redirect to login page
  return (
    authUser && (
      <div>
        <button
          className="p-2 rounded-lg bg-red-300 hover:bg-red-700"
          onClick={handleSignOut}
          value="Log Out"
        >
          Log Out
        </button>
        <div className="p-10 my-5">
          <h1 className=" leading-relaxed text-7xl font-bold text-center text-slate-900">
            Saleasy
          </h1>
          <p className="text-2xl text-center text-slate-800">
            The most uncomplicated sales administration app
          </p>
        </div>
        <div className="mt-5 flex flex-row justify-evenly gap-2 flex-wrap">
          {pages.map((page, index) => (
            <Card key={index} page={page} />
          ))}
        </div>
      </div>
    )
  );
}
