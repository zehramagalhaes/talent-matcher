import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { CustomThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import GlobalToasts from "../components/GlobalToasts";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <CustomThemeProvider>
    <CssBaseline />
    <ToastProvider>
      <GlobalToasts />
      <Component {...pageProps} />
    </ToastProvider>
  </CustomThemeProvider>
);

export default MyApp;
