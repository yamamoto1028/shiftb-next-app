"use client";
type LabelProps = React.ComponentProps<"label">;

export default function Label(props: LabelProps) {
  return (
    <label className="name-tag w-[240px]" {...props}>
      {props.children}
    </label>
  );
}
