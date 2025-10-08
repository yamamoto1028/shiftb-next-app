"use client";
type TextareaProps = React.ComponentProps<"textarea">;

export default function Textarea(props: TextareaProps) {
  return (
    <div className="input-box w-full">
      <textarea
        {...props}
        className="text-box resize-none auto-cols-[8] w-full p-4 border border-gray-300 rounded-lg"
      />
    </div>
  );
}
