import React, { createContext, useContext, useState, ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { messages, Locale } from "@/locales/messages";

interface IntlContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

const TypedIntlProvider = IntlProvider as unknown as React.FC<
  React.ComponentProps<typeof IntlProvider> & { children: ReactNode }
>;

export const AppIntlProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  const currentMessages = (messages[locale] || messages.en) as Record<string, string>;

  return (
    <IntlContext.Provider value={{ locale, setLocale }}>
      <TypedIntlProvider key={locale} locale={locale} messages={currentMessages} defaultLocale="en">
        {children}
      </TypedIntlProvider>
    </IntlContext.Provider>
  );
};

export const useAppLocale = () => {
  const context = useContext(IntlContext);
  if (!context) throw new Error("useAppLocale must be used within AppIntlProvider");
  return context;
};
