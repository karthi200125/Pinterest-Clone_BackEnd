import bcrypt from 'bcryptjs';
import User from '../Model/User.js';

// REGISTER
export const Register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json('Email Already Exists');
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        return res.status(201).json('User Created Successfully');
    } catch (error) {
        console.error('Register Failed', error);
        return res.status(500).json('Register Failed', error);
    }
};

// LOGIN
export const Login = async (req, res) => {
    const { email, password, username, profilePic } = req.body;

    try {
        if (username) {
            // If its get username , it's Google OAuth registration
            const existEmail = await User.findOne({ email });
            if (existEmail) {
                const user = await User.findOne({ email });
                const checkpassword = await bcrypt.compare(password, user.password);
                if (!checkpassword) return res.status(500).json('Wrong password');
                return res.status(200).json(user);
            }
            // if email not exist that measn new user , so create one
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const user = new User({ username, email, password: hashedPassword, profilePic });
            const userdatails = await user.save();
            return res.status(201).json(userdatails);
        } else {
            // Regular login without a username
            const user = await User.findOne({ email });
            if (!user) return res.status(500).json('Wrong email address');
            const checkpassword = await bcrypt.compare(password, user.password);
            if (!checkpassword) return res.status(500).json('Wrong password');
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error('Login or Registration failed', error);
        return res.status(500).json('Login or Registration Failed');
    }
};
