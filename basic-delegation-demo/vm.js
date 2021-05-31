const net = require("net");

module.exports = class VM {
	runTask(){
		return (eval(task.code))(); // task.code is just a stringified async function for now
	};
};