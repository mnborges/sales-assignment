import Head from "next/head";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children, title = "Saleasy" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {<Navbar />}

      <main>{children}</main>

      <Footer />
    </>
  );
}
