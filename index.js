import express from "express";
import globalRoutes from './Routes/GlobalRoutes.js';

//Config
const app = express();
const PORT = 5000;
const DB_URI = "mongodb+srv://sanyambhaskar5:sanyambhaskar5@generalcluster.pyi2web.mongodb.net/?retryWrites=true&w=majority&appName=GeneralCluster";

import mongoose from "mongoose";

//DB Connection
mongoose.connect(DB_URI)
    .then(() => console.log("Connected to DB!"))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

//Middlewares
app.use(express.json());

//Routes
app.get('/health', (req, res) => res.send(`Running on PORT: ${PORT}`));
app.use('/', globalRoutes);



app.listen(PORT, () => console.log(`PORT: ${PORT}`));