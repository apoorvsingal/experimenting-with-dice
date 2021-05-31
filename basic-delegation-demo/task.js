module.exports.task1 = async (state = 0, context = {}) => {
	const buffer = "This is a random array that this task is supposed to send back to the client."; // buffer.length is 77

	// dividing the buffer into 8 parts
	// totally not the best way of sending data (probabaly one of the worst) but works for the demo ig
	// if the node crashes at any time, the function sends the data starting from the last tens place, along with the index so that the client that sync the buffer with what it already has 
	switch(state){
	case 0:
		await context.socket.send({ index: 0, buffer: buffer.slice(0, 10) });
		await context.setState(1);
	case 1:
		await context.socket.send({ index: 10, buffer: buffer.slice(10, 20) });
		await context.setState(2);
	case 2:
		await context.socket.send({ index: 20, buffer: buffer.slice(20, 30) });
		await context.setState(3);
	case 3:
		await context.socket.send({ index: 30, buffer: buffer.slice(30, 40) });
		await context.setState(4);
	case 4:
		await context.socket.send({ index: 40, buffer: buffer.slice(40, 50) });
		await context.setState(5);
	case 5:
		await context.socket.send({ index: 50, buffer: buffer.slice(50, 60) });
		await context.setState(6);
	case 6:
		await context.socket.send({ index: 60, buffer: buffer.slice(60, 70) });
		await context.setState(7);
	case 7:
		await context.socket.send({ index: 70, buffer: buffer.slice(70) });
		await context.setState(8);
	}
};

module.exports.task2 = async (state = 0, context = {}) => {
	const buffer = "This is a random array that this task is supposed to send back to the client."; // buffer.length is 77

	// a better way to do the last task
	await context.socket.send("Sending data..."); // or any set of bytes that tells the client that the buffer is about to be sent (in case a delegation was made, the client would be unaware of it unless the task itself sends something indicating the delegtion which in this case is this message)
	
	const len = Number(await context.socket.read()); // client returns the number of bytes it has already recieved successfully (0 when the task is first triggered)

	await context.socket.send(buffer.slice(len));
	await context.socket.end();
};

module.exports.task3 = async (state = 0, context = {}) => {
	const buffer = "This is a random array that this task is supposed to send back to the client."; // buffer.length is 77
	let len = 0;

	// another way to do the same this (not better)
	switch(state){
	case 0:
		await context.setState(1);
		await context.socket.send(buffer); // does not ask for the length from the client when the buffer is sent for the first time, if the node crashes in the middle of this call, the new node first asks the client to send length of recieved data before sending further data
		break;
	case 1:
		await context.socket.send("Sending data..."); // any set of bytes that tells the client that a delegation was made and the rest of the buffer is about to be sent 

		len = Number(await context.socket.read()); // client returns the number of bytes it has already recieved successfully
		
		await context.socket.send(buffer.slice(len));
	}

	await context.socket.end();	
};