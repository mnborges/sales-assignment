import Link from "next/link";

// Should introduce user to the app and provide links to all other pages
export default function Home() {
  return (
    <div>
      <h1 className="my-5 flex justify-center text-3xl font-bold">
        Welcome to Saleasy, your uncomplicated sales administration app
      </h1>
      <ul>
        <li>
          <Link href="manage">
            <a>Edit/Remove a sale</a>
          </Link>
        </li>
        <li>
          <Link href="register">
            <a>Register a new sale</a>
          </Link>
        </li>
        <li>
          <Link href="sales">
            <a>View all sales</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
