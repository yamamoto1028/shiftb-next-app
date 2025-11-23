import AdminHeaderListPageDetails from "./AdminHeaderListPageDetails";
import AdminInput from "./AdminInput";
import AdminLabel from "./AdminLabel";

interface AdminCategoryFormProps {
  title: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  disabled: boolean;
  className: string;
  children: JSX.Element;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}

export default function AdminCategoryForm(props: AdminCategoryFormProps) {
  return (
    <div className="home-container p-4 px-[1rem] w-[95%]">
      <div className="px-4">
        <AdminHeaderListPageDetails title={props.title} />
        <form onSubmit={props.onSubmit} method="POST" className="mt-3">
          <div className="flex flex-col">
            <AdminLabel htmlFor="categiryName">{props.label}</AdminLabel>
            <AdminInput
              id="categiryName"
              onChange={props.onChange}
              value={props.value}
              disabled={props.disabled}
              className={props.className}
            />
          </div>
          <div>{props.children}</div>
        </form>
      </div>
    </div>
  );
}
