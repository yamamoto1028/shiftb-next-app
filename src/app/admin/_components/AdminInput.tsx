import { forwardRef } from "react";

type AdminInputProps = React.ComponentProps<"input">;

// forwardRefを使用してrefを転送可能にする
// 親コンポーネント(AdminPostForm)から渡されたrefを内部のinput要素に接続する
const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ id, type, onChange, value, disabled, className }, ref) => {
    //propsは単一のオブジェクトとして受け取る必要がある
    return (
      <input
        // refを転送して、親から直接DOM要素にアクセス可能にする
        // これにより、親のhandleClickFile()から.click()メソッドを呼び出せる
        ref={ref}
        id={id}
        type={type}
        onChange={onChange}
        value={value}
        disabled={disabled}
        className={className}
      />
    );
  }
);
AdminInput.displayName = "AdminInput";

export default AdminInput;
