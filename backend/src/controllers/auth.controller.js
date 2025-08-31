import jwt from "jsonwebtoken";

export const githubCallbackController = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.redirect("/dashboard");
};
