const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [String],
  steps: [String],
  image: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Recipe", RecipeSchema);
