type AdminLabelProps = React.ComponentProps<"label">;

export default function AdminLabel({ htmlFor, children }: AdminLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mt-5"
    >
      {children}
    </label>
  );
}
