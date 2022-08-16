import "../styles/globals.css";
import "../auth/firebaseConfig";
import { AuthUserProvider } from "../context/AuthUserContext";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthUserProvider>
      {getLayout(<Component {...pageProps} />)}
    </AuthUserProvider>
  );
}

export default MyApp;
