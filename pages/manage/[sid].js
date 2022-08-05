import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthUserContext";
import { getSaleById, getSalesIds } from "../../lib/sanityData";
/*
Page thats display complete information (especially commission related) about a sale
sid = sales id
*/
const Sale = ({ sale }) => {
  const router = useRouter();
  const { loading, authUser } = useAuth();

  useEffect(() => {
    //user not registered
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [loading, authUser, router]);
  return <p>Sale: {sale._id}</p>;
};

export default Sale;

export async function getStaticProps(context) {
  const sale = await getSaleById(context.params.sid);
  return {
    props: {
      sale: sale,
    },
  };
}
export async function getStaticPaths() {
  const sales = await getSalesIds();
  const paths = sales.map((sale) => ({
    params: { sid: sale._id },
  }));
  return {
    paths,
    fallback: false,
  };
}
