"use client";
type TextareaProps = React.ComponentProps<"textarea">;

export default function Textarea(props: TextareaProps) {
  return (
    <div className="input-box w-full">
      <textarea
        {...props}
        className="text-box auto-cols-[8] h-[226px] w-full p-[1rem] border border-[#afb3b7] rounded-[0.5rem]"
      />
    </div>
  );
}
