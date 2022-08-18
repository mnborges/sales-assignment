import Link from "next/link";

export default function Footer() {
  return (
    <footer className="font-light text-sm text-slate-600 p-2 fixed bottom-0 float-left">
      <Link href="https://github.com/mnborges">
        <>
          Developed by{" "}
          <a className="hover:text-slate-900 cursor-pointer">@mnborges</a>
        </>
      </Link>
    </footer>
  );
}
