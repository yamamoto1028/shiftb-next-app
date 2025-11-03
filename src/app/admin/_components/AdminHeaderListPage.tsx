import Link from "next/link";

export default function AdminHeaderListPage(props: {
  title: string;
  href: string;
}) {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">{props.title}</h1>
        <Link href={props.href}>
          <button className="bg-blue-500 hover:bg-blue-700 border-[#548bf0] text-white font-black py-2 px-4 rounded">
            新規作成
          </button>
        </Link>
      </div>
    </>
  );
}
