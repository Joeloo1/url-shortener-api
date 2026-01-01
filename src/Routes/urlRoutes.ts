import express from "express";

import { shorten, redirect, getAllUrls} from "../controller/urlController";

const router = express.Router();

router.route("/shorten").post(shorten);
router.route('/:shortCode').get(redirect);
router.route('/api/v1/urls').get(getAllUrls);

export default router;
