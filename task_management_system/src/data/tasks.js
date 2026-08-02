export const tasks = [
  {
    id: 1,
    title: 'Sample task',
    completed: false,
  },
];

let nextId = tasks.length + 1;

export const createTaskRecord = (taskData) => {
  const task = {
    id: nextId++,
    title: taskData.title || 'Untitled task',
    completed: Boolean(taskData.completed),
  };

  tasks.push(task);
  return task;
};

export const findTaskById = (id) => tasks.find((task) => task.id === id);

export const updateTaskRecord = (id, taskData) => {
  const task = findTaskById(id);

  if (!task) {
    return null;
  }

  if (typeof taskData.title === 'string') {
    task.title = taskData.title;
  }

  if (typeof taskData.completed === 'boolean') {
    task.completed = taskData.completed;
  }

  return task;
};

export const deleteTaskRecord = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  const [removedTask] = tasks.splice(index, 1);
  return removedTask;
};