import { validateEmail } from "../../helperFunctions"
import adminDAO from "../daos/admin/admins"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const hashPassword = async (password) => await bcrypt.hash(password, 10)

export class Admin {
  constructor({ name, email, password } = {}) {
    this.name = name
    this.email = email
    this.password = password
  }
  toJson() {
    return { name: this.name, email: this.email, userType: 1 }
  }
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password)
  }
  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        ...this.toJson(),
      },
      process.env.SECRET_KEY,
    )
  }
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return res.send({ errors })
      }
      return new Admin(res)
    })
  }
}

export default class AdminController {
  static async register(req, res) {
    try {
      const { name = "", email = "", password = "" } = req.body
      const errors = {}
      if (password.length < 8) {
        errors.password = "Your password must be at least 8 characters."
      }
      if (!validateEmail(email)) {
        errors.email = "You must specify a valid email address."
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const userInfo = {
        name,
        email,
        password: await hashPassword(password),
      }

      const insertResult = await adminDAO.addAdmin(userInfo)
      if (!insertResult.success) {
        errors.email = insertResult.error
      }
      const userFromDB = await adminDAO.getAdmin(email)
      if (!userFromDB) {
        errors.general = "Internal error, please try again later"
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const admin = new Admin(userFromDB)
      const jwt = admin.encoded()
      res.cookie("token", jwt, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      })

      return res.send({
        info: admin.toJson(),
      })
    } catch (e) {
      console.error(e)
      return res.send({ error: e })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body
      if (!validateEmail(email)) {
        return res.send({
          error: "Bad email format, expected string.",
        })
      }
      if (!password || typeof password !== "string") {
        return res.send({
          error: "Bad password format, expected string.",
        })
      }
      const userData = await adminDAO.getAdmin(email)
      if (!userData) {
        return res.send({
          error: "Make sure your email is correct.",
        })
      }
      const user = new Admin(userData)

      if (!(await user.comparePassword(password))) {
        return res.send({
          error: "Make sure your password is correct.",
        })
      }

      const jwt = user.encoded()
      const loginResponse = await adminDAO.loginAdmin(user.email, jwt)
      if (!loginResponse.success) {
        return res.send({ error: loginResponse.error })
      }

      res.cookie("token", jwt, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      })

      return res.send({
        info: user.toJson(),
      })
    } catch (e) {
      console.log(e)
      return res.send({ error: e })
    }
  }

  static async delete(req, res) {
    try {
      const { password } = req.body
      if (!password || typeof password !== "string") {
        return res.send({
          error: "Bad password format, expected string.",
        })
      }
      const userJwt = req.signedCookies.token
      const userClaim = await Admin.decoded(userJwt)
      let { error } = userClaim
      if (error) {
        return res.send({ errors })
      }
      const user = new Admin(await adminDAO.getAdmin(userClaim.email))
      if (!(await user.comparePassword(password))) {
        return res.send({
          error: "Make sure your password is correct.",
        })
      }
      const deleteResult = await adminDAO.deleteAdmin(userClaim.email)
      error = deleteResult.error
      if (error) {
        return res.send({ errors })
      }
      return res.send(deleteResult)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async update(req, res) {
    try {
      const userJwt = req.jwt
      const userFromHeader = await User.decoded(userJwt)
      const { error } = userFromHeader
      if (error) {
        return res.send({ errors })
      }

      const userFromDB = await adminDAO.getAdmin(userFromHeader.email)
      const updatedUser = new Admin(userFromDB)

      return res.send({
        auth_token: updatedUser.encoded(),
        info: updatedUser.toJson(),
      })
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async checkAuth(req, res) {
    const { token } = req.signedCookies
    console.log(token)
    res.send({ data: Admin.decoded(token) })
  }
}
