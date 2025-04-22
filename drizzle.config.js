import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_pkwSFbNC8IG3@ep-little-fire-a4snmgpd-pooler.us-east-1.aws.neon.tech/ai-room?sslmode=require',
  },
  dialect:'postgresql',
});
