import fs from 'fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/utils/getRedirectUrl.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const moduleURL = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(outputText);
const { getRedirectUrl } = await import(moduleURL);

const sampleNoti = {
  id: 1,
  type: 'TODO',
  content: '',
  createdAt: '',
  read: false,
  targetDate: '2024-05-01',
};

const url = getRedirectUrl(sampleNoti);
console.log(url);
if (url !== '/todos?date=2024-05-01') {
  throw new Error(`Unexpected URL: ${url}`);
}