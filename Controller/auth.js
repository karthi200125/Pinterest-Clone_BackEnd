import User from "../Model/User.js";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken'

// REGISTER
export const Register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existEmail = await User.findOne({ email });
        if (existEmail) return res.status(400).json("Email Already Exists");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json("User Created Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json("Register Failed");
    }
};

// LOGIN

export const Login = async (req, res) => {
    const { email, password } = req.body;


    try {
        const user = await User.findOne({ email })
        !user && res.status(500).json("wrong email address")
        const checkpassword =await bcrypt.compare(password, user.password)
        !checkpassword && res.status(500).json("wrong password")
        
        res.status(200).json(user)

    } catch (error) {
        console.log("Login falied")
    }
}
