class Equipment {
	id;
	name;
	sizeW = 15;
	sizeH = 15;
	numberOfInputs;
	numberOfOutputs;
	requiredCurrent;
	requiredVoltage;
	description;
	connections;
	pathToImage;
	xCoord;
	yCoord;
	Image;
	Box;
	clicked = false;
	selected = false;

	constructor(
		name,
		numberOfInputs,
		numberOfOutputs,
		requiredCurrent = 0,
		requiredVoltage = 0,
		description = "",
		pathToImage = ""
	) {
		this.name = name;
		this.description = description;
		this.numberOfInputs = numberOfInputs;
		this.numberOfOutputs = numberOfOutputs;
		this.requiredCurrent = requiredCurrent;
		this.requiredVoltage = requiredVoltage;
		this.pathToImage = pathToImage;
		if (this.pathToImage != null && this.pathToImage.length > 0) {
			this.Image = new Image(this.sizeW, this.sizeH);
			this.Image.src = this.pathToImage;
		}
		this.connections = [];
		return;
	}

	connectedWith(equipment) {
		if (this.connections.length <= 0) {
			return false;
		}
		let found = false;
		this.connections.forEach((map) => {
			if (map.equipment.name === equipment.name) {
				found = true;
				return;
			}
		});
		return found;
	}

	connectWith(equipment, type) {
		this.connections.push({
			equipment: equipment,
			connection_type: type,
		});
	}

	disconnectFrom(equipment) {
		let del_map = {
			index: 0,
			found: false,
		};
		this.connections.forEach((map, index) => {
			if (map.equipment.name === equipment.name) {
				del_map.found = true;
				del_map.index = index;
				return;
			}
		});
		if (del_map.found) this.connections.splice(del_map.index, 1);
		return del_map.found;
	}

	isMouseInShape = (x, y) => {
		let shape_left = this.xCoord;
		let shape_right = this.xCoord + this.sizeW;
		let shape_top = this.yCoord;
		let shape_bottom = this.yCoord + this.sizeH;
		if (
			x >= shape_left &&
			x <= shape_right &&
			y >= shape_top &&
			y <= shape_bottom
		) {
			return true;
		}
		return false;
	};

	drawConnections(ctx) {
		function drawArrow(fromx, fromy, tox, toy, arrowWidth, color) {
			let headlen = 10;
			let angle = Math.atan2(toy - fromy, tox - fromx);
			ctx.save();
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(fromx, fromy);
			ctx.lineTo(tox, toy);
			ctx.lineWidth = arrowWidth;
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(tox, toy);
			ctx.lineTo(
				tox - headlen * Math.cos(angle - Math.PI / 10),
				toy - headlen * Math.sin(angle - Math.PI / 10)
			);
			ctx.lineTo(
				tox - headlen * Math.cos(angle + Math.PI / 10),
				toy - headlen * Math.sin(angle + Math.PI / 10)
			);
			ctx.lineTo(tox, toy);
			ctx.lineTo(
				tox - headlen * Math.cos(angle - Math.PI / 10),
				toy - headlen * Math.sin(angle - Math.PI / 10)
			);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
			return;
		}
		ctx.strokeStyle = "black";
		this.connections.forEach((map) => {
			if (map.connection_type == "out") {
				let el = map.equipment;
				drawArrow(
					this.xCoord + this.sizeW,
					this.yCoord + this.sizeH / 2,
					el.xCoord,
					el.yCoord + el.sizeH / 2,
					1,
					"black"
				);
			}
			return;
		});
	}

	draw(ctx) {
		ctx.lineWidth = 1;
		ctx.setLineDash([2]);
		if (this.selected) {
			ctx.strokeStyle = "blue";
			ctx.strokeRect(
				this.xCoord - 1,
				this.yCoord - 1,
				this.sizeW + 2,
				this.sizeH + 3
			);
		} else if (this.clicked) {
			ctx.strokeStyle = "gray";
			ctx.strokeRect(
				this.xCoord - 1,
				this.yCoord - 1,
				this.sizeW + 2,
				this.sizeH + 3
			);
		}
		ctx.drawImage(this.Image, this.xCoord, this.yCoord, this.sizeW, this.sizeH);
		this.drawConnections(ctx);
		return;
	}
}
class Simulation {
	constructor() {
		this.equipments = [];
	}

