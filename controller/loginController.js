const {User, Login} = require('../model/User')
const Validator = require('fastest-validator');
const {hashSync, genSaltSync} = require("bcrypt");
const {compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");

exports.createNewUser = async (req, res, next) => {
    try {
        let {name, email, password} = req.body;

        const schema = {
            name: {type: "string", optional: false, max: "100"},
            email: {type: "string", optional: false},
            passo: {type: "string", optional: false},
        }
        const v = new Validator();
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                error: validationResponse
            });
        } else {
            const salt = genSaltSync(10);
            password = hashSync(password, salt);
            let user = new User(name, email, password);
            user = await user.save();
            res.status(201).json({message: "user created", status: 1, user});
        }
    } catch (error) {
        // next(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }

};


// exports.getByPasswordEmail = async (req, res, next) => {
//     try {
//
//         let {email, password} = req.body;
//         try {
//
//             const [signIn, _] = await User.findPassword(email);
//         } catch (e) {
//             res.status(200).json({
//                 status: 0,
//                 data: "Invalid email or password",
//                 error: e
//             });
//         }
//
//
//     } catch (error) {
//         // next(error);
//         res.status(500).json({
//             data: "Something went wrong",
//             error: error
//         });
//     }
// };
exports.getByPasswordEmail = async (req, res, next) => {
    try {
        let {email, password} = req.body;
        let logIn = new Login(email);
        logIn = await logIn.findPassword();
        if (logIn[0].length > 0) {
            const result = compareSync(password, logIn[0][0].password);
            if (result) {
                logIn[0][0].password = undefined;
                const jsonToken = sign(
                    {result: logIn[0][0]},
                    "qwe1234");
                res.status(201).json({
                    status: 1,
                    token: jsonToken,
                    empId: logIn[0][0].id
                })
            } else {
                res.status(200).json({
                    status: 0,
                    message: "Invalid email or password"
                });
            }
        } else {
            res.status(200).json({
                status: 0,
                message: "Invalid email or password",
                logIn: logIn[0].length
            });
        }


    } catch (error) {
        // next(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
};