import Router from "../../library/router";
import { FileController } from "../conrollers/fileController";
import { firebaseAuthMiddleware } from "../middleware/authMiddleware";

const router = new Router();

const fileController = new FileController(); 

router.post("/api/file/upload", fileController.handleFileUpload, [firebaseAuthMiddleware]);

export = router;