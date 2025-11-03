type AdminHeaderListPageDetailsProps = React.ComponentProps<"h1">;

export default function AdminHeaderListPageDetails(
  children: AdminHeaderListPageDetailsProps
) {
  return (
    <>
      <h1 className="text-2xl font-bold">{children.title}</h1>
    </>
  );
}
