import parseJson from "../../library/parsers/parseJson";
import parseFile from "../../library/parsers/parseFile";
import Router from "../../library/router";
import { FileController } from "../conrollers/fileController";
import { firebaseAuthMiddleware } from "../middleware/authMiddleware";

const router = new Router();

const fileController = new FileController(); 

router.post("/api/file/upload", fileController.handleFileUpload, [parseJson, firebaseAuthMiddleware]);
router.get("/api/file", fileController.getAllMyFiles, [parseJson, firebaseAuthMiddleware]);
router.delete("/api/file", fileController.deleteMyFile, [parseJson, firebaseAuthMiddleware]);
router.get("/api/file/download", fileController.downloadMyFile, [firebaseAuthMiddleware, parseFile]);

export = router;