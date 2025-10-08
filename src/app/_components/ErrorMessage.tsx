"use client";
type ErrorMessageProps = {
  message: string;
};
export default function ErrorMessage(props: ErrorMessageProps) {
  if (!props.message) return null;
  return <p className="text-sm text-red-700">{props.message}</p>;
}
