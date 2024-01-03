import Router from "../../library/router";
import { AuthController } from "../conrollers/authController";

const router = new Router();

const authController = new AuthController(); 

router.post('/api/signIn', authController.signIn);
router.post('/api/signUp', authController.signUp);

export = router;
