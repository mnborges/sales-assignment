import { useRouter } from "next/router";
import { useAuth } from "../context/AuthUserContext";
import { ArrowUUpLeft, SignOut } from "phosphor-react";
import { getAuthenticatedUser } from "../lib/sanityData";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar({ page }) {
  const router = useRouter();
  const { logOut, authUser, loading } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => await getAuthenticatedUser(authUser?.uid);
    if (!loading) {
      getUser().then((res) => setUser(res));
    }
  }, [loading, authUser]);

  // sign user out and redirect to login page
  const handleSignOut = () => {
    logOut()
      .then(router.push("/login"))
      .catch((e) => console.error(e));
  };

  return (
    !loading && (
      <nav className=" rounded text-slate-700 bg-blue-300 p-2 w-full sticky top-0 flex flex-row justify-start ">
        {page == "Home" && (
          <div className="flex-grow">Welcome, {authUser?.email} !</div>
        )}
        {page != "Home" && (
          <div className="flex-grow">
            <Link href={"/"}>
              <a className="flex gap-1 w-fit">
                <ArrowUUpLeft size={20} />
                Return to homepage
              </a>
            </Link>
          </div>
        )}
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
      </nav>
    )
  );
}
