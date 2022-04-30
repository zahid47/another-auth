import Joi from "joi";

const updateUserValidation = (body) => {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(new RegExp("^\\S*$"))
      .alphanum()
      .min(3)
      .max(30)
      .label("Username")
      .messages({
        "string.pattern.base": "Username cannot contain spaces",
      }),
    email: Joi.string().email().label("Email"),
  });
  return schema.validate(body);
};

export default updateUserValidation;
