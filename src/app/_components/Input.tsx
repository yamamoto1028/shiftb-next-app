"use client";
type InputProps = React.ComponentProps<"input">;

export default function Input(props: InputProps) {
  return (
    <div className="input-container">
      <input
        {...props}
        className="input-box w-full p-4 border border-gray-300 rounded-lg"
      />
    </div>
  );
}
