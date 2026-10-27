import axios from "axios";

/**
 * Axios client para chamadas internas às API Routes do Next.js.
 *
 * SEGURANÇA: Este client NÃO carrega nenhuma chave de API.
 * As chaves do Gemini ficam exclusivamente em variáveis de ambiente server-side
 * (sem prefixo NEXT_PUBLIC_) e são usadas apenas nas API Routes.
 *
 * Qualquer autenticação entre o frontend e o backend próprio deve ser feita
 * por sessão/cookie, nunca expondo secrets no bundle do cliente.
 */
const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
