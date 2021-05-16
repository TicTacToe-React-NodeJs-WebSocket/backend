const dbConnection = require("./src/config/dbConnection");

const User = require("./src/api/models/User");

async function syncDB() {
    try {
        await dbConnection.sync({ force: true });
        console.log("[SUCESSO]: Banco de dados sincronizado com sucesso!");
    } catch (error) {
        console.log(error);
    }
}

syncDB();
