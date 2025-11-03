type AdminInputProps = React.ComponentProps<"input">;

export default function AdminInput({
  id,
  onChange,
  value,
  disabled,
}: AdminInputProps) {
  //propsは単一のオブジェクトとして受け取る必要がある
  return (
    <input
      id={id}
      type="text"
      onChange={onChange}
      value={value}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border border-gray-200 p-3"
    />
  );
}
