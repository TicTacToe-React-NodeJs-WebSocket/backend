const server = require("./src/config/server");
require("./src/config/dbConnection");

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Servidor esta rodando na porta ${port}`);
});
