const axios = require("axios").default;
const remoteRoutes = require("../constants/remote-routes");

module.exports = axios.create({
    baseURL: remoteRoutes.BASE
});
