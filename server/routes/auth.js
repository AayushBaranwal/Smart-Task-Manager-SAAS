const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json("Invalid credentials");

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.json({ token, user });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // REGISTER
// router.post("/register", async(req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // ✅ validation
//         if (!name || !email || !password) {
//             return res.status(400).json("All fields are required");
//         }

//         // ✅ check existing user
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json("User already exists");
//         }

//         // ✅ hash password
//         const hashed = await bcrypt.hash(password, 10);

//         // ✅ create user
//         const user = await User.create({
//             name,
//             email,
//             password: hashed,
//         });

//         res.json({ msg: "User registered successfully" });

//     } catch (err) {
//         console.log("REGISTER ERROR:", err); // 🔥 important
//         res.status(500).json("Server error");
//     }
// });

// // LOGIN
// router.post("/login", async(req, res) => {
//     try {
//         const { email, password } = req.body;

//         // ✅ validation
//         if (!email || !password) {
//             return res.status(400).json("All fields are required");
//         }

//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json("User not found");

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json("Invalid credentials");

//         const token = jwt.sign({ id: user._id },
//             process.env.JWT_SECRET
//         );

//         res.json({ token });

//     } catch (err) {
//         console.log("LOGIN ERROR:", err); // 🔥 important
//         res.status(500).json("Server error");
//     }
// });

// module.exports = router;