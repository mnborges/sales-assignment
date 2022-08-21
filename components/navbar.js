import { useRouter } from "next/router";
import { useAuth } from "../context/AuthUserContext";
import { ArrowUUpLeft, SignOut } from "phosphor-react";
import Link from "next/link";

export default function Navbar({ page }) {
  const router = useRouter();
  const { logOut, authUser, loading } = useAuth();

  // sign user out and redirect to login page
  const handleSignOut = () => {
    logOut()
      .then(router.push("/login"))
      .catch((e) => console.error(e));
  };

  return (
    !loading && (
      <div className="rounded border-slate-900 text-slate-100 bg-slate-800 p-2 w-full sticky top-0 flex flex-row justify-start ">
        <div className="flex-grow cursor-default">
          {page == "Home" && (
            <>
              Welcome,{" "}
              <span className="text-slate-400 ">{authUser?.email}</span> !
            </>
          )}
          {page != "Home" && (
            <Link href={"/"}>
              <a className="flex gap-1 w-fit">
                <ArrowUUpLeft size={20} />
                Return to homepage
              </a>
            </Link>
          )}
        </div>
        <button
          className="group px-4 rounded-xl flex gap-1 w-fit justify-self-end self-end ali"
          onClick={handleSignOut}
          data-bs-toggle="tooltip"
          title="Sign out"
        >
          {page != "Home" && authUser.email}
          <span className="group-hover:translate-x-1">
            <SignOut size={24} />
          </span>
        </button>
      </div>
    )
  );
}
