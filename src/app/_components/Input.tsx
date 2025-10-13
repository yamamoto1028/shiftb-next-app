"use client";
type InputProps = React.ComponentProps<"input">;

export default function Input(props: InputProps) {
  return (
    <div className="input-container">
      <input
        {...props}
        className="input-box w-full p-[1rem] border border-[#afb3b7] rounded-[0.5rem]"
      />
    </div>
  );
}
