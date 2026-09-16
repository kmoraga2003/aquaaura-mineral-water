"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
const seedData_1 = require("./seed/seedData");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// View Engine Setup (EJS)
app.set('views', path_1.default.join(__dirname, '../views'));
app.set('view engine', 'ejs');
// Routes
app.use('/', indexRoutes_1.default);
app.use('/api', apiRoutes_1.default);
// Seed database on server start
(0, seedData_1.seedFirestore)();
// Start Server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`==================================================`);
        console.log(`🚀 AquaAura Node.js / Express Server is running!`);
        console.log(`🌐 Local URL: http://localhost:${PORT}`);
        console.log(`==================================================`);
    });
}
exports.default = app;
