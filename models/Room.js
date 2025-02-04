export class Room {
    constructor() {
        this.width = 600;
        this.height = 400;
        // Create a 2D array filled with false (unoccupied)
        this.grid = Array(this.height)
            .fill()
            .map(() => Array(this.width).fill(false));
        this.furniture = [];
        this.totalArea = 0;
    }

    // Check if a piece of furniture can fit at a specific position
    canPlaceAt(furniture, startX, startY) {
        // Check if furniture would go out of bounds
        if (
            startX + furniture.width > this.width ||
            startY + furniture.length > this.height
        ) {
            return false;
        }

        // Check if any cell is already occupied
        for (let y = startY; y < startY + furniture.length; y++) {
            for (let x = startX; x < startX + furniture.width; x++) {
                if (this.grid[y][x]) {
                    return false;
                }
            }
        }

        return true;
    }

    // Find first available position for furniture
    findAvailableSpace(furniture) {
        for (let y = 0; y < this.height - furniture.length + 1; y++) {
            for (let x = 0; x < this.width - furniture.width + 1; x++) {
                if (this.canPlaceAt(furniture, x, y)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    addFurniture(furniture) {
        const position = this.findAvailableSpace(furniture);

        if (!position) {
            throw new Error("No space available for this furniture");
        }

        // Mark cells as occupied
        for (let y = position.y; y < position.y + furniture.length; y++) {
            for (let x = position.x; x < position.x + furniture.width; x++) {
                this.grid[y][x] = true;
            }
        }

        // Add position to furniture object
        furniture.position = position;
        this.furniture.push(furniture);
        this.totalArea += furniture.width * furniture.length;
        return { furniture, totalArea: this.totalArea };
    }

    getCurrentArea() {
        return this.totalArea;
    }
}
