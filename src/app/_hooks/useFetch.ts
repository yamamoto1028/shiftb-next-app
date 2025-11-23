import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";
interface fetchPropsType {
  endPoint: string;
}

// fetcherとuseSWRを一つにまとめたカスタムフックの作成
export const useFetch = <T>(props: fetchPropsType) => {
  const { token } = useSupabaseSession();

  const fetcher = async (): Promise<T> => {
    const headers: Record<string, string> = {
      //指定した型のプロパティと値のペアなら追加できる型
      "Content-Type": "application/json",
    };
    // tokenがある場合はAuthorizationヘッダーに追加
    if (token) {
      headers.Authorization = token;
    }
    const res = await fetch(props.endPoint, {
      headers,
    });
    if (res.status !== 200) {
      const ErrMsg: { message: string } = await res.json();
      throw new Error(ErrMsg.message);
    }
    const data = await res.json();
    return data;
  };

  return useSWR<T>(props.endPoint, fetcher); //全部返しといて呼び出し側で欲しいもの取る
};
