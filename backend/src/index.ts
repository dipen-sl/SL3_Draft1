import express from 'express';
import cors from 'cors';
import path from 'path';
import testsRouter from './routes/tests';
import reportsRouter from './routes/reports';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tests', testsRouter);
app.use('/api/reports', reportsRouter);

// Serve generated PDFs statically
app.use('/static/reports', express.static(path.join(__dirname, '..', 'reports')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
