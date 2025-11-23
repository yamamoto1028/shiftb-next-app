"use client";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      //初期値を設定しておくことでリアルタイムで入力値を監視可能
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  console.log(errors);

  return (
    <div className="flex justify-center pt-[240px]">
      <form
        onSubmit={handleSubmit(async (data) => {
          const { email, password } = data; //handleSubmitのコールバック関数の引数"data"にはinputに入力した値がオブジェクト形式で入ってるので分割代入で取り出す。
          const { error } = await supabase.auth.signInWithPassword({
            //取り出した入力情報を使ってサインインメソッド実行。(errorが入ってれば分割代入で取り出す)
            email,
            password,
          });
          if (error) {
            alert(`ログインに失敗しました`);
            console.log("ログイン失敗", error);
          } else {
            console.log("ログイン成功", email);
            router.replace("/admin/posts");
          }
        })}
        className="space-y-4 w-full max-w-[400px]"
      >
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            {...register("email", { required: "メールアドレスは必須です。" })}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
          />
          <p className="text-red-600">{errors.email?.message}</p>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            {...register("password", { required: "パスワードは必須です。" })}
            type="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <p className="text-red-600">{errors.password?.message}</p>
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            ログイン
          </button>
          <Link href={"/signup"}>
            <button className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-16 text-center">
              サインアップ（アカウントをお持ちでない方）
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
