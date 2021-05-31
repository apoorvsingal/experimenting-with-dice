const tasks = {};

require("./comm")(tasks); // pass by reference

const vm = new VM();

(async () => {
	while(1){
		let shouldPause = true;

		for(let task of tasks){
			if(Date.now() - task.lastHeartbeat > 5000){ // if the heartbeat of any task takes more than 5 seconds, assume it to be dead
				
				const canRunTask = await broadcastAvailability(task); // broadcast to all backup nodes that you're available to take on the delegation, also request another few nodes to be added as backup nodes (not sure about the exact number but we just need one of them to accept the request since one node died (ideally we'd need a lot of metadata about a task to be able to decide which nodes are capable of actually handling the delegation (yes, I know I am nesting parenthesis :) ))), returns whether the current node should run the task or not (in case multiple nodes call it, we need some consensus, doesnt have to super complicated, we can just randonly choose one node)
				
				if(canRunTask){
					await vm.runTask(task);
				}
				shouldPause = false;
			}
		}
		if(shouldPause){
			await new Promise(resolve => setTimeout(resolve, 2000)); // this is important, running a forver loop without a sleep interval will make your room's temperature go brr
		}
	}
})(); // think of it as an (abstract) event loop
