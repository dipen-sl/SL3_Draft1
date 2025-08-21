import { useEffect, useState } from 'react';
import axios from 'axios';

type TestMeta = { id: string; priority?: number; tags: string[]; };

function App() {
  const [tests, setTests] = useState<TestMeta[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [baseURL, setBaseURL] = useState<string>('');
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:4000/api/tests').then(r => setTests(r.data.tests));
  }, []);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const run = async (mode: 'all' | 'selected' | 'topN') => {
    if (!baseURL) { alert('Enter a base URL'); return; }
    setRunning(true);
    try {
      const payload: any = { mode, baseURL };
      if (mode === 'selected') payload.selectedIds = Array.from(selected);
      if (mode === 'topN') payload.topN = 10;
      const runRes = await axios.post('http://localhost:4000/api/tests/run', payload);
      const repRes = await axios.post('http://localhost:4000/api/reports/materialize', {
        runId: runRes.data.runId,
        baseURL,
        results: runRes.data.results
      });
      setPdfs(repRes.data.pdfs);
    } catch (e: any) {
      alert('Run failed: ' + (e?.message || 'unknown'));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">UI Regression Lab – Phase 1</h1>

      <div className="flex gap-2 items-center mb-4">
        <input className="border px-3 py-2 rounded w-full"
               placeholder="https://yourapp.example.com"
               value={baseURL} onChange={e => setBaseURL(e.target.value)} />
        <button disabled={running} onClick={() => run('all')} className="px-3 py-2 rounded bg-black text-white">Run All</button>
        <button disabled={running} onClick={() => run('selected')} className="px-3 py-2 rounded border">Run Selected</button>
        <button disabled={running} onClick={() => run('topN')} className="px-3 py-2 rounded border">Run Top 10</button>
      </div>

      <div className="border rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Select</th>
              <th className="text-left p-2">Test</th>
              <th className="text-left p-2">Priority</th>
              <th className="text-left p-2">Tags</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">
                  <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} />
                </td>
                <td className="p-2">{t.id}</td>
                <td className="p-2">{t.priority ?? '-'}</td>
                <td className="p-2">{t.tags.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {running && <div className="mt-4">Running…</div>}

      {pdfs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Reports</h2>
          <ul className="list-disc ml-5">
            {pdfs.map((u, i) => (
              <li key={i}><a className="text-blue-600 underline" href={`http://localhost:4000${u}`} target="_blank">{u.split('/').pop()}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;