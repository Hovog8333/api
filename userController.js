const userModel = require('./models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const albomModel = require('./models/albomModel');
const { Sequelize, Op, QueryTypes } = require('sequelize');
class UserController {
    async reg(req, res) {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({
            where: { email }
        });
        if (user) {
            return res.send('Arden ka tvyal EMAILOV');
        };

        const hashPassword = await bcrypt.hash(password, 4);
        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword
        });
        return res.send('reg... hajoxvac ancel e');
    }
    async log(req, res) {
        const { email, password } = req.body;
        const user = await userModel.findOne({
            where: { email }
        });
        if (!user) {
            return res.send('sxal email');
        }
        const comparedPassword = await bcrypt.compare(password, user.password);
        if (comparedPassword) {
            const uuid1 = uuid.v4();
            const accessToken = jwt.sign({
                email: email
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
            const refreshToken = jwt.sign({
                id: uuid1
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
            req.header.token = accessToken;
            req.header.identityId = user.id;
            // req.header.refreshToken = refreshToken;
            return res.send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } else {
            res.send('Sxal Password')
        }

    }
    async users(req, res) {
        const id = req.header.identityId;
        const user = await userModel.findOne(
            { where: { id } }
        );
        if (user.role == 'ADMIN') {
            const users = await userModel.findAll();
            res.send(users);
        } else {
            res.send('You are not ADMIN')
        }
    }
    async addAlbom(req, res) {
        const { name } = req.body;
        const id = req.header.identityId;

        const user = await userModel.findOne(
            { where: { id } }
        );
        const albom = await albomModel.findAll({
            where: { userId: user.id }
        });
        // const albom = await userModel.sequelize.query("SELECT * FROM `alboms` WHERE userId=? ORDER BY orderId DESC",[user.id], {
        //     type: QueryTypes.SELECT
        // });
        console.log('++++++++++');
        console.log(albom.length);

        let num = albom.length || 0;
        await albomModel.create({
            name,
            userId: user.id,
            orderId: ++num
        });
        res.send('Ablom added');
    }
    async myAlboms(req, res) {
        const id = req.header.identityId;
        const user = await userModel.findOne(
            { where: { id } }
        );
        const alboms = await albomModel.findAll({
            where: { userId: user.id }
        });
        res.send(alboms);
    }
    async allAlboms(req, res) {
        const id = req.header.identityId;
        const user = await userModel.findOne(
            { where: { id } }
        );
        if (user.role == 'ADMIN') {
            const allAlboms = await albomModel.findAll();
            res.send(allAlboms);
        } else {
            res.send('You are not ADMIN')
        }
    }
    async deleteMyAlbom(req, res) {
        const albomId = req.params.id;
        const id = req.header.identityId;
        const user = await userModel.findOne({
            where: { id }
        });
        const albom = await albomModel.destroy({
            where: { id: albomId, userId: user.id }
        });
        res.send('Deleted');
    }
    async anyAlboms(req, res) {
        const { id } = req.params;
        const identityId = req.header.identityId;
        const user = await userModel.findOne(
            { where: { id: identityId } }
        );
        if (user.role == "ADMIN") {
            const alboms = albomModel.destroy({
                where: { id }
            });
            res.send('Deleted');
        } else {
            res.send('You Are not ADMIN');
        }
    }
    async refresh(req, res) {
        try {
            const id = req.header.identityId;
            // const refreshToken = req.body;
            // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            //     if (err) {
            //         res.send('invalid refresh token');
            //     }else {
            //         next();
            //     }
            // });
            const user = await userModel.findOne({
                where: { id }
            });
            const uuid1 = uuid.v4();
            const accessToken = jwt.sign({
                email: user.email
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
            const refreshToken = jwt.sign({
                id: uuid1
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
            req.header.token = accessToken;
            req.header.identityId = user.id;
            return res.send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (e) {
            res.send(e);
        }

    }
    async myAlbomsaz(req, res) {
        const id = req.header.identityId;
        const user = await userModel.findOne(
            { where: { id } }
        );
        const alboms = await albomModel.sequelize.query(`SELECT * FROM alboms WHERE userId=? ORDER BY orderId ASC`, {
            replacements: [user.id],
            type: QueryTypes.SELECT
        });
        res.send(alboms);
    }
}

module.exports = new UserController();