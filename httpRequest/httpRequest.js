async function send(url, method) {
  const res = await fetch(url, method);
  if (!res.ok) throw new Error(`HTTP code:${(await res).status}`);
  const type = (await res).headers.get(`content-type`);
  const isJSON = type && type.includes(`application/json`);
  try {
    const result = isJSON ? await res.json() : await res.text();
    return result;
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}
async function getTasks() {
  const tasks = await send("http://localhost:3000/tasks", {
    method: "GET",
  });
  return tasks;
}
async function getTask(id) {
  this.task = await send(`http://localhost:3000/tasks/` + id);
}
async function createTask(newTask) {
  const methods = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  };
  const task = await send("http://localhost:3000/tasks", methods);
  return task;
}
async function editTask(id, newTask) {
  const methods = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  };
  const task = await this.send(`http://localhost:3000/tasks/` + id, methods);
  return task;
}
async function deleteTask(id) {
  const methods = { method: "DELETE" };
  const task = await send(`http://localhost:3000/tasks/` + id, methods);
  return task;
}
export { getTasks, getTask, createTask, editTask, deleteTask };
