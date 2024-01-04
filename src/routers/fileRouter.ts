import Router from "../../library/router";
import { FileController } from "../conrollers/fileController";

const router = new Router();

const fileController = new FileController(); 

router.post("/api/file/upload", fileController.handleFileUpload);

export = router;