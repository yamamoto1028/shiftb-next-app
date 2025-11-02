import Select from "react-select";
import { AdminHeaderListPageDetails } from "@/app/_components/AdminHeaderListPageDetails";

export default function AdminSelect(){
          <Select<OptionType, true>
              inputId="postCategories"
              aria-label="カテゴリーを選択"
              options={apiCategories}
              value={postCategories}
              onChange={(selected) => {
                setPostCategories(selected as OptionType[]);
              }}
              isClearable={false} //セレクトボックス最右の×ボタン非表示
              closeMenuOnSelect={false} //選択してもメニューを閉じない
              hideSelectedOptions={false} //選択済みのオプションもメニューに表示
              isMulti
              placeholder="カテゴリーを選択"
              classNames={{
                control: () =>
                  "min-h-[70px] mt-1 p-[10px] block w-full rounded-md", // Selectコンポーネントは「react-select」が独自のタグのセットを返しているためTailwindならこの指定で適用される
              }}
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
                  padding: "10px",
                  margin: "2px",
                }), // Selectコンポーネントは「react-select」が独自のタグのセットを返しているためこの指定で適用される
                multiValueLabel: () => ({
                  fontSize: "16px",
                  // padding: 0,
                }),
                option: (base, { isSelected }) => ({
                  // ドロップダウンメニュー内の各項目のスタイル設定→「option:」で指定できる(isSelectedは選択されているかの真偽値が入ってる)
                  ...base,
                  // "$:transition": { backgroundColor: "3s" },
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
                />
              
            }