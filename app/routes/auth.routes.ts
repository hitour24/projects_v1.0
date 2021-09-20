import * as express from 'express';
import { login, register, user, cehckPassword, refresh, updateName, updateEmail, updatePassword, updateSername, secondName, updateContacts } from '../controllers/auth-controller';

const router = express.Router();

router.get('/user', user);
router.get('/refresh', refresh);
router.post('/authenticate', login);
router.post('/register', register);
router.post('/cehckPassword', cehckPassword);

router.put('/updateName', updateName);
router.put('/updateSername', updateSername);
router.put('/secondName', secondName);


router.put('/updateContacts', updateContacts);
router.put('/updateEmail', updateEmail);
router.put('/updatePassword', updatePassword);
export default router;