	existsEquipment(equipment) {
		for (const eq of this.equipments) {
			if (eq.name === equipment.name) return true;
		}
		return false;
	}

	addEquipment(equipment) {
		if (this.existsEquipment(equipment)) {
			new MessageBox(
				"✗ Equipment '" + equipment.name + "' already exists on the canvas!"
			).show("error", 3);
			return false;
		}
		this.equipments.push(equipment);
		return true;
	}

	removeEquipment(equipment) {
		const equipmentIndex = this.equipments.indexOf(equipment);
		this.equipments.splice(equipmentIndex, 1);
	}

	isConnected(equipment1, equipment2) {
		return equipment1.connectedWith(equipment2);
	}

	disconnect(equipment1, equipment2) {
		let a = equipment1.disconnectFrom(equipment2);
		let b = equipment2.disconnectFrom(equipment1);
		if (a && b) {
			return true;
		}
		return false;
	}

	connect(equipment1, equipment2) {
		if (this.checkIfConnectionPossible(equipment1, equipment2)) {
			const indexOfEquipment1 = this.equipments.indexOf(equipment1);
			this.equipments[indexOfEquipment1].connectWith(equipment2, "out");
			const indexOfEquipment2 = this.equipments.indexOf(equipment2);
			this.equipments[indexOfEquipment2].connectWith(equipment1, "in");
			return true;
		}
		return false;
	}

