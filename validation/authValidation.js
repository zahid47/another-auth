import Joi from "joi";

const authValidation = (body) => {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(new RegExp("^\\S*$"))
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .label("Username")
      .messages({
        "string.pattern.base": "Username cannot contain spaces",
      }),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).max(250).required().label("Password"),
    avatar: Joi.link().label("Avatar"),
  });
  return schema.validate(body);
};

export default authValidation;
