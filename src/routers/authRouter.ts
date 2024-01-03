import authValidateMiddleware from "../validation/authValidator";
import Router from "../../library/router";
import { AuthController } from "../conrollers/authController";

const router = new Router();

const authController = new AuthController(); 

router.post('/api/signIn', authController.signIn, [authValidateMiddleware]);
router.post('/api/signUp', authController.signUp, [authValidateMiddleware]);

export = router;
