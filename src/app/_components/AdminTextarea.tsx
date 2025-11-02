interface AdminTextareaProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; //イベントの型はテキストエリアのChangeイベント戻り値はないのでvoid
  value: string;
}
export default function AdminTextarea({
  id,
  onChange,
  value,
}: AdminTextareaProps) {
  return (
    <textarea
      id={id}
      onChange={onChange}
      value={value}
      className="mt-1 block w-full rounded-md border border-gray-200 p-3"
    />
  );
}
