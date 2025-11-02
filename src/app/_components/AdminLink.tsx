import Link from "next/link";

export default function AdminLink(props: {
  title: string;
  href: string;
  isActive: boolean;
}) {
  return (
    <>
      <Link
        href={props.href}
        className={`p-4 text-[#000] font-[500] flex items-center hover:bg-blue-100 ${
          props.isActive ? `bg-blue-200` : ``
        }`}
      >
        <p className="w-[100%]">{props.title}</p>
      </Link>
    </>
  );
}
