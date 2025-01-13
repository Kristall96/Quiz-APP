import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150, // Limit the title length
    },
    content: {
      type: String,
      required: true, // Blog content is mandatory
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // Ensures an author is assigned
    },
    tags: {
      type: [String], // Array of tags for categorization
      default: [], // Defaults to an empty array
    },
    category: {
      type: String,
      enum: ["Technology", "Lifestyle", "Travel", "Education", "Other"], // Example categories
      default: "Other",
    },
    published: {
      type: Boolean,
      default: false, // Indicates if the post is published or in draft mode
    },
    publishedAt: {
      type: Date, // Records the date when the post is published
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the creation date
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Updated whenever the post is edited
    },
    coverImage: {
      type: String, // URL or path to a cover image
      default: null,
    },
    likes: {
      type: Number,
      default: 0, // Count of likes on the post
    },
    visibility: {
      type: String,
      enum: ["public", "private"], // Posts can be public or private
      default: "public",
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

export default model("BlogPost", blogPostSchema);
