import Select, { ActionMeta, MultiValue } from "react-select";
import AdminErrorMassage from "./AdminErrorMassage";
import AdminHeaderListPageDetails from "./AdminHeaderListPageDetails";
import AdminInput from "./AdminInput";
import AdminLabel from "./AdminLabel";
import AdminTextarea from "./AdminTextarea";
import Image from "next/image";
import { useRef } from "react";

interface OptionType {
  value: number;
  label: string;
}
interface AdminPostFormProps {
  title: string;
  titleValue: string;
  titleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  titleDisabled: boolean;
  errMsgTitle: string;
  contentValue: string;
  contentOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  contentDisabled: boolean;
  errMsgContent: string;
  thumbnailUrlValue: string | null; //
  thumnailUrlOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  thumbnailUrlDisabled: boolean;
  errMsgThumbnail: string;
  categoryOptions: OptionType[];
  categoryValue: OptionType[];
  categoryOnChange: (
    newValue: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  categoryIsDisabled: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: JSX.Element;
}

export default function AdminPostForm(props: AdminPostFormProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleClickFile = () => {
    console.log(`handleClickFile is clicked!!`);
    fileRef.current?.click();
  };
  return (
    <div className="home-container p-4 w-[95%]">
      <form onSubmit={props.onSubmit} method="post">
        <div className="mt-4 px-4">
          <AdminHeaderListPageDetails title={props.title} />
          <div className="flex flex-col">
            <AdminLabel htmlFor="title">タイトル</AdminLabel>
            <AdminInput
              id="title"
              type="text"
              value={props.titleValue}
              onChange={props.titleOnChange}
              disabled={props.titleDisabled}
              className="mt-1 block w-full rounded-md border border-gray-200 p-3"
            />
            {props.errMsgTitle ? (
              <AdminErrorMassage>{props.errMsgTitle}</AdminErrorMassage>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <AdminLabel htmlFor="content">内容</AdminLabel>
            <AdminTextarea
              id="content"
              value={props.contentValue}
              onChange={props.contentOnChange}
              disabled={props.contentDisabled}
            />
            {props.errMsgContent ? (
              <AdminErrorMassage>{props.errMsgContent}</AdminErrorMassage>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <AdminLabel htmlFor="thumbnailImageKey">サムネイルURL</AdminLabel>
            {/*useRefで参照を取得するinput要素をhiddenにして、代わりにdiv要素でファイル登録ボタンをカスタマイズ */}
            <div className="mt-1 block w-full">
              <div
                role="button"
                tabIndex={0}
                onClick={handleClickFile}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClickFile();
                  }
                }}
                className="mt-1 block w-[180px] rounded-md border border-gray-200 p-3"
              >
                ファイルを選択する
              </div>
              <div className="mt-5">
                選択中のファイル：{props.thumbnailUrlValue}
              </div>
            </div>
            {/* カスタマイズおわり */}
            <AdminInput
              ref={fileRef}
              id="thumbnailImageKey"
              type="file"
              accept="image/*"
              onChange={props.thumnailUrlOnChange}
              disabled={props.thumbnailUrlDisabled}
              className="hidden"
            />
            <div className="mt-2">
              {props.thumbnailUrlValue && (
                <Image
                  src={props.thumbnailUrlValue}
                  alt="thumbnail"
                  width={400}
                  height={400}
                />
              )}
            </div>
            {props.errMsgThumbnail ? (
              <AdminErrorMassage>{props.errMsgThumbnail}</AdminErrorMassage>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <AdminLabel htmlFor="postCategories">カテゴリー</AdminLabel>
            <Select
              inputId="postCategories"
              aria-label="カテゴリーを選択"
              options={props.categoryOptions}
              value={props.categoryValue}
              onChange={props.categoryOnChange}
              isDisabled={props.categoryIsDisabled} //送信中は非活性
              isClearable={false} //セレクトボックス最右の×ボタン非表示
              closeMenuOnSelect={false} //選択してもメニューを閉じない
              hideSelectedOptions={false} //選択済みのオプションもメニューに表示
              isMulti
              placeholder="カテゴリーを選択"
              styles={{
                control: (base) => ({
                  //「base」はデフォルトのスタイル設定で、スプレット構文で適用する。指定は任意。
                  ...base,
                  minHeight: "70px",
                  height: "70px",
                }),
                multiValue: () => ({
                  backgroundColor: "#dbeafe",
                  borderRadius: "25px",
                  padding: "12px",
                  margin: "2px",
                }), // Selectコンポーネントは「react-select」が独自のタグのセットを返しているためこの指定で適用される
                multiValueLabel: () => ({
                  fontSize: "16px",
                  padding: 0,
                }),
                option: (base, { isSelected }) => ({
                  // ドロップダウンメニュー内の各項目のスタイル設定→「option:」で指定できる(isSelectedは選択されているかの真偽値が入ってる)
                  ...base,
                  backgroundColor: isSelected //三項演算子でスタイル指定/背景色
                    ? "#818cf8"
                    : base.backgroundColor,
                  color: isSelected ? "#fff" : base.color, //文字色
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: isSelected ? "#818cf8" : "#e0e7ff",
                    transition: "background-color 0.5s ease", // ホバー時だけアニメーション
                  },
                }),
              }}
              components={{
                IndicatorSeparator: () => null, // 右側にあるセパレーターを非表示
                MultiValueRemove: () => null, // 選択済みカテゴリー個別の×ボタンを非表示
              }}
            />
          </div>
          {props.children}
        </div>
      </form>
    </div>
  );
}
