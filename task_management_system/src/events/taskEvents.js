import { EventEmitter } from 'node:events';

export const taskEvents = new EventEmitter();

taskEvents.on('task-created', (taskData) => {
  setImmediate(() => {
    const handlerTimestamp = new Date().toISOString();

    console.log(
      `[NOTIFICATION HANDLER] ${handlerTimestamp} task-created: ` +
        `title="${taskData.title}", assignedUser="${taskData.assignedUser}"`
    );
  });
});
