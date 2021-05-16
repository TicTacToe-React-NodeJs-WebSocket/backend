const sequelize = require("../../config/dbConnection");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const User = require("../models/User");

exports.getAllUsers = async (request, response) => {
    try {
        let users = await User.findAll({});
        if (users) {
            response.status(200).send({
                message: `Usuário encaminhado com sucesso.`,
                users,
            });
        } else
            response.status(404).send({
                message: `Nenhum usuário cadastrado!`,
            });
    } catch (error) {
        console.log("[ERROR AT GET ALL USERS]: " + error);
        response.status(500).send({
            message: `Erro interno do servidor!`,
            error: error,
        });
    }
};

exports.getUserByUsername = async (request, response) => {
    let username = request.params.username;
    try {
        let user = await User.findOne({
            where: {
                username: username,
            },
        });
        if (user) {
            response.status(200).send({
                message: `Usuário encaminhado com sucesso.`,
                user,
            });
        } else
            response.status(201).send({
                message: `Usuário não encontrado`,
                user: null,
            });
    } catch (error) {
        console.log("[ERROR AT GET USER BY USERNAME]: " + error);
        response.status(500).send({
            message: `Erro interno do servidor!`,
            error: error,
        });
    }
};

exports.createUser = async (request, response) => {
    try {
        let user = await User.create(request.body);
        if (user) {
            response.status(200).send({
                message: `Usuário cadastrado com sucesso.`,
                user,
            });
        }
    } catch (error) {
        console.log("[ERROR AT CREATE USER]: " + error);
        response.status(500).send({
            message: `Erro interno do servidor!`,
            error: error,
        });
    }
};

exports.updateUser = async (request, response) => {
    let username = request.params.username;
    try {
        await User.update(request.body, {
            where: {
                username: username,
            },
        });
        const user = await User.findOne({ where: { username: username } });
        if (user) {
            response.status(200).send({
                message: `Usuário atualizado com sucesso.`,
                user,
            });
        } else
            response.status(404).send({
                message: `Usuário não encontrado`,
            });
    } catch (error) {
        console.log("[ERROR AT UPDATE USER]: " + error);
        response.status(500).send({
            message: `Erro interno do servidor!`,
            error: error,
        });
    }
};

exports.deleteUser = async (request, response) => {
    let username = request.params.username;
    try {
        let user = await User.destroy({
            where: {
                username: username,
            },
        });
        if (user) {
            response.status(200).send({
                message: `Usuário removido com sucesso.`,
            });
        } else
            response.status(404).send({
                message: `Usuário não encontrado`,
            });
    } catch (error) {
        console.log("[ERROR AT DELETE USER]: " + error);
        response.status(500).send({
            message: `Erro interno do servidor!`,
            error: error,
        });
    }
};

exports.register = async (request, response) => {
    const name = request.body.name || "";
    const email = String(request.body.email).toLowerCase() || "";
    const senha = request.body.password || "";
    const repeatPassword = request.body.repeatPassword || "";
    const username = request.body.username || "";

    const re_name = /(?=^.{2,60}$)^([a-z]|[0-9])+(?:[ ]([a-z]|[0-9])+)*$/;
    const re_email =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    try {
        if (
            !re_name.test(
                String(name)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
            )
        ) {
            response
                .status(400)
                .send({ error: "O nome enviado está inválido" });
        } else if (!re_email.test(String(email).toLowerCase())) {
            response
                .status(400)
                .send({ error: "O email enviado está inválido" });
        } else if (senha == "") {
            response
                .status(400)
                .send({ error: "A senha enviada está inválida" });
        } else if (repeatPassword == "") {
            response.status(400).send({
                error: "A confirmação de senha enviada está inválida",
            });
        } else if (senha != repeatPassword) {
            response.status(400).send({
                error: "A confirmação de senha e senha são diferentes",
            });
        } else {
            bcrypt.genSalt(10, async (err, salt) => {
                if (err) {
                    console.log("Erro ao criar encriptação de senha:" + err);
                } else {
                    bcrypt.hash(senha, salt, async (err, hash) => {
                        if (err) {
                            console.log(
                                "Erro ao criar encriptação de senha:" + err
                            );
                        } else {
                            let hashPassword = hash;

                            var identifiedUser = await User.findByPk(username);
                            if (identifiedUser) {
                                response
                                    .status(201)
                                    .send({ message: "Usuário já cadastrado" });
                            } else {
                                let user = await User.create({
                                    email: email,
                                    password: hashPassword,
                                    username: username,
                                    name: name,
                                });
                                response.status(200).send({
                                    message: `Usuário registrado com sucesso!`,
                                    user,
                                });
                            }
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.log("[ERROR AT REGISTER USER]: " + e);
        response.status(500).send({ error: "Houve um erro interno. " + e });
    }
};

exports.authUser = async (request, response) => {
    try {
        const username = String(request.body.username).toLowerCase() || "";
        const password = request.body.password || request.body.senha || "";
        var identifiedUser = await User.findByPk(username);
        if (
            identifiedUser &&
            bcrypt.compareSync(password, identifiedUser.password)
        ) {
            response.status(200).send({
                message: "Login efetuado com sucesso",
                user: identifiedUser,
            });
        } else {
            response
                .status(201)
                .send({ message: "Usuário ou senha inválidos" });
        }
    } catch (e) {
        console.log("[ERROR AT AUTH USER]: " + e);
        response.status(500).send({ error: "Houve um erro interno. " + e });
    }
};
