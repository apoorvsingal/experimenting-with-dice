const express = require("express");
const app = express();

module.exports = (tasks) => {
	app.use(express.json());

	app.put("/tasks/:taskId", (req, res) => {
		tasks[req.params.taskId] = { code: req.body.code, state: req.body.state, lastHeartbeat: Date.now(), nodeId: req.body.nodeId, backupNodes: req.body.backupNodes }; // (node IDs won't be this simple obviously), backupNodes dont include the node running the task and the current node itself
		res.send({ ok: true });
	});

	app.put("/tasks/:taskId/state", (req, res) => {
		tasks[req.params.taskId].state = req.body.state;
		res.send({ ok: true });
	});

	app.get("/tasks/:taskId/state", (req, res) => {
		res.send(tasks[req.params.taskId].state);
	});

	app.put("/tasks/:taskId/heartbeat", (req, res) => {
		tasks[req.params.taskId] = { lastHeartbeat: Date.now() };
		res.send({ ok: true });
	});

	app.put("/tasks/:taskId/backupNodes", (req, res) => {
		const task = tasks[req.params.taskId];

		if(task){
			task.backupNodes.push(req.body.nodeId);		
			res.send({ ok: true });
		} else {
			res.send({ error: "invalid task" });
		}
	});

	app.listen(process.argv[2] || 3000, () => {
		console.log("Node started successfully.");
	});
};
