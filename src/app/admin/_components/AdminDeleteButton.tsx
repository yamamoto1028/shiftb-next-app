type AdminDeleteButtonProps = React.ComponentProps<"button">;

export default function AdminDeleteButton({
  onClick,
  disabled,
}: AdminDeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
    >
      削除
    </button>
  );
}
