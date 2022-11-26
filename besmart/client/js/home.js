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

	connectWith(equipment) {
		this.connections.push(equipment);
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

	draw(ctx) {
		ctx.lineWidth = 1;
		ctx.setLineDash([2]);
		ctx.strokeStyle = "gray";
		this.clicked &&
			ctx.strokeRect(
				this.xCoord - 1,
				this.yCoord - 1,
				this.sizeW + 2,
				this.sizeH + 3
			);
		ctx.drawImage(this.Image, this.xCoord, this.yCoord, this.sizeW, this.sizeH);
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
			alert("Equipment already exists on the canvas!");
			return false;
		}
		this.equipments.push(equipment);
		return true;
	}

	removeEquipment(equipment) {
		const equipmentIndex = this.equipments.indexOf(equipment);
		this.equipments.splice(equipmentIndex, 1);
	}

	connect(equipment1, equipment2) {
		if (this.checkIfConnectionPossible(equipment1, equipment2)) {
			const indexOfEquipment1 = this.equipments.indexOf(equipment1);
			this.equipments[indexOfEquipment1].connectWith(equipment2);

			const indexOfEquipment2 = this.equipments.indexOf(equipment2);
			this.equipments[indexOfEquipment2].connectWith(equipment1);
		} else {
			throw "Unable to connect equipments";
		}
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
		for (const equipment of this.sim.equipments) {
			equipment.draw(this.ctx);
		}
		return;
	};
	addEvents = () => {
		this.canvas.addEventListener("mouseleave", () => {
			if (this.selectedEquipment == null) return;
			this.selectedEquipment.clicked = false;
			this.selectedEquipment = null;
			this.draw();
			return;
		});
		this.canvas.addEventListener("mousedown", (e) => {
			const eq = this.equipmentAtLocation(e);
			///////////////////////////////////////
			if (eq == null) return;
			eq.clicked = true;
			this.selectedEquipment = eq;
			this.draw();
			return;
		});
		this.canvas.addEventListener("mousemove", (e) => {
			if (this.selectedEquipment == null) return;
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
			this.selectedEquipment.xCoord = newX;
			this.selectedEquipment.yCoord = newY;
			this.draw();
			return;
		});
		this.canvas.addEventListener("mouseup", (e) => {
			if (this.selectedEquipment == null) return;
			this.selectedEquipment.clicked = false;
			this.selectedEquipment = null;
			this.draw();
			return;
		});
	};
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
