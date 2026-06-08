const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "" }, // Field added
    likes: [{ username: String }],
    comments: [{ username: String, text: String }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
