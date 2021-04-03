module.exports = {
    BASE: "https://api.spacetraders.io/users",
    GENERATE_TOKEN: username => `/${username}/token`,
    CHECK_STATUS: username => `/${username}`
};
