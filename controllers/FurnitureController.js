export class FurnitureController {
    constructor(room) {
        this.room = room;
    }

    addFurniture(furniture) {
        try {
            // console.log("Validating furniture data:", furniture); // Log the furniture data
            // Validate furniture data
            if (!furniture.name || !furniture.width || !furniture.length) {
                throw new Error("Missing required furniture properties");
            }

            // Convert string dimensions to numbers
            furniture.width = Number(furniture.width);
            furniture.length = Number(furniture.length);

            // Add to room and get updated state
            const result = this.room.addFurniture(furniture);

            return {
                success: true,
                ...result,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
