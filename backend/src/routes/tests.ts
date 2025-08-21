import { Router } from 'express';
import { discoverTests } from '../services/testDiscovery';
import { runTests } from '../services/runner';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ tests: discoverTests() });
});

// body: { mode: 'all'|'selected'|'topN', selectedIds?: string[], topN?: number, baseURL: string }
router.post('/run', async (req, res) => {
  const { mode, selectedIds, topN, baseURL } = req.body || {};
  try {
    const result = await runTests({ mode, selectedIds, topN, baseURL });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Run failed' });
  }
});

export default router;