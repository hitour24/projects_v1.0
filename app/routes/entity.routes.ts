import * as express from 'express';
import { add, find, get, remove, update } from '../controllers/entity-controller';
const router = express.Router();

router.post('/:entity/find/', find);
router.post('/:entity', add);
router.put('/:entity/:id', update);
router.get('/get/:entity', get);
router.post('/:entity/remove', remove);

export default router;