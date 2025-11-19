import useSWR from "swr";
interface fetchPropsType<T = unknown> {
  //anyは許容しない設定にしているためunknownで
  endPoint: string;
  headers?: { "Content-Type": string; Authorization: string | null };
  onSuccess?: (data: T) => void;
}
interface FetchError {
  message: string;
  statusCode?: number;
  errorId?: string;
}
export interface CommonResponseType<T = unknown> {
  //型はジェネリクスで受け取る。初期値はunknown
  data: T | undefined;
  error: FetchError | null;
  isLoading: boolean;
}
// fetcherとuseSWRを一つにまとめたカスタムフックの作成
export const useFetch = <T>(
  props: fetchPropsType<T>
): CommonResponseType<T> => {
  const fetcher = async () => {
    const res = await fetch(props.endPoint);
    if (res.status !== 200) {
      const ErrMsg: { message: string } = await res.json();
      throw new Error(ErrMsg.message);
    }
    const data = await res.json();
    return data;
  };
  const { data, error, isLoading } = useSWR<T>(props.endPoint, fetcher, {
    onSuccess: (data) => {
      props.onSuccess?.(data); //呼び出し先で関数決めれる(これもpropsで渡せる)
    },
  });
  return { data, error, isLoading };
};
