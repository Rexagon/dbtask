import express from 'express';

import { ITask, Task } from '../models/task';
import { inRange, genErrResponse } from '../stuff';
import { IUser } from 'src/models/user';

const router = express.Router();

const taskValidator = (task: ITask) => {
  return {
    isIdInvalid: task.id == null,
    isTitleInvalid: task.title == null || !inRange(task.title, 1, 255),
    isDescriptionInvalid: task.description == null || task.description.length < 1
  };
};

// GET /api/tasks //
///////////////////

router.get('/tasks', async (req, res) => {
  try {
    res.json(await Task.getAll());
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// GET /api/tasks/:id //
///////////////////////

router.get('/tasks/:id', async (req, res) => {
  const id: number = req.params.id;

  if (id == null) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    res.json((await Task.getOne(id)) || genErrResponse('InvalidData'));
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// POST /api/tasks //
////////////////////

router.post('/tasks', async (req, res) => {
  const task = req.body as ITask;
  const validated = taskValidator(task);

  if (validated.isTitleInvalid) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    res.json(await Task.create(task));
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// PUT /api/tasks //
///////////////////

router.put('/tasks', async (req, res) => {
  const task = req.body as ITask;
  const validated = taskValidator(task);

  if (validated.isIdInvalid || validated.isTitleInvalid) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    await Task.update(task);

    res.json({});
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// DELETE /api/tasks //
//////////////////////

router.delete('/tasks/:id', async (req, res) => {
  const id: number = req.params.id;

  if (id == null) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    await Task.delete(id);

    res.json({});
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// POST /api/tasks/:id/users/:userId //
//////////////////////////////////////

router.post('/tasks/:id/users/:userId', async (req, res) => {
  const id: number = req.params.id;
  const userId: number = req.params.userId;

  if (id == null || userId == null) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    await Task.addUser(id, userId);
    res.json({});
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// DELETE /api/tasks/:id/users/:userId //
////////////////////////////////////////

router.delete('/tasks/:id/users/:userId', async (req, res) => {
  const id: number = req.params.id;
  const userId: number = req.params.userId;

  if (id == null || userId == null) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    await Task.removeUser(id, userId);
    res.json({});
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

export default router;
