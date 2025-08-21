import fs from 'fs';
import path from 'path';

export type TestMeta = {
  id: string;
  filePath: string;
  priority?: number;
  tags: string[];
  displayName: string;
};

const TESTS_DIR = path.join(process.cwd(), 'tests');

export function discoverTests(): TestMeta[] {
  const files = walk(TESTS_DIR).filter(f => f.endsWith('.ts'));
  return files.map(filePath => {
    const id = path.relative(TESTS_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const displayName = id;

    // Metadata from header comment: @priority N  and  @tags a,b,c
    const header = content.slice(0, 500);
    const prMatch = header.match(/@priority\s+(\d+)/i);
    const tagsMatch = header.match(/@tags\s+([^\n\r]+)/i);

    const priority = prMatch ? Number(prMatch[1]) : undefined;
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];

    return { id, filePath, priority, tags, displayName };
  });
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap(name => {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    return stat.isDirectory() ? walk(p) : [p];
  });
}
