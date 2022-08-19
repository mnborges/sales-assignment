import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthUserContext";
import { getAuthenticatedUser } from "../lib/sanityData";
import Layout from "../components/layout";
import RegisterForm from "../components/registerForm";

export default function Register() {
  const router = useRouter();
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
  // prevent who's not salesman to register a sale
  else if (userRole !== "salesman") {
    return <h1 className="text-4xl p-6 text-center">Not allowed.</h1>;
  }

  return <RegisterForm authUser={authUser} />;
}

Register.getLayout = function getLayout(page) {
  return <Layout title="Register a new sale">{page}</Layout>;
};
