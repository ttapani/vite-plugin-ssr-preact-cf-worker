// `usePageContext` allows us to access `pageContext` in any React component.
// More infos: https://vite-plugin-ssr.com/pageContext-anywhere

import { createContext } from "preact";
import { useContext } from "preact/hooks";

const Context = createContext<{ urlPathname?: string }>({});

// TODO: Figure out a better type
export const PageContextProvider = function ({ pageContext, children }: any) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>;
};

export function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
