import express from "express";

import db from "../db";
import { ITask } from "../models/task";
import { inRange, genErrResponse } from "../stuff";

const router = express.Router();

const taskValidator = (task: ITask) => {
  return {
    isIdInvalid: task.id == null,
    isTitleInvalid: task.title == null || !inRange(task.title, 1, 255),
    isDescriptionInvalid:
      task.description == null || task.description.length < 1
  };
};

// GET /api/tasks //
///////////////////

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await db.query<ITask[]>("SELECT * FROM tasks");

    res.json(tasks);
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

// POST /api/tasks //
////////////////////

router.post("/tasks", async (req, res) => {
  const task = req.body as ITask;
  const validated = taskValidator(task);

  if (validated.isTitleInvalid) {
    res.json(genErrResponse("InvalidData"));
    return;
  }

  delete task.id;

  try {
    const dbres = await db.query("INSERT INTO tasks SET ?", [task]);
    res.json({
      ...task,
      description: task.description || "",
      id: dbres.insertId
    });
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

// PUT /api/tasks //
///////////////////

router.put("/tasks", async (req, res) => {
  const task = req.body as ITask;
  const validated = taskValidator(task);

  if (validated.isIdInvalid || validated.isTitleInvalid) {
    res.json(genErrResponse("InvalidData"));
    return;
  }

  try {
    const { id, ...data } = task;

    await db.query("UPDATE tasks SET ? WHERE id=?", [data, task.id]);

    res.json({
      ...task,
      description: task.description || ""
    });
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

// DELETE /api/tasks //
//////////////////////

router.delete("/tasks/:id", async (req, res) => {
  const id: number = req.params.id;

  if (id == null) {
    res.json(genErrResponse("InvalidData"));
    return;
  }

  try {
    await db.query("DELETE FROM tasks WHERE id=?", [id]);
    res.json({});
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

export default router;
