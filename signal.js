const { spawnSync } = require('child_process');

const initOpen = async ()=> {
const res = spawnSync('gpio', ['write', '1', '1']);
};

//initOpen();

const initClose = async () => {
const res = spawnSync('gpio', ['write', '1', '0']);
}

//initClose();

const readState = async () => {
	const {stdout: data} = spawnSync('gpio', ['read', '1']);
	if(!data) return null;
	const response = data.toString();
	console.log(typeof response, ' Current response');
	switch(Number(response)){
	case 1:
	return await initClose();
	case 0:
	return await initOpen();
	}
}

readState()