	checkIfConnectionPossible(equipment1, equipment2) {
		if (equipment1.numberOfOutputs > equipment2.numberOfInputs) {
			return false;
		}
		return true;
	}
}
class Canvas {
	canvas;
	dragEquipment = null;
	selectedEquipment = null;
	constructor(simulation) {
		this.sim = simulation;
		this.canvas = document.getElementById("viewport");
		this.ctx = this.canvas.getContext("2d");
		this.addEvents();
		return;
	}
	getCanvasBox = () => {
		return this.canvas.getBoundingClientRect();
	};
	getMousePos = (evt) => {
		let rect = this.getCanvasBox();
		return {
			x:
				((evt.clientX - rect.left) / (rect.right - rect.left)) *
				this.canvas.width,
			y:
				((evt.clientY - rect.top) / (rect.bottom - rect.top)) *
				this.canvas.height,
		};
	};
	spawn = (equipment) => {
		if (!equipment.xCoord) {
			equipment.xCoord = Math.floor(Math.random() * 260) + 10;
		}
		if (!equipment.yCoord) {
			equipment.yCoord = Math.floor(Math.random() * 120) + 20;
		}
		new MessageBox(
			"✓ Equipment '" + equipment.name + "' have been spawned on the canvas!"
		).show("success", 2);
		this.draw();
		return;
	};
	equipmentAtLocation = (e) => {
		let startX = this.getMousePos(e).x;
		let startY = this.getMousePos(e).y;
		for (let equipment of this.sim.equipments) {
			if (equipment.isMouseInShape(startX, startY)) {
				return equipment;
			}
		}
		return null;
	};
	draw = () => {
		let bounding = this.getCanvasBox();
		this.ctx.clearRect(0, 0, bounding.width, bounding.height);
		if (this.selectedEquipment != null) {
			this.ctx.font = '9px serif';
			this.ctx.fillText("(!) Double-Click on another equipment to connect/disconnect.", 2, 10);
		}
		for (const equipment of this.sim.equipments) {
			equipment.draw(this.ctx);
		}
		return;
	};
	addEvents = () => {
		this.canvas.addEventListener("dblclick", (e) => {
			const eq = this.equipmentAtLocation(e);
			///////////////////////////////////////
			if (eq == null) {
				return;
			}
			if (this.selectedEquipment == null) {
				eq.selected = true;
				this.selectedEquipment = eq;
				new MessageBox(
					"Equipment '" + this.selectedEquipment.name + "' have been selected."
				).show("info", 2);
				this.draw();
				return;
			} else {
				if (this.selectedEquipment.name == eq.name) {
					this.selectedEquipment.selected = false;
					this.selectedEquipment = null;
					this.draw();
					return;
				}
				if (this.sim.isConnected(this.selectedEquipment, eq)) {
					new ConfirmBox(
						"Disconnect equipments",
						"Are you sure you want to disconnect '" +
							this.selectedEquipment.name +
							"' from '" +
							eq.name +
							"'?"
					).show((ev) => {
						if (this.sim.disconnect(this.selectedEquipment, eq)) {
							new MessageBox("✓ Equipments have been disconnected!").show();
							this.draw();
						} else {
							new MessageBox("✗ Couldn't disconnect the equipments!").show(
								"error"
							);
						}
					});
					return;
				}
				new ConfirmBox(
					"Connect equipments",
					"Are you sure you want to connect '" +
						this.selectedEquipment.name +
						"' with '" +
						eq.name +
						"'?"
				).show((ev) => {
					if (this.sim.connect(this.selectedEquipment, eq)) {
						new MessageBox("✓ Equipments have been connected!").show();
						this.draw();
					} else {
						new MessageBox("✗ Couldn't connect the equipments!").show("error");
					}
				});
				return;
			}
		});
		this.canvas.addEventListener("mouseleave", () => {
			if (this.dragEquipment == null) return;
			this.dragEquipment.clicked = false;
			this.dragEquipment = null;
			this.draw();
			return;
		});
		this.canvas.addEventListener("mousedown", (e) => {
			const eq = this.equipmentAtLocation(e);
			///////////////////////////////////////
			if (eq == null) {
				if (this.selectedEquipment != null) {
					this.selectedEquipment.clicked = false;
					this.selectedEquipment.selected = false;
					this.selectedEquipment = null;
					this.draw();
					return;
				}
				return;
			}
			eq.clicked = true;
			this.dragEquipment = eq;
			this.draw();
			return;
		});
		this.canvas.addEventListener("mousemove", (e) => {
			if (this.dragEquipment == null) return;
			let maxX = 285,
				maxY = 135;
			const mousePos = this.getMousePos(e);
			let newX = mousePos.x;
			let newY = mousePos.y;
			//////////////////////
			if (newX >= maxX) {
				newX = maxX;
			}
			if (newY >= maxY) {
				newY = maxY;
			}
			this.dragEquipment.xCoord = newX;
			this.dragEquipment.yCoord = newY;
			this.draw();
			return;
		});
		this.canvas.addEventListener("mouseup", (e) => {
			if (this.dragEquipment == null) return;
			this.dragEquipment.clicked = false;
			this.dragEquipment = null;
			this.draw();
			return;
		});
	};
}

class ConfirmBox {
	constructor(title, text) {
		this.text = text;
		this.title = title;
		this.no_btn = document.getElementById("confirm-no");
		this.yes_btn = document.getElementById("confirm-yes");
		return;
	}
	show(onSuccess, onDeny = () => {}) {
		let response = false;
		let confirm_box = document.getElementById("confirm__box");
		let confirm_title = document.getElementById("confirm_title");
		let confirm_msg = document.getElementById("confirm_message");
		let confirm_wrapper = document.getElementById("confirm_wrapper");
		confirm_title.innerText = this.title;
		confirm_msg.innerText = this.text;
		confirm_box.classList.add("confirm__show");
		confirm_wrapper.classList.add("confirm__show-wrapper");
		let close = () => {
			confirm_wrapper.classList.remove("confirm__show-wrapper");
			setTimeout(() => confirm_box.classList.remove("confirm__show"), 600);
		};
		this.yes_btn.onclick = (ev) => {
			onSuccess(ev);
			close();
			response = true;
		};
		this.no_btn.onclick = () => {
			onDeny();
			close();
			response = false;
		};
		return response;
	}
}

