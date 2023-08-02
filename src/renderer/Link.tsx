import { usePageContext } from "./usePageContext";

export const Link = function (props: any) {
  const pageContext = usePageContext();
  const className = [
    props.className,
    pageContext.urlPathname === props.href && "is-active",
  ]
    .filter(Boolean)
    .join(" ");
  return <a {...props} className={className} />;
};
