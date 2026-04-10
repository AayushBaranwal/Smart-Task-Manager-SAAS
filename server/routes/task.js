const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// CREATE TASK
router.post("/", auth, async(req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            user: req.user.id
        });

        res.json(task);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL TASKS (for logged-in user)
router.get("/", auth, async(req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE TASK
router.put("/:id", auth, async(req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        res.json(task);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE TASK
router.delete("/:id", auth, async(req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json("Task deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;