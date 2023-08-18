import Layout from "@/components/layout";
import "@/styles/globals.css";
Layout;
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
