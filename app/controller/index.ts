import express from "express"
import authRouter from "./routes/auth"
import adminRouter from "./routes/admin"
import path from "path"
import fs from "fs"

const router = express.Router()

router.get("/", (req, res, next) => {
  return res.send("Hold on, nothing to see here.")
})

var version: string | undefined
router.get("/version", (req, res, next) => {
  if (!version) {
    const filePath: string = path.join(__dirname, "../../Versionfile")
    version = fs.readFileSync(filePath, { encoding: "utf-8" }).trim()
  }

  return res.send({
    version: version
  })
})

router.use(authRouter)
router.use(adminRouter)

export default router
