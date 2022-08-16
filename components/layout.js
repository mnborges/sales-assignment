import Head from "next/head";
import Link from "next/link";
import Navbar from "./navbar";

export default function Layout({ children }) {
  const github = "https://github.com/mnborges";

  return (
    <>
      <Head>
        <title>Saleasy</title>
      </Head>
      <Navbar page={children.type.name} />
      <main>{children}</main>

      <footer className="font-light text-sm text-slate-600 p-2 fixed bottom-0 float-left">
        Developed by{" "}
        <a className="hover:text-slate-900">
          <Link href={github}>@mnborges</Link>
        </a>
      </footer>
    </>
  );
}
