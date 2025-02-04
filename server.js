import http from "http";
import fs from "fs/promises";
import path from "path";
import { FurnitureController } from "./controllers/FurnitureController.js";
import { Room } from "./models/Room.js";

const room = new Room();
const furnitureController = new FurnitureController(room);

const server = http.createServer(async (req, res) => {
    // console.log("=== NEW REQUEST ===");
    // console.log("Method:", req.method);
    // console.log("URL:", req.url);
    // console.log("Headers:", req.headers);
    // Serve index.html for root path
    if (req.url === "/" || req.url === "/index.html") {
        try {
            const content = await fs.readFile("./public/index.html");
            res.setHeader("Content-Type", "text/html");
            res.end(content);
        } catch (error) {
            res.statusCode = 500;
            res.end("Error loading index.html");
        }
    }
    // Serve CSS files
    else if (req.url.endsWith(".css")) {
        try {
            const content = await fs.readFile(`./public${req.url}`);
            res.setHeader("Content-Type", "text/css");
            res.end(content);
        } catch (error) {
            res.statusCode = 404;
            res.end("Not found");
        }
    }
    // Serve JS files
    else if (req.url.endsWith(".js")) {
        try {
            // console.log("Attempting to serve JS file:", `./public${req.url}`);
            const content = await fs.readFile(`./public${req.url}`);
            res.setHeader("Content-Type", "application/javascript");
            res.end(content);
            // console.log("Served JavaScript file:", req.url);
        } catch (error) {
            console.error("Error serving JS:", error);
            res.statusCode = 404;
            res.end("Not found");
        }
    }
    // Handle POST requests to /furniture
    else if (req.method === "POST" && req.url === "/furniture") {
        try {
            // Collect all data first
            let chunks = [];
            // console.log("Starting to receive data"); // Add this

            for await (const chunk of req) {
                chunks.push(chunk);
                // console.log("Received chunk"); // Add this
            }

            const body = Buffer.concat(chunks).toString();
            // console.log("Complete body received:", body);

            const furniture = JSON.parse(body);
            // console.log("Parsed furniture data:", furniture);

            // Validate controller
            if (!furnitureController) {
                console.log("Controller missing"); // Add this
                throw new Error("Controller not initialized");
            }

            // console.log("About to add furniture"); // Add this
            const result = furnitureController.addFurniture(furniture);
            // console.log("Furniture added, result:", result);

            // Make sure we're setting all headers correctly
            if (!result.success) {
                // If controller reports failure, send error status
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: result.error }));
                return;
            }

            // Otherwise send success response
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
        } catch (error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    // Handle 404s
    else {
        res.statusCode = 404;
        res.end("Not found");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
