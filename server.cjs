
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json'); 
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);


const getState = () => router.db.getState();
const setState = (state) => router.db.setState(state).write();


function normalizeIds() {
  const state = getState();
  if (!state.clientes) state.clientes = [];
  let changed = false;

  state.clientes = state.clientes.map((c) => {
    if (c && typeof c.id === 'string' && /^\d+$/.test(c.id)) {
      changed = true;
      return { ...c, id: Number(c.id) };
    }
    return c;
  });

  if (changed) setState(state);
}


function nextId() {
  const state = getState();
  const ids = (state.clientes || [])
    .map((c) => Number(c.id))
    .filter((n) => Number.isInteger(n));
  const max = ids.length ? Math.max(...ids) : 0;
  return max + 1;
}


server.use((req, _res, next) => {
  normalizeIds();
  next();
});


server.post('/clientes', (req, res) => {
  const state = getState();
  const novo = { ...req.body, id: nextId() };
  state.clientes = state.clientes || [];
  state.clientes.push(novo);
  setState(state);
  return res.status(201).json(novo);
});

server.put('/clientes/:id', (req, res) => {
  const state = getState();
  const id = Number(req.params.id);
  const idx = (state.clientes || []).findIndex((c) => Number(c.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Cliente não encontrado' });

  const atualizado = { ...req.body, id };
  state.clientes[idx] = atualizado;
  setState(state);
  return res.json(atualizado);
});


server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ JSON Server (IDs sequenciais) em http://localhost:${PORT}`);
});
