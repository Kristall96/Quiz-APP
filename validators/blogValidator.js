import Joi from "joi";

// Validation schema for creating/updating a blog post
export const blogPostValidationSchema = Joi.object({
  title: Joi.string().max(150).required().messages({
    "string.base": "Title must be a string.",
    "string.max": "Title cannot exceed 150 characters.",
    "any.required": "Title is required.",
  }),
  content: Joi.string().required().messages({
    "string.base": "Content must be a string.",
    "any.required": "Content is required.",
  }),
  tags: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Tags must be an array of strings.",
  }),
  category: Joi.string()
    .valid("Technology", "Lifestyle", "Travel", "Education", "Other")
    .required()
    .messages({
      "any.only":
        "Category must be one of: Technology, Lifestyle, Travel, Education, Other.",
    }),
  coverImage: Joi.string().uri().optional().messages({
    "string.base": "Cover image must be a valid URL.",
    "string.uri": "Cover image must be a valid URL.",
  }),
  published: Joi.boolean().optional(),
});
