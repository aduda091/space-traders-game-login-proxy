const router = require("express").Router();
const routes = require("../constants/routes");
const remoteRoutes = require("../constants/remote-routes");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const axios = require("../axios");

router.post(routes.REGISTER, async (req, res) => {
    const { username, password } = req.body;

    // connect to spacetraders api and claim username
    let response;
    try {
        response = await axios.post(remoteRoutes.GENERATE_TOKEN(username));
        const data = response.data;

        const token = data.token;
        const user = await User.findOne({ where: { username } });
        if (user && user.token) {
            // existing user, update token (409 would be if username was taken on remote api as well)
            user.token = token;
            await user.save();
            return res.send({
                success: true,
                user: {
                    token,
                    ...data.user
                }
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        // insert username and hashed password to database
        const newUser = await User.create({ username, password: hashedPassword, token });
        return res.send({
            success: true,
            user: {
                token,
                ...data.user
            }
        });
    } catch (err) {
        // claimed? 409 error
        if (err.response.status === 409) {
            return res.status(409).send({
                success: false,
                error: "Username already claimed"
            });
        }
    }
});

router.post(routes.LOGIN, async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(404).send({
            success: false,
            error: "Username not found"
        });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
        return res.status(401).send({
            success: false,
            error: "Invalid password"
        });
    } else {
        // valid user, get status
        let response;
        try {
            response = await axios.get(remoteRoutes.CHECK_STATUS(username), {
                headers: {
                    Authorization: "Bearer " + user.token
                }
            });

            const data = response.data;

            return res.send({
                success: true,
                user: {
                    token: user.token,
                    ...data.user
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(401).send({
                success: false,
                status: err.response
            });
        }
    }
});

module.exports = router;
