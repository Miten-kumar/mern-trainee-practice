// kept in memory for this project so there's nothing extra to install
// or configure - resets every time the server restarts. Swapping this
// for a real database later just means changing what's inside these
// functions, the routes wouldn't need to change at all.

const SEED = [
  {
    id: 1,
    title: 'Set up project repo',
    description: 'Initialize git and CI',
    status: 'completed',
    priority: 'medium',
    dueDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Design database schema',
    description: '',
    status: 'in-progress',
    priority: 'high',
    dueDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: '',
    status: 'pending',
    priority: 'low',
    dueDate: null,
    createdAt: new Date().toISOString(),
  },
];

let tasks = [...SEED];
let nextId = tasks.length + 1;

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function create(data) {
  const task = {
    id: nextId++,
    title: data.title,
    description: data.description || '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    dueDate: data.dueDate || null,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

// full replace (PUT) - any field not sent falls back to a default,
// this is different from patch() on purpose, see PATCH below
function update(id, data) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = {
    ...tasks[index],
    title: data.title,
    description: data.description || '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    dueDate: data.dueDate || null,
  };
  return tasks[index];
}

// partial update (PATCH) - only overwrites the fields actually sent
function patch(id, data) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...data };
  return tasks[index];
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}

// used by tests to get back to a known state between test files
function _reset(seed = SEED) {
  tasks = seed.map((t) => ({ ...t }));
  nextId = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
}

module.exports = { getAll, getById, create, update, patch, remove, _reset, SEED };
