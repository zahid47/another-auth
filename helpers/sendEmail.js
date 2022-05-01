import sgMail from "@sendgrid/mail";
import { signToken } from "./jwtHelper.js";
import { config } from "dotenv";

config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (userId, to, type) => {
  signToken(userId, "GENERAL")
    .then((token) => {
      //construct msg start
      const msg = {};
      msg.to = to;
      msg.from = {
        name: "Another-Auth",
        email: process.env.EMAIL_FROM,
      };
      if (type === "EMAIL-VERIFICATION") {
        const url = `${process.env.SERVER_URL}/api/v1/verify/${token}`;

        msg.subject = "Verify Email";
        msg.text = `Please verify your account using this link: ${url}. It will expire in 1 day.`;
        msg.html = `<p><a href=${url}>Click here</a> to verify your account. The link will expire in 1 day.</p>`;
      } else if (type === "PASSWORD-RESET") {
        //TODO change url to client
        const url = `${process.env.SERVER_URL}/api/v1/password/reset/${token}`;

        msg.subject = "Reset Password";
        msg.text = `Please reset your password using this link: ${url}. It will expire in 1 day.`;
        msg.html = `<p><a href=${url}>Click here</a> to reset your password. The link will expire in 1 day.</p>`;
      }
      //construct msg end

      sgMail.send(msg, (err, _) => {
        if (err) {
          console.log({ error: "email not sent" });
        } else {
          console.log({ success: "email sent" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export default sendEmail;
