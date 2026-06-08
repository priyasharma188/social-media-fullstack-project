const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // Ye field add ki hai kyunki aap frontend mein postLink use kar rahe hain
    link: {
      type: String,
      default: "",
    },

    likes: [
      {
        username: String,
      },
    ],

    comments: [
      {
        username: String,
        text: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Post", postSchema);
