class Equipment {
    id;
    name;
    numberOfInputs;
    numberOfOutputs;
    requiredCurrent;
    requiredVoltage;
    description;
    connections;
    pathToImage;
    xCoord;
    yCoord;

    constructor(name, numberOfInputs, numberOfOutputs, requiredCurrent = 0, requiredVoltage = 0, description = '', pathToImage = '') {
        this.name = name;
        this.description = description;
        this.numberOfInputs = numberOfInputs;
        this.numberOfOutputs = numberOfOutputs;
        this.requiredCurrent = requiredCurrent;
        this.requiredVoltage = requiredVoltage;
        this.pathToImage = pathToImage;
        this.connections = [];
    }

    connectWith(equipment) {
        this.connections.push(equipment);
    }
}

class Simulation {
    constructor() {
        this.equipments = [];
    }

    addEquipment(equipment) {
        this.equipments.push(equipment);
    }

    removeEquipment(equipment) {
        const equipmentIndex = this.equipments.indexOf(equipment);
        this.equipments.splice(equipmentIndex, 1);    
    }

    test() {
        // TODO: implement test later
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


const EQUIPMENTS = [
    new Equipment("LED", 2, 1, 0, 0, '', 'D:\\LUCHICI\\Web Apps Programming 1\\Source\\rau-web-apps-programming-1-g610-2022-2023\\besmart\\client\\assets\\simulation\\led.png'),
    new Equipment("Battery", 0, 2, 0, 0, '', 'D:\\LUCHICI\\Web Apps Programming 1\\Source\\rau-web-apps-programming-1-g610-2022-2023\\besmart\\client\\assets\\simulation\\battery.png'),
    new Equipment("Resistor", 1, 1, 0, 0, '', 'D:\\LUCHICI\\Web Apps Programming 1\\Source\\rau-web-apps-programming-1-g610-2022-2023\\besmart\\client\\assets\\simulation\\resistor.png'),
    new Equipment("Capacitor", 1, 1, 0, 0, '', 'D:\\LUCHICI\\Web Apps Programming 1\\Source\\rau-web-apps-programming-1-g610-2022-2023\\besmart\\client\\assets\\simulation\\capacitor.png')
]

const simulation = new Simulation();
// simulation.addEquipment(EQUIPMENTS[0]);
// simulation.addEquipment(EQUIPMENTS[1]);
// simulation.connect(simulation.equipments[1], simulation.equipments[0]);
// console.log(simulation);


function addEquipmentsToDropdown(equipments) {
    const equipmentsDropdown = document.getElementById("equipment-select");
    if (equipmentsDropdown) {
        const option = document.createElement("option");
        option.value = "Select equipment...";
        option.innerText ="Select equipment...";
        equipmentsDropdown.appendChild(option);
        for (const equipment of equipments) {
            const option = document.createElement("option");
            option.value = ""
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
            simulation.addEquipment(equipment);
            regenerateSimulationCanvas(simulation);
            break;
        }
    }
    select.selectedIndex = 0;
}

function createEquipmentsDropdown(equipments) {
    const select = document.createElement("select");
    select.name = "equipment";
    select.id = "equipment-select";
    select.onchange = getSelectedEquipment;
    const addEquipmentButton = document.getElementById("add-equipment-button");
    addEquipmentButton.appendChild(select);

    addEquipmentsToDropdown(equipments);
}

createEquipmentsDropdown(EQUIPMENTS);

// const img = new Image();

function regenerateSimulationCanvas(simulation) {
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

// TODO: Add method to move one equipment once added to canvas
