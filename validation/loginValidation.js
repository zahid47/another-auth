import Joi from "joi";

const loginValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).max(250).required().label("Password"),
  });
  return schema.validate(body);
};

export default loginValidation;
