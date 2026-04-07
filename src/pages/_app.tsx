import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { CustomThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import GlobalToasts from "@/components/common/GlobalToasts";
import { AppIntlProvider } from "@/context/IntlContext";
import { AppProvider } from "@/context/AppContext";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <AppProvider>
    <CustomThemeProvider>
      <AppIntlProvider>
        <CssBaseline />
        <ToastProvider>
          <GlobalToasts />
          <Component {...pageProps} />
        </ToastProvider>
      </AppIntlProvider>
    </CustomThemeProvider>
  </AppProvider>
);

export default MyApp;
