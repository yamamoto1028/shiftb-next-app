export default function AdminLabel(props: {
  children: string;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={props.htmlFor}
      className="block text-sm font-medium text-gray-700 mt-5"
    >
      {props.children}
    </label>
  );
}
