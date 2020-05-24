import path from "path"

import cookieParser from "cookie-parser"
import cors from "cors"
import express, { response } from "express"
import helmet from "helmet"
import "./db/connect"
import jwt from "jsonwebtoken"

const userRoutes = require("./routes/userRoutes")()
const adminRoutes = require("./routes/adminRoutes")()
const commonRoutes = require("./routes/commonRoutes")()

const router = express.Router()
const app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(cookieParser(process.env.SECRET_KEY))
app.use(function (req, res, next) {
  const { token = null } = req.signedCookies
  if (token) {
    const verification = jwt.verify(
      token,
      process.env.SECRET_KEY,
      (error, data) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            res.cookie("token", "", {
              httpOnly: true,
              signed: true,
              expires: new Date(Date.now()),
            })
            error = "Session has been expired, Kindly login again"
          }
          return { error }
        }
        req.user = data
        req.isAdmin = () => data.userType === 1
        req.isAuthenticated = () => true
      },
    )

    if (verification?.error) {
      return res.send({ error: verification.error })
    }
  }
  next()
})

const BUILD_DIR = path.resolve(__dirname, "client", "build")
app.use(express.static(BUILD_DIR))

adminRoutes.setupRouting(router)
userRoutes.setupRouting(router)
commonRoutes.setupRouting(router)

app.use("/v1", router)

app.get("*", (req, res) => {
  res.sendFile(path.resolve("client", "build", "index.html"))
})

export default app
