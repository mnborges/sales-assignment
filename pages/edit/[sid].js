import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthUserContext";
import { getSaleById, getSalesIds } from "../../lib/sanityData";
import Layout from "../../components/layout";
import RegisterForm from "../../components/registerForm";

const Edit = ({ sale }) => {
  const { loading, authUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    // user not registered
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [loading, authUser, router]);

  if (loading) return;
  // prevent who's not sale's seller to edit it
  else if (authUser?.uid !== sale.seller.authUserId) {
    return <h1 className="text-4xl p-6 text-center">Not allowed.</h1>;
  }

  return <RegisterForm sale={sale} />;
};

export default Edit;

export async function getStaticProps(context) {
  // get sale information from accessed id
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

Edit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
