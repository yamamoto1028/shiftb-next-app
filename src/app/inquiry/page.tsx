"use client";
import { useState } from "react";
import FormItem from "../_components/FormItem";
import Label from "../_components/Label";
import Input from "../_components/Input";
import ErrorMessage from "../_components/ErrorMessage";
import Textarea from "../_components/Textarea";

export default function InquiryPage() {
  // inputの状態管理
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  // エラー状態の管理→状態によって処理分岐したいのはhandleCheckInput関数の中だけなのでコンポーネント全体でstate管理する必要ないので消し結果だけ戻しておけばJSXの表示分岐に使える
  // エラーメッセージの管理
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [textError, setTextError] = useState("");

  // 送信中の状態管理
  const [sending, setSending] = useState(false);

  // 送信ボタン押下でしたいチェック処理-----------------
  const handleCheckInput = () => {
    let isError = false; //関数内では変数で状態を制御して出力時にsetStateに入れる
    let nameErrMessage = "";
    let emailErrMessage = "";
    let textErrMessage = "";
    // 名前の入力有無チェック　→状態管理
    if (!name) {
      nameErrMessage = "お名前は必須です。";
      isError = true;
      // 名前の30文字以内チェック
    } else if (name.length > 30) {
      nameErrMessage = `お名前は30文字以内で入力してください。(現在の文字数：${name.length}文字)`;
      isError = true;
    }
    // アドレスの入力有無チェック　→状態管理
    if (!email) {
      emailErrMessage = "メールアドレスは必須です。";
      isError = true;

      // アドレスのメール形式チェック
    } else if (!email.match(/.+@.+\..+/)) {
      emailErrMessage = "メールアドレスの形式が正しくありません。";
      isError = true;
    }
    // 本文の入力有無チェック　→状態管理
    if (!text) {
      textErrMessage = "本文は必須です。";
      isError = true;

      // 本文の500文字以内チェック
    } else if (text.length > 500) {
      textErrMessage = `本文は500文字以内で入力してください。(現在の文字数：${text.length}文字)`;
      isError = true;
    }
    setNameError(nameErrMessage);
    setEmailError(emailErrMessage);
    setTextError(textErrMessage);
    return isError;
  };

  const handleClearInput = () => {
    setName("");
    setEmail("");
    setText("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //イベント(e)にも型付けしないと赤字怒られる
    try {
      if (sending) return;
      e.preventDefault();
      setSending(true);
      handleCheckInput(); //入力内容チェックしエラーMSGをセット
      if (handleCheckInput()) {
        alert("入力内容に誤りがあります");
        return;
      }
      // 送信処理
      await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name, email: email, text: text }), //送信データをオブジェクト形式で渡す
        }
      );
      alert("送信しました");
      handleClearInput();
    } catch (error) {
      console.log(`送信中にエラーが発生しました`, error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <main className="inquiry-page max-w-[800px] m-auto py-[2.5rem]">
        <h1 className="title font-[700] text-[1.25rem]">問合わせフォーム</h1>
        <form
          onSubmit={handleSubmit}
          action="https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts"
          method="post"
          className="inquiry-form mt-[2.5rem]"
        >
          <FormItem>
            <Label htmlFor="name">お名前</Label>
            <div className="input-wrapper w-full">
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={sending}
                autoComplete="off"
                // maxLength={30}
              />
              <ErrorMessage message={nameError} />
            </div>
          </FormItem>
          <FormItem>
            <Label htmlFor="email">メールアドレス</Label>
            <div className="input-wrapper w-full">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sending}
                autoComplete="off"
              />
              <ErrorMessage message={emailError} />
            </div>
          </FormItem>
          <FormItem>
            <Label htmlFor="message">本文</Label>
            <div className="input-wrapper w-full">
              <Textarea
                id="message"
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={sending}
                autoComplete="off"
                // maxLength={500}
              />
              <ErrorMessage message={textError} />
            </div>
          </FormItem>
          <div className="button-box flex justify-center mt-[40px]">
            <button
              className="send-button text-[#fff] text-[16px] font-[900] rounded-[0.5rem] bg-[#020202] py-[8px] px-[16px]"
              type="submit"
              disabled={sending}
            >
              送信
            </button>
            <button
              className="clear-button bg-[#e7e5e5] font-[900] rounded-[0.5rem] border border-[#e7e5e5] ml-[16px] py-[8px] px-[16px]"
              type="reset"
              disabled={sending}
              onClick={handleClearInput}
            >
              クリア
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
