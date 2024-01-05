import Router from "../../library/router";
import { FileController } from "../conrollers/fileController";
import { firebaseAuthMiddleware } from "../middleware/authMiddleware";

const router = new Router();

const fileController = new FileController(); 

router.post("/api/file/upload", fileController.handleFileUpload, [firebaseAuthMiddleware]);
router.get("/api/file", fileController.getAllMyFiles, [firebaseAuthMiddleware]);
router.delete("/api/file", fileController.deleteMyFile, [firebaseAuthMiddleware]);

export = router;