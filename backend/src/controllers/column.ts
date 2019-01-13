import express from 'express';

import { IColumn, Column } from '../models/column';
import { genErrResponse } from '../stuff';

const router = express.Router();

// GET /api/columns //
/////////////////////

router.get('/columns', async (req, res) => {
  try {
    res.json(await Column.getAll());
  } catch (err) {
    res.send(genErrResponse('DBError', err));
  }
});

// GET /api/columns/:id //
/////////////////////////

router.get('/columns/:id', async (req, res) => {
  const id: number = req.params.id;

  if (id == null) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    res.json((await Column.getOne(id)) || genErrResponse('InvalidData'));
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// POST /api/columns //
//////////////////////

router.post('/columns', async (req, res) => {
  const column = req.body as IColumn;
  const validated = Column.validate(column);

  if (validated.isNameInvalid) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    res.json(await Column.create(column));
  } catch (err) {
    res.json(genErrResponse('DBError'));
  }
});

// PUT /api/columns //
/////////////////////

router.put('/columns', async (req, res) => {
  const column = req.body as IColumn;
  const validated = Column.validate(column);

  if (validated.isIdInvalid || validated.isNameInvalid) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    await Column.update(column);

    res.json({});
  } catch (err) {
    res.json(genErrResponse('DBError'));
  }
});

// DELETE /api/columns //
////////////////////////

router.delete('/columns/:id', async (req, res) => {
  const id: number = req.params.id;

  if (id == null) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    await Column.delete(id);

    res.json({});
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

export default router;
