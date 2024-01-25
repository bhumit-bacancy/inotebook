const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// List all notes get
router.get("/", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong!!!");
  }
});

// create new note
router.post(
  "/",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "minimum 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const notes = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await notes.save();
      res.json({ savedNote });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Something went wrong!!!");
    }
  }
);

// update note
router.put("/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (title) {
      newNote.description = description;
    }
    if (title) {
      newNote.tag = tag;
    }

    let note = await Note.findById(req.params.id);
    if(!note){
      return res.status(404).send("Not found!!")
    }

    if (note.user.toString() !== req.user.id){
      return res.status(401).send("Not allowed!!")
    }
    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong!!!");
  }
});

// delete note
router.delete("/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if(!note){
      return res.status(404).send("Not found!!")
    }

    if (note.user.toString() !== req.user.id){
      return res.status(401).send("Not allowed!!")
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Not has been deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong!!!");
  }
});

module.exports = router;
