"use client";
type ErrorMessageProps = {
  message: string;
};
export default function ErrorMessage(props: ErrorMessageProps) {
  if (!props.message) return null;
  return <p className="text-[14px] text-[#bb1010]">{props.message}</p>;
}
