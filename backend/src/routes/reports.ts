import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { generatePdfPerTest } from '../services/reportGen';

const router = Router();

// POST /api/reports/materialize  { runId, baseURL, results }
router.post('/materialize', async (req, res) => {
  const { runId, baseURL, results } = req.body || {};
  try {
    const pdfs: string[] = [];
    const suites = results?.suites || [];

    const allTests: any[] = [];
    walkSuites(suites, allTests);

    for (const t of allTests) {
      const testTitle = t.titlePath?.join(' › ') || t.title || 'Untitled';
      const duration = t.results?.[0]?.duration || 0;
      const status = (t.outcome || t.status || 'unknown') as any;
      const file = t.location?.file || 'unknown';

      const artDir = path.join(process.cwd(), 'artifacts', runId);
      const screenshots = findScreenshots(artDir);

      const error = t.errors?.[0]?.message || t.results?.[0]?.error?.message;

      const pdfPath = await generatePdfPerTest({
        runId, baseURL,
        test: { title: testTitle, duration, status, file, error },
        screenshots
      });

      const rel = path.relative(path.join(process.cwd(), 'reports'), pdfPath).replace(/\\/g, '/');
      pdfs.push(`/static/reports/${rel}`);
    }

    res.json({ pdfs });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'PDF generation failed' });
  }
});

export default router;

function walkSuites(suites: any[], out: any[]) {
  for (const s of suites) {
    if (s.specs) {
      for (const sp of s.specs) {
        for (const t of (sp.tests || [])) out.push(t);
      }
    }
    if (s.suites) walkSuites(s.suites, out);
  }
}

function findScreenshots(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const hits: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) hits.push(...findScreenshots(p));
    else if (/\.(png|jpg|jpeg)$/i.test(name)) hits.push(p);
  }
  return hits;
}