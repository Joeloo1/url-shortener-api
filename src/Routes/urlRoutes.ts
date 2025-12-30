import express from "express";

import { shorten } from "../controller/urlController";

const router = express.Router();

router
    .route('/shorten')
    .post(shorten)


export default router;