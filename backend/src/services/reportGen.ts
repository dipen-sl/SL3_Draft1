import ejs from 'ejs';
import path from 'path';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';

type TestReportInput = {
  runId: string;
  baseURL: string;
  test: {
    title: string;
    status: 'passed' | 'failed' | 'skipped' | 'unknown';
    duration: number;
    file: string;
    tags?: string[];
    error?: string;
  };
  screenshots: string[];
  projectName?: string;
};

export async function generatePdfPerTest(input: TestReportInput) {
  const tplPath = path.join(process.cwd(), 'templates', 'test-report.ejs');
  const html = await ejs.renderFile(tplPath, { ...input, projectName: input.projectName ?? 'UI Regression Lab' });

  const outDir = path.join(process.cwd(), 'reports', input.runId);
  await fs.ensureDir(outDir);

  const safeTitle = input.test.title.replace(/[^\w\d\-_.]+/g, '_').slice(0, 100);
  const pdfPath = path.join(outDir, `${safeTitle}.pdf`);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();

  return pdfPath;
}
