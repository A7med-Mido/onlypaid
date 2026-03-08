import mongoose from "mongoose";
import envs from "./envs.config";


const ConnectDB = async () => {
    if(mongoose.connections[0].readyState) {
        return true
    };
    try {
        await mongoose.connect(envs.DB_URL.toString());
        console.log("Connected To DB");
        return true;
    } catch (error) {
        console.log("ERROR While Connecting To Data Base PLZ Check It Out");
        return false;
    };
};

export default ConnectDB;