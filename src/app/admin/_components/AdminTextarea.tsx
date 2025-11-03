type AdminTextareaProps = React.ComponentProps<"textarea">;

export default function AdminTextarea({
  id,
  onChange,
  value,
  disabled,
}: AdminTextareaProps) {
  return (
    <textarea
      id={id}
      onChange={onChange}
      value={value}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border border-gray-200 p-3"
    />
  );
}
