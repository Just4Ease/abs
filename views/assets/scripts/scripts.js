const ENDPOINT = window.location.host;
const socket = io.connect(ENDPOINT, {
	path: '/ws'
});

socket.on('connect', () => {
	console.log('conn');
});
let vm;
const vue = new Vue({
	data: () => ({
		time: new Date(Date.now()).getTime(),
		processing: false,
		search: '',
	}),
	computed: {
		plates() {
			if (vm.search.length >= 1) {
				return vm.getSavedPlates()
					.filter(plate => plate.plate.toLowerCase()
						.match(vm.search.toLowerCase()));
			}
			return vm.getSavedPlates();
		}
	},
	methods: {
		getSavedPlates() {
			return JSON.parse(localStorage.getItem('plates')) || [];
		},
		saveCapturedPlate(plates) {
			return localStorage.setItem('plates', JSON.stringify(plates));
		},
		async getPlate(point) {
			socket.emit('image::captured', { point }, (resp) => {
				console.log(resp, ' response.');
				if (resp.status) {
					const plates = vm.getSavedPlates();
					const plateIndex = plates.findIndex(pl => String(pl.plate)
						.trim() === String(resp.data.plate)
						.replace(/[^a-zA-Z0-9]/g, '')
						.toUpperCase()
						.trim());
					if (plateIndex !== -1 && plateIndex !== undefined) {
						const oldPlateData = {};

						switch (point) {
							case 'ENTRY':
								// DO Nothing.
								break;
							case 'EXIT':
								if (!oldPlateData.timeOut) {
									Object.assign(oldPlateData, { ...plates[plateIndex] });
									plates[plateIndex] = {
										...oldPlateData,
										plate: String(oldPlateData.plate)
											.replace(/[^a-zA-Z0-9]/g, '')
											.toUpperCase(),
										timeOut: new Date(resp.data.time)
									};
									vm.saveCapturedPlate(plates);
								}
								break;
							default:
							// DO Nothing.
						}
					} else {
						switch (point) {
							case 'ENTRY':
								plates.push({
									...resp.data,
									plate: String(resp.data.plate)
										.replace(/[^a-zA-Z0-9]/g, '')
										.toUpperCase(),
									timeIn: new Date(resp.data.time),
									timeOut: null
								});
								vm.saveCapturedPlate(plates);
								break;
							case 'EXIT':
								// DO Nothing.
								break;
							default:
							// DO Nothing.
						}
					}
				}

				vm.processing = false; // Done processing image.
				return vm.getSavedPlates();
			});
		}
	},
	created() {
		vm = this;
		let imgEntry;
		// let imgExit;
		setTimeout(() => {
			imgEntry = document.getElementById('entry-img');
			imgEntry.src = 'http://admin:admin@192.168.1.109/tmpfs/auto.jpg';
			setInterval(() => {
				vm.time = new Date(Date.now()).getTime();
				imgEntry.src = `http://192.168.1.109/tmpfs/auto.jpg${vm.time}`;
			}, 90);
			setInterval(async () => {
				if (!vm.processing) {
					// At every second. Process the image and wait for a response.
					vm.processing = true;
					await vm.getPlate('ENTRY', 'entry-img');
					// vm.getPlate('EXIT', 'exit-img');
				}
			}, 90);
		}, 1000);
	}
}).$mount('#app');
