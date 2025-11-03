export default function AdminErrorMassage(props: { children: string }) {
  return (
    <>
      <p className="text-[#d20d0d]">{props.children}</p>
    </>
  );
}
