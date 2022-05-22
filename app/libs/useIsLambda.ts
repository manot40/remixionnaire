import useMatchesData from "./useMatchesData";

export default function useIsLambda() {
  const data = useMatchesData("root");
  const isLambda = data?.isLambda;
  function linker(path: string) {
    return `${isLambda ? "/_static" : ""}${path}`;
  }
  return {
    isLambda,
    linker,
  };
}
