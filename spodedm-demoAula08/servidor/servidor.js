// Servidor de testes - SPODEDM. Uso: node servidor.js
// Variáveis: FALHA=0.3 (30% de erros 503), ATRASO=800 (ms), COMPRIMIR=1 (gzip)
const express = require('express');
const compression = require('compression');
const app = express();
const FALHA = Number(process.env.FALHA || 0);
const ATRASO = Number(process.env.ATRASO || 0);
app.use(express.json());
if (process.env.COMPRIMIR === '1') app.use(compression());

app.use((req, res, next) => {
  setTimeout(() => {
    if (Math.random() < FALHA) return res.status(503).json({ erro: 'falha simulada' });
    next();
  }, ATRASO);
});

// --- endpoints de demonstração (aula 1) ---
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/lento', (req, res) => setTimeout(() => res.json({ ok: true }), Number(req.query.ms || 5000)));
app.get('/erro/:codigo', (req, res) => res.sendStatus(Number(req.params.codigo)));

let seq = 3;
const agora = () => new Date().toISOString();
const tarefas = [1, 2, 3].map(id => ({
  id: String(id), titulo: `Tarefa ${id}`, concluida: false,
  versao: 1, excluido: false, atualizadoEm: agora(),
}));
const chaves = new Map(); // Idempotency-Key -> tarefa criada

app.get('/tarefas', (req, res) => {
  const since = req.query.since || '';
  const itens = tarefas.filter(t => t.atualizadoEm > since);
  res.json({ itens, agora: agora() });
});

app.post('/tarefas', (req, res) => {
  const chave = req.get('Idempotency-Key');
  if (chave && chaves.has(chave)) return res.status(200).json(chaves.get(chave));
  const t = { id: String(++seq), titulo: req.body.titulo || '', concluida: false,
              versao: 1, excluido: false, atualizadoEm: agora() };
  tarefas.push(t);
  if (chave) chaves.set(chave, t);
  res.status(201).json(t);
});

app.put('/tarefas/:id', (req, res) => {
  const t = tarefas.find(x => x.id === req.params.id);
  if (!t) return res.sendStatus(404);
  if (req.body.versao !== t.versao) return res.status(409).json(t);
  Object.assign(t, { titulo: req.body.titulo ?? t.titulo,
    concluida: req.body.concluida ?? t.concluida, versao: t.versao + 1, atualizadoEm: agora() });
  res.json(t);
});

app.delete('/tarefas/:id', (req, res) => {
  const t = tarefas.find(x => x.id === req.params.id);
  if (!t) return res.sendStatus(404);
  Object.assign(t, { excluido: true, versao: t.versao + 1, atualizadoEm: agora() });
  res.sendStatus(204);
});

const produtos = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1, nome: `Produto ${i + 1}`, preco: 10 + i,
  descricao: 'Descrição longa do produto. '.repeat(12),
  especificacoes: 'Especificação técnica detalhada. '.repeat(8),
  imagem: `https://exemplo.com/produtos/${i + 1}.jpg`,
}));

app.get('/produtos', (req, res) => {
  let lista = produtos;
  if (req.query.pagina) {
    const lim = Number(req.query.limite || 20);
    const ini = (Number(req.query.pagina) - 1) * lim;
    lista = produtos.slice(ini, ini + lim);
  }
  if (req.query.campos) {
    const cs = req.query.campos.split(',');
    lista = lista.map(p => Object.fromEntries(cs.map(c => [c, p[c]])));
  }
  res.json({ itens: lista });
});

app.listen(3000, () => console.log('Servidor em http://0.0.0.0:3000'));
