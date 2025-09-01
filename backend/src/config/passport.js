import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "../prisma/client.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              githubId: profile.id,
              username: profile.username || profile.displayName,
              avatarUrl: profile.photos?.[0]?.value || "",
              githubToken: accessToken,
            },
          });

          console.log("user", user);
        } else {
          // update token if changed
          await prisma.user.update({
            where: { id: user.id },
            data: { githubToken: accessToken },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
