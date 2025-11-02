interface AdminCreateButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
export default function AdminCreateButton({ onClick }: AdminCreateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      作成
    </button>
  );
}
