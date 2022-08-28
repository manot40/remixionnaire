export function replaceUrlParam(
  paramName: string,
  paramValue?: string
) {
  if (!paramValue) paramValue = "";

  let url = document.URL;
  const pattern = new RegExp("\\b(" + paramName + "=).*?(&|#|$)");

  if (url.search(pattern) >= 0) {
    document.location.replace(url.replace(pattern, "$1" + paramValue + "$2"));
  } else {
    url = url.replace(/[?#]$/, "");
    document.location.replace(
      url + (url.indexOf("?") > 0 ? "&" : "?") + paramName + "=" + paramValue
    );
  }
}
