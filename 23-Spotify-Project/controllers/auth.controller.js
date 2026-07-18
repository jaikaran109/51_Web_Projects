const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    let { username, email, password, role = "user" } = req.body;
    let alreadyExist = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (alreadyExist) {
        return res.status(409).json({
            Message: "User Already Exists",
        });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const Hash = await bcrypt.hash(password, salt);

    let user = await User.create({
        username,
        email,
        password: Hash,
        role,
    });

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    res.status(201).json({
        Message: "User Registered Successfully",
    });
};

const loginUser = async (req, res) => {
    let { username, email, password } = req.body;
    let user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        return res.status(401).json({
            Message: "Invalid Credentials",
        });
    }

    let isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
        return res.status(401).json({
            Message: "Incorrect Password",
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    res.status(200).json({
        Message: "User Logged in",
    });
};

const logoutUser = async (req ,res) => {
    res.clearCookie('token') ; 
    res.status(200).json({
        Message : 'Logged Out'
    })
} 

module.exports = { registerUser, loginUser, logoutUser };
