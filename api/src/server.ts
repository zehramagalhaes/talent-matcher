import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../generated/routes';

// Load environment variables
const rootEnvPath = path.resolve(__dirname, '../../.env.local');
const rootEnvFallback = path.resolve(__dirname, '../../.env');
const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : rootEnvFallback;
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 3001;
const app = express();
const enableApiDocs = process.env.NODE_ENV === 'development' && process.env.API_DOCS !== 'false';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

if (enableApiDocs) {
  const swaggerFile = fs.readFileSync(path.join(__dirname, '../generated/swagger.json'), 'utf-8');
  const swaggerSpec = JSON.parse(swaggerFile);

  app.get('/swagger.json', (req: Request, res: Response) => res.json(swaggerSpec));
  app.get('/api-docs/swagger.json', (req: Request, res: Response) => res.json(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('API docs available at http://localhost:' + PORT + '/api-docs');
} else {
  console.log('API docs disabled for this environment');
}

// Debug middleware to log requests
interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
}

const requestLogs: RequestLog[] = [];

app.use((req: Request, res: Response, next: NextFunction) => {
  const log = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers,
  };
  requestLogs.push(log);
  // Keep only last 100 logs
  if (requestLogs.length > 100) requestLogs.shift();
  next();
});

// Register tsoa-generated routes
RegisterRoutes(app);

// Debug endpoint
app.get('/debug', (req: Request, res: Response) => {
  res.json({
    message: 'Recent API requests',
    logs: requestLogs.slice(-20), // Last 20 requests
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export app for testing
export default app;

// Start server only if this is the main module
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TalentMatcher API server running on port ${PORT}`);
    if (enableApiDocs) {
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    } else {
      console.log('API docs disabled in this environment');
    }
    console.log(`Debug view available at http://localhost:${PORT}/debug`);
  });
}
