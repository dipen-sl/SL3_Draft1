import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { discoverTests, TestMeta } from './testDiscovery';
import dayjs from 'dayjs';

type RunRequest = {
  mode: 'all' | 'selected' | 'topN';
  selectedIds?: string[];
  topN?: number;
  baseURL: string;
};

export async function runTests(req: RunRequest) {
  const all = discoverTests();
  const chosen = chooseTests(all, req);
  if (chosen.length === 0) throw new Error('No tests selected');

  const runId = `run-${dayjs().format('YYYYMMDD-HHmmss')}`;
  const artifactsDir = path.join(process.cwd(), 'artifacts', runId);
  fs.mkdirSync(artifactsDir, { recursive: true });

  const testArgs = chosen.map(t => t.filePath);
  const env = { ...process.env, BASE_URL: req.baseURL };

  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const args = ['playwright', 'test', ...testArgs, '--reporter=json', `--output=${artifactsDir}`];

  const child = spawn(cmd, args, { env });
  let out = '';
  let err = '';
  child.stdout.on('data', (d) => { out += d.toString(); });
  child.stderr.on('data', (d) => { err += d.toString(); });

  const code: number = await new Promise((resolve) => child.on('close', resolve));

  let results: any = {};
  try { results = JSON.parse(out); } catch {
    results = { parseError: true, rawStdout: out, rawStderr: err };
  }

  return { runId, exitCode: code, artifactsDir, results, selected: chosen.map(c => c.id) };
}

function chooseTests(all: TestMeta[], req: RunRequest): TestMeta[] {
  if (req.mode === 'all') return all;
  if (req.mode === 'selected') {
    const set = new Set(req.selectedIds || []);
    return all.filter(t => set.has(t.id));
  }
  if (req.mode === 'topN') {
    const N = req.topN || 10;
    const sorted = [...all].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
    return sorted.slice(0, N);
  }
  return [];
}