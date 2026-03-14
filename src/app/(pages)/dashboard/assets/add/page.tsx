import Link from "next/link"

export default function page() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col gap-5 text-gray-700">
        <Link
          className="cursor-pointer sm:text-2xl text-xl font-sans font-bold py-4.5 px-5 text-center rounded bg-gray-300"
          href="/dashboard/assets/add/one"
        >
          Upload Single Asset 1
        </Link>
        <Link
          className="cursor-pointer sm:text-2xl text-xl font-sans font-bold py-4.5 px-5 text-center rounded bg-gray-300"
          href="/dashboard/assets/add/collection"
        >
          Upload Asset Collection 📦
        </Link>
      </div>
    </div>
  )
}
