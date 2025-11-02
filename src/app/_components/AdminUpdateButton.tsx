interface AdminUpdateButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export default function AdminUpdateButton({ onClick }: AdminUpdateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      更新
    </button>
  );
}
