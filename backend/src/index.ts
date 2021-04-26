import "reflect-metadata";
require("dotenv-safe").config();
import express from "express";
import { UserData } from "./entities/User";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import jwt from "jsonwebtoken";
import cors from "cors";
import { PipfiUrl } from "./entities/PipfiUrl";
import { isAuth } from "./isAuth";
import db from "./db";

const app = express();
app.use(cors({ origin: "*" }));
app.use(passport.initialize());
app.use(express.json());

const main = async () => {
  await db();

  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        console.log(profile._json,profile.displayName,profile.emails,profile.id,profile.profileUrl,profile.username,profile.photos)
        let user = await UserData.findOne({ where: { githubId: profile.id } });
        if (user) {
          user.name = profile.displayName;
          user.githubUserName = profile.username || "";
          user.avatarUrl = profile.photos ? profile.photos[0].value : "";
          user.email = profile?.emails ? profile.emails[0].value : "";
          user.githubId = profile.id;
          await user.save();
        } else {
          user = await UserData.create({
            name: profile.displayName,
            githubId: profile.id,
            githubUserName: profile.username,
            avatarUrl: profile.photos ? profile.photos[0].value : "",
            email:  profile?.emails ? profile.emails[0].value : ""
          }).save();
        }
        cb(null, {
          accessToken: jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1y",
            }
          ),
        });
      }
    )
  );

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res) => {
      res.redirect(`http://localhost:54331/auth/${req.user.accessToken}`);
    }
  );

  app.get("/links", isAuth, async (req, res) => {
    try{
      const links = await PipfiUrl.find({
        where: { ownerId: req.userId },
        order: { id: "DESC" },
      });
  
      res.send({ links });
    }catch(err){
      console.log(err)
      res.status(500).send({message:'Error in server while getting links'})
    }
  });

  app.post("/addLink", isAuth, async (req, res) => {
    try{
      const link = await PipfiUrl.create({
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        ownerId: req.userId
      }).save();
      res.send({ link });
    }catch(err){
      console.log(err)
      res.status(500).send({message:'Error in server while adding new link'})
    }
  });

  app.put("/updateLink", isAuth, async (req, res) => {
    const link = await PipfiUrl.findOne(req.body.id);
    if (!link) {
      res.send({ link: null });
      return;
    }
    if (link.ownerId !== req.userId) {
      res.status(401).send({message:'Not authorized'})
    }
    link.description = req.body.description;
    link.title = req.body.title;
    link.ownerId = req.body.ownerId;
    link.url = req.body.url
    await link.save();
    res.send({ link });
  });

  app.get("/me", async (req, res) => {
    try{
      // Bearer 120jdklowqjed021901
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.send({ user: null });
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res.send({ user: null });
        return;
      }

      let userId = "";

      try {
        const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = payload.userId;
      } catch (err) {
        res.send({ user: null });
        return;
      }

      if (!userId) {
        res.send({ user: null });
        return;
      }

      const user = await UserData.findOne(userId);

      res.send({ user });
    }catch(err){
      res.status(500).send('Error in server while getting user data')
    }
  });

  app.get("/", (_req, res) => {
    res.send("Hello, This is pipfi backend.");
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log("listening on localhost:3000");
  });
};

main();
