import authValidateMiddleware from "../validation/authValidator";
import Router from "../../library/router";
import { AuthController } from "../conrollers/authController";
import parseJson from "../../library/parsers/parseJson";

const router = new Router();

const authController = new AuthController(); 

router.post('/api/signIn', authController.signIn, [parseJson, authValidateMiddleware]);
router.post('/api/signUp', authController.signUp, [parseJson, authValidateMiddleware]);

export = router;