class MessageBox {
	constructor(text) {
		this.text = text;
		return;
	}
	show(type = "success", time = 4) {
		let info_msg = document.getElementById("info_msg");
		let info_box = document.getElementById("info__box");
		switch (type) {
			case "info":
				info_msg.style.color = "gray";
				break;
			case "success":
				info_msg.style.color = "green";
				break;
			case "error":
				info_msg.style.color = "red";
				break;
			default:
				info_msg.style.color = "green";
				break;
		}
		info_msg.innerText = this.text;
		info_box.classList.add("info__show");
		setTimeout(() => {
			info_box.classList.remove("info__show");
		}, time * 1000);
		return;
	}
}

const EQUIPMENTS = [
	new Equipment("LED", 2, 1, 0, 0, "", "../client/assets/simulation/led.png"),
	new Equipment(
		"Battery",
		0,
		2,
		0,
		0,
		"",
		"../client/assets/simulation/battery.png"
	),
	new Equipment(
		"Resistor",
		1,
		1,
		0,
		0,
		"",
		"../client/assets/simulation/resistor.png"
	),
	new Equipment(
		"Capacitor",
		1,
		1,
		0,
		0,
		"",
		"../client/assets/simulation/capacitor.png"
	),
];
const simulation = new Simulation();
const canvas = new Canvas(simulation);

function addEquipmentsToDropdown(equipments) {
	const equipmentsDropdown = document.getElementById("equipment-select");
	if (equipmentsDropdown) {
		const option = document.createElement("option");
		option.value = "Select equipment...";
		option.innerText = "Select equipment...";
		equipmentsDropdown.appendChild(option);
		for (const equipment of equipments) {
			const option = document.createElement("option");
			option.value = "";
			option.innerText = equipment.name;
			equipmentsDropdown.appendChild(option);
		}
	}
}

function getSelectedEquipment() {
	const select = document.getElementById("equipment-select");
	const equipmentName = select.options[select.selectedIndex].text;
	for (const equipment of EQUIPMENTS) {
		if (equipment.name === equipmentName) {
			simulation.addEquipment(equipment) && canvas.spawn(equipment);
			break;
		}
	}
	select.selectedIndex = 0;
	return;
}

function createEquipmentsDropdown(equipments) {
	const select = document.createElement("select");
	select.name = "equipment";
	select.id = "equipment-select";
	select.onchange = getSelectedEquipment;
	const addEquipmentButton = document.getElementById("add-equipment-button");
	addEquipmentButton.appendChild(select);
	addEquipmentsToDropdown(equipments);
	return;
}

createEquipmentsDropdown(EQUIPMENTS);

let clearCanvasButton = () => {
	const clearButton = document.getElementById("clear-button");
	clearButton.onclick = () => {
		new ConfirmBox(
			"Clear the canvas",
			"Are you sure you want to clear the canvas?"
		).show(() => {
			simulation.equipments.forEach(el => {
				el.connections = [];
			});
			simulation.equipments = [];
			canvas.dragEquipment = null;
			canvas.selectedEquipment = null;
			new MessageBox("✓ The canvas have been cleared!").show();
			canvas.draw();
			return;
		});
	};
};

clearCanvasButton();

/*function regenerateSimulationCanvas(simulation) {
    // TODO: make equipments 15px by 15px on canvas
    const canvas = document.getElementById("viewport");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    let x, y;
    for (const equipment of simulation.equipments) {
        img.src = equipment.pathToImage;
        if (equipment.xCoord) {
            x = equipment.xCoord;
        } else {
            x = Math.random() * (50 - 10 + 1) + 10;
            equipment.xCoord = x;
        }

        if (equipment.yCoord) {
            y = equipment.yCoord;
        } else {
            y = Math.random() * (50 - 10 + 1) + 10;
            equipment.yCoord = y;
        }

        img.onload = drawCurrentImage;
    }

    function drawCurrentImage() {
        img.width = "10px";
        img.height = "10px";
        ctx.drawImage(img, x, y);
    }
}
*/

// TODO: Add method to move one equipment once added to canvas
// https://stackoverflow.com/questions/55633974/how-do-you-move-objects-by-dragging-on-the-background-in-html5-canvas
