type AdminCreateButtonProps = React.ComponentProps<"button">;

export default function AdminCreateButton({
  disabled,
}: AdminCreateButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      作成
    </button>
  );
}
