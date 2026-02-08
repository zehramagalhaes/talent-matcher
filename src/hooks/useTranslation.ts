import * as ReactIntl from "react-intl";
import { TranslationKeys } from "@/locales/translations";
import { useAppLocale } from "@/context/IntlContext";

interface IntlHook {
  formatMessage(descriptor: { id: string }, values?: Record<string, unknown>): string;
}

export const useTranslation = () => {
  const { useIntl } = ReactIntl as unknown as { useIntl: () => IntlHook };

  const intl = useIntl();
  const { locale, setLocale } = useAppLocale();

  const t = (id: TranslationKeys, values?: Record<string, unknown>): string => {
    return intl.formatMessage({ id: id as string }, values);
  };

  return {
    t,
    locale,
    setLocale,
    intl,
  };
};
