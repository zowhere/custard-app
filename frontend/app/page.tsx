import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white pt-10">
      {/* Top spacing only */}
      <main className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-3xl font-semibold text-yellow-600 mb-6">
          Welcome to Custard Wallet
        </h1>
        <form className="bg-yellow-50 p-6 rounded-xl shadow-md w-80 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button
            type="submit"
            className="w-full p-3 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 font-medium rounded-md transition"
          >
            Sign In
          </button>
        </form>
      </main>
    </div>
  );
}
