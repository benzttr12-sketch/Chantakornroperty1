import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

// Static production build. Firebase public configuration are provided by the deployment environment.
const env = {
  ...process.env,
  STATIC_EXPORT: 'true',
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  env, stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
writeFileSync('out/.nojekyll', '');
