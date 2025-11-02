interface AdminInputProps {
  //propsの型を定義
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; //イベントの型はinputのChangeイベント戻り値はないのでvoid
  value: string;
}

export default function AdminInput({ id, onChange, value }: AdminInputProps) {
  //propsは単一のオブジェクトとして受け取る必要がある
  return (
    <input
      id={id}
      type="text"
      onChange={onChange}
      value={value}
      className="mt-1 block w-full rounded-md border border-gray-200 p-3"
    />
  );
}
