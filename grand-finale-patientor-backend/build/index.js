"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Install cors and inport: npm install cors, npm install --save-dev @types/cors.
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Used to allow Cross-Origin request.
app.use(express_1.default.json());
const PORT = 3001;
app.get("/api/ping", (_req, res) => {
    // Update route to match Patientor /api/ping.
    console.log("someone pinged here");
    res.send("pong");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test with: localhost:${PORT}/api/ping`);
});
