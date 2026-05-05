import express from "express";
import { Note } from "../models/note.js";
import { User } from "../models/user.js";

export const noteRouter = express.Router();

/**
 * @swagger
 * /notes/{username}:
 *   post:
 *     summary: Creates a note for a particular user
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the note's owner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteCreate'
 *     responses:
 *       201:
 *         description: Note successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server internal error
 */
noteRouter.post("/notes/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });

    if (!user) {
      res.status(404).send({
        error: "User not found",
      });
    } else {
      const note = new Note({
        ...req.body,
        owner: user._id,
      });

      await note.save();
      await note.populate({
        path: "owner",
        select: ["username"],
      });
      res.status(201).send(note);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /notes/{username}:
 *   get:
 *     summary: Gets all notes of a particular user
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Notes' owner username
 *     responses:
 *       200:
 *         description: Notes list successfully obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       404:
 *         description: User not found or notes not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *               notesNotFound:
 *                 summary: Notes not found
 *                 value:
 *                   error: "Notes not found"
 *       500:
 *         description: Server internal error
 */
noteRouter.get("/notes/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });

    if (!user) {
      res.status(404).send({
        error: "User not found",
      });
    } else {
      const notes = await Note.find({
        owner: user._id,
      }).populate({
        path: "owner",
        select: ["username"],
      });

      if (notes.length !== 0) {
        res.send(notes);
      } else {
        res.status(404).send({
          error: "Notes not found",
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /notes/{username}/{id}:
 *   get:
 *     summary: Obtains a user's note by id
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Note's owner username
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     responses:
 *       200:
 *         description: Note successfully obtained
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: User or note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *               noteNotFound:
 *                 summary: Note not found
 *                 value:
 *                   error: "Note not found"
 *       500:
 *         description: Server internal error
 */
noteRouter.get("/notes/:username/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });

    if (!user) {
      res.status(404).send({
        error: "User not found",
      });
    } else {
      const note = await Note.findOne({
        owner: user._id,
        _id: req.params.id,
      }).populate({
        path: "owner",
        select: ["username"],
      });

      if (note) {
        res.send(note);
      } else {
        res.status(404).send({
          error: "Note not found",
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /notes/{username}/{id}:
 *   patch:
 *     summary: Updates a user's note by id
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Note's owner username
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteUpdate'
 *     responses:
 *       200:
 *         description: Note successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Update not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               updateNotAllowed:
 *                 summary: Update not allowed
 *                 value:
 *                   error: "Update is not allowed"
 *       404:
 *         description: User or note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *               noteNotFound:
 *                 summary: Note not found
 *                 value:
 *                   error: "Note not found"
 *       500:
 *         description: Server internal error
 */
noteRouter.patch("/notes/:username/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });

    if (!user) {
      res.status(404).send({
        error: "User not found",
      });
    } else {
      const allowedUpdates = ["title", "body", "color"];
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate = actualUpdates.every((update) =>
        allowedUpdates.includes(update),
      );

      if (!isValidUpdate) {
        res.status(400).send({
          error: "Update is not allowed",
        });
      } else {
        const note = await Note.findOneAndUpdate(
          {
            owner: user._id,
            _id: req.params.id,
          },
          req.body,
          {
            returnDocument: "after",
            runValidators: true,
          },
        ).populate({
          path: "owner",
          select: ["username"],
        });

        if (note) {
          res.send(note);
        } else {
          res.status(404).send({
            error: "Note not found",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /notes/{username}/{id}:
 *   delete:
 *     summary: Deletes a note by id
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Note's owner username
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     responses:
 *       200:
 *         description: Note successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: User or note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *               noteNotFound:
 *                 summary: Note not found
 *                 value:
 *                   error: "Note not found"
 *       500:
 *         description: Server internal error
 */
noteRouter.delete("/notes/:username/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });

    if (!user) {
      res.status(404).send({
        error: "User not found",
      });
    } else {
      const note = await Note.findOneAndDelete({
        owner: user._id,
        _id: req.params.id,
      }).populate({
        path: "owner",
        select: ["username"],
      });

      if (note) {
        res.send(note);
      } else {
        res.status(404).send({
          error: "Note not found",
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
