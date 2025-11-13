"use client";
import { supabase } from "@/utils/supabase"; // 前の工程で作成したファイル
import { useForm } from "react-hook-form";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  console.log(errors);

  return (
    <div className="flex justify-center pt-[240px]">
      <form
        onSubmit={handleSubmit(async (data) => {
          const { email, password } = data;
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `http://localhost:3000/login`,
            },
          });
          if (error) {
            alert("登録に失敗しました");
          } else {
            alert("確認メールを送信しました。");
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
            {...register("password", {
              required: "パスワードは必須です。",
              minLength: { value: 6, message: "パスワードは6桁以上です。" },
            })}
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
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
