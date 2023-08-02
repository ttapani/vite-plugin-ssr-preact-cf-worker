import styles from "./about.module.css";

export function Page() {
  return (
    <>
      <h1>About</h1>
      <p>
        Demo using <code className={styles.code}>vite-plugin-ssr</code>.
      </p>
    </>
  );
}
