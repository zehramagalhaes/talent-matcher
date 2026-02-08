import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { CustomThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import GlobalToasts from "@/components/common/GlobalToasts";
import { AppIntlProvider } from "@/context/IntlContext";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <CustomThemeProvider>
    <AppIntlProvider>
      <CssBaseline />
      <ToastProvider>
        <GlobalToasts />
        <Component {...pageProps} />
      </ToastProvider>
    </AppIntlProvider>
  </CustomThemeProvider>
);

export default MyApp;
