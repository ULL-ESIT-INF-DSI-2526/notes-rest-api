import express from "express";
import { User } from "../models/user.js";
import { Note } from "../models/note.js";

export const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Creates a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Gets users
 *     description: Returns all users or filter by a username if provided by query string
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: username
 *         required: false
 *         schema:
 *           type: string
 *         description: Username to filter users
 *     responses:
 *       200:
 *         description: List of users successfully obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Users not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
userRouter.get("/users", async (req, res) => {
  const filter = req.query.username
    ? { username: req.query.username.toString() }
    : {};

  try {
    const users = await User.find(filter);

    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(404).send({
        error: "Users not found",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Updates a user by username
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Username not provided or update not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               usernameNotProvided:
 *                 summary: Username not provided
 *                 value:
 *                   error: "A username must be provided"
 *               updateNotAllowed:
 *                 summary: Update not allowed
 *                 value:
 *                   error: "Update is not allowed"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
userRouter.patch("/users", async (req, res) => {
  if (!req.query.username) {
    res.status(400).send({
      error: "A username must be provided",
    });
  } else {
    const allowedUpdates = ["name", "username", "email", "age"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send({
        error: "Update is not allowed",
      });
    } else {
      try {
        const user = await User.findOneAndUpdate(
          {
            username: req.query.username.toString(),
          },
          req.body,
          {
            returnDocument: "after",
            runValidators: true,
          },
        );

        if (user) {
          res.send(user);
        } else {
          res.status(404).send({
            error: "User not found",
          });
        }
      } catch (error) {
        res.status(500).send(error);
      }
    }
  }
});

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Deletes a user by username
 *     description: Deletes the user and all their notes
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to be deleted
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Username not provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               usernameNotProvided:
 *                 summary: Username not provided
 *                 value:
 *                   error: "A username must be provided"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server internal error
 */
userRouter.delete("/users", async (req, res) => {
  if (!req.query.username) {
    res.status(400).send({
      error: "A username must be provided",
    });
  } else {
    try {
      const user = await User.findOne({
        username: req.query.username.toString(),
      });

      if (!user) {
        res.status(404).send({
          error: "User not found",
        });
      } else {
        const result = await Note.deleteMany({ owner: user._id });

        if (!result.acknowledged) {
          res.status(500).send();
        } else {
          await User.findByIdAndDelete(user._id);
          res.send(user);
        }
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
});
