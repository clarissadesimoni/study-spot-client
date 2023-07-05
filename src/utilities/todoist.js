import { TodoistApi } from '@doist/todoist-api-typescript';

var api = null;

async function getTasks(token, filter) {
    if (!api)
        api = new TodoistApi(token);
    const res = await api.getTasks({filter: filter})
    .catch(console.log);
    return res;
}

async function closeTask(token, id) {
    await api.closeTask({filter: filter})
    .catch(console.log);
}

export { getTasks, closeTask };