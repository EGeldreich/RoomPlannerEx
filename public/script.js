// HANDLE FORM IN JS TO AVOID RELOADS
console.log("main.js loaded");
document.querySelector("form").addEventListener("submit", async (e) => {
    // console.log("Form submitted");
    e.preventDefault(); // Stop normal form submission

    // Get form data
    const formData = new FormData(e.target);
    const furniture = {
        name: formData.get("name"),
        width: formData.get("width"),
        length: formData.get("length"),
    };

    // Send to server
    const response = await fetch("http://localhost:3000/furniture", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(furniture),
    });

    const errorDisplay = document.getElementById("error-display");

    if (response.ok) {
        // Hide any previous error
        errorDisplay.style.display = "none";

        // Get the server's response
        const result = await response.json();

        // Update the room display with new furniture
        addFurnitureToDisplay(result);
        updateObjective(result);
    } else {
        // Get error text and display it
        const errorData = await response.json();
        errorDisplay.textContent = errorData.error;
        errorDisplay.style.display = "block";
    }
});

function addFurnitureToDisplay(result) {
    // Create and add furniture element to room
    const furnitureElement = document.createElement("div");

    // Add styles
    furnitureElement.style.backgroundColor = getRandomColor();
    // Use the position from the server
    furnitureElement.style.gridColumn = `${
        result.furniture.position.x + 1
    } / span ${result.furniture.width}`;
    furnitureElement.style.gridRow = `${
        result.furniture.position.y + 1
    } / span ${result.furniture.length}`;

    furnitureElement.title = result.furniture.name;

    document.querySelector(".room").appendChild(furnitureElement);
}

function updateObjective(result) {
    let objectiveEl = document.querySelector("#objective");
    let maxArea = 600 * 400;
    objectiveEl.textContent = (result.totalArea / maxArea) * 100;
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
