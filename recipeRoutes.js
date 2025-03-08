const express = require("express");
const Recipe = require("../models/Recipe");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create Recipe
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, ingredients, steps, createdBy } = req.body;
    const recipe = new Recipe({
      title,
      description,
      ingredients: ingredients.split(","),
      steps: steps.split(","),
      image: req.file ? req.file.filename : "",
      createdBy,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "username");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Recipe
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Recipe
router.delete("/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
