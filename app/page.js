'use client';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center bg-white bg-opacity-80 p-10 rounded-2xl shadow-xl max-w-md"
      >
        <h1 className="text-4xl font-bold text-blue-800 mb-6">
          Market with Inioluwa
        </h1>
        <Link href="/create-order">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-xl">
            Create Order
          </Button></Link>

      </motion.div>
    </main>
  );
}
