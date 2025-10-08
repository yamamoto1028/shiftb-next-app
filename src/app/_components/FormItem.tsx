"use client";
export default function FormItem(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return (
    <div className="form-contents flex justify-between w-[100%] items-center mt-6">
      {props.children}
    </div>
  );
}
