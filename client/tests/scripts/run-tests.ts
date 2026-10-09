/// <reference types="node" />
/**
 * Cross-platform E2E test runner.
 * Works on Windows, macOS, and Linux.
 *
 * Usage:
 *   npx tsx tests/scripts/run-tests.ts install   - Create venv, install deps, playwright
 *   npx tsx tests/scripts/run-tests.ts run       - Run pytest (local)
 *   npx tsx tests/scripts/run-tests.ts run --headed - Run with visible browser (non-headless)
 *   npx tsx tests/scripts/run-tests.ts run --qa  - Run pytest against QA URLs
 *
 * QA mode loads server/.env.qa (without overriding variables already set, so CI wins),
 * derives BASE_URL / API_BASE_URL from DOMAIN_NAME when missing, and requires
 * BASIC_AUTH_PASSWORD for the WAF nonprod-gate (username = DOMAIN_NAME, /api/ not gated).
 */
import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const isWin = process.platform === 'win32';
const VENV_BIN = path.join(ROOT, '.venv', isWin ? 'Scripts' : 'bin');
const PYTHON = path.join(VENV_BIN, isWin ? 'python.exe' : 'python');
const PIP = path.join(VENV_BIN, isWin ? 'pip.exe' : 'pip');
const QA_ENV_FILE = path.resolve(ROOT, '..', 'server', '.env.qa');

function envValue(name: string): string {
  return process.env[name]?.trim() ?? '';
}

function run(cmd: string, args: string[], opts?: { cwd?: string; env?: NodeJS.ProcessEnv }) {
  const cwd = opts?.cwd ?? ROOT;
  const env = { ...process.env, ...opts?.env };
  const result = spawnSync(cmd, args, { cwd, env, stdio: 'inherit', shell: false });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function resolvePython(): string {
  try {
    execSync('python3 --version', { stdio: 'pipe' });
    return 'python3';
  } catch {
    return 'python';
  }
}

function cmdInstall(): void {
  const py = resolvePython();
  const venvPath = path.join(ROOT, '.venv');

  if (!fs.existsSync(venvPath)) {
    console.log('Creating .venv...');
    run(py, ['-m', 'venv', venvPath]);
  }

  console.log('Installing test dependencies...');
  run(PIP, ['install', '-r', 'requirements-test.txt']);

  console.log('Installing Playwright Chromium...');
  run(path.join(VENV_BIN, isWin ? 'playwright.cmd' : 'playwright'), [
    'install',
    '--with-deps',
    'chromium',
  ]);
}

function cmdRun(): void {
  const qa = process.argv.includes('--qa');
  const headed = process.argv.includes('--headed');

  let baseUrl: string;
  let apiBaseUrl: string;
  const gateEnv: NodeJS.ProcessEnv = {};

  if (qa) {
    if (fs.existsSync(QA_ENV_FILE)) {
      process.loadEnvFile(QA_ENV_FILE);
    }
    const domainName = envValue('DOMAIN_NAME');
    baseUrl = envValue('BASE_URL');
    apiBaseUrl = envValue('API_BASE_URL');
    if (baseUrl === '' && domainName !== '') {
      baseUrl = `https://${domainName}`;
    }
    if (apiBaseUrl === '' && domainName !== '') {
      apiBaseUrl = `https://${domainName}/api`;
    }
    if (baseUrl === '' || apiBaseUrl === '') {
      console.error('QA mode requires BASE_URL and API_BASE_URL (or DOMAIN_NAME to derive them).');
      console.error('Set them in server/.env.qa locally; CI sets them from the qa environment.');
      process.exit(1);
    }
    const basicAuthPassword = envValue('BASIC_AUTH_PASSWORD');
    if (basicAuthPassword === '') {
      console.error(
        'QA mode requires BASIC_AUTH_PASSWORD (WAF nonprod-gate, username = DOMAIN_NAME).',
      );
      console.error('Set it in server/.env.qa locally; CI reads the qa environment secret.');
      process.exit(1);
    }
    gateEnv['BASIC_AUTH_PASSWORD'] = basicAuthPassword;
  } else {
    baseUrl = 'http://localhost:5173';
    apiBaseUrl = 'http://localhost:3000/api';
  }

  if (!fs.existsSync(PYTHON)) {
    console.error("Run 'npm run test:install' first to create .venv and install deps.");
    process.exit(1);
  }

  const args = [
    '-m',
    'pytest',
    'tests/e2e',
    '-v',
    '--browser',
    'chromium',
    '--base-url',
    baseUrl,
    '--html=artifacts/report.html',
    '--self-contained-html',
  ];

  if (headed) {
    args.push('--headed');
  }

  const errorsDir = path.join(ROOT, 'artifacts', 'errors');
  if (fs.existsSync(errorsDir)) {
    fs.rmSync(errorsDir, { recursive: true });
  }
  fs.mkdirSync(errorsDir, { recursive: true });

  run(PYTHON, args, {
    env: {
      ...process.env,
      BASE_URL: baseUrl,
      API_BASE_URL: apiBaseUrl,
      ...gateEnv,
    },
  });
}

const sub = process.argv[2];
if (sub === 'install') {
  cmdInstall();
} else if (sub === 'run') {
  cmdRun();
} else {
  console.error('Usage: npx tsx tests/scripts/run-tests.ts <install|run> [--headed] [--qa]');
  process.exit(1);
}
