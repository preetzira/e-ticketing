import { validateEmail } from "../../helperFunctions"
import bookingsDAO from "../daos/user/bookings"
import usersDAO from "../daos/user/users"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const hashPassword = async (password) => await bcrypt.hash(password, 10)

export class User {
  constructor({ name, email, password } = {}) {
    this.name = name
    this.email = email
    this.password = password
  }
  toJson() {
    return { name: this.name, email: this.email, userType: 0 }
  }
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password)
  }
  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 4,
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
      return new User(res)
    })
  }
}

export default class UserController {
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

      const insertResult = await userDAO.addUser(userInfo)
      if (!insertResult.success) {
        errors.email = insertResult.error
      }
      const userFromDB = await userDAO.getUser(email)
      if (!userFromDB) {
        errors.general = "Internal error, please try again later"
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const user = new User(userFromDB)
      const jwt = user.encoded()

      res.cookie("token", jwt, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      })

      return res.send({
        info: user.toJson(),
      })
    } catch (e) {
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
      const userData = await usersDAO.getUser(email)
      if (!userData) {
        return res.send({
          error: "Make sure your email is correct.",
        })
      }
      const user = new User(userData)

      if (!(await user.comparePassword(password))) {
        return res.send({
          error: "Make sure your password is correct.",
        })
      }

      const loginResponse = await usersDAO.loginUser(user.email, user.encoded())
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
      const userJwt = req.jwt
      const userClaim = await User.decoded(userJwt)
      let { error } = userClaim
      if (error) {
        return res.send({ errors })
      }
      const user = new User(await usersDAO.getUser(userClaim.email))
      if (!(await user.comparePassword(password))) {
        return res.send({
          error: "Make sure your password is correct.",
        })
      }
      const deleteResult = await usersDAO.deleteUser(userClaim.email)
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

      const userFromDB = await usersDAO.getUser(userFromHeader.email)
      const updatedUser = new User(userFromDB)

      return res.send({
        auth_token: updatedUser.encoded(),
        info: updatedUser.toJson(),
      })
    } catch (e) {
      return res.send({ error: e })
    }
  }

  // for internal use only
  static async createAdminUser(req, res) {
    try {
      const { password = "", username: email = "" } = req.body
      const errors = {}
      if (password.length < 8) {
        errors.password = "Your password must be at least 8 characters."
      }
      if (email.length < 3) {
        errors.username =
          "You must specify a username of at least 3 characters."
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const userInfo = {
        email,
        password: await hashPassword(password),
      }

      const insertResult = await usersDAO.addUser(userInfo)
      if (!insertResult.success) {
        errors.username = insertResult.error
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      await usersDAO.makeAdmin(email)

      const userFromDB = await usersDAO.getUser(email)
      if (!userFromDB) {
        errors.general = "Internal error, please try again later"
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const user = new User(userFromDB)
      const jwt = user.encoded()
      await usersDAO.loginUser(user.email, jwt)

      const registerUser = spawn("prosodyctl", [
        "register",
        email,
        "jit.si",
        password,
      ])

      registerUser.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`)
      })

      registerUser.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`)
      })

      registerUser.on("error", (error) => {
        console.log(`error: ${error.message}`)
      })

      registerUser.on("close", (code) => {
        console.log(`child process exited with code ${code}`)
        return res.send({
          auth_token: jwt,
          info: user.toJson(),
        })
      })
    } catch (e) {
      console.log(e)
      return res.send({ error: e })
    }
  }

  static async createRoom(req, res) {
    try {
      const roomCredentials = req.body
      const errors = {}
      if (roomCredentials && roomCredentials.name.length < 3) {
        errors.name = "You must specify a room name of at least 3 characters."
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }
      const insertResult = await usersDAO.addRoom(roomCredentials)
      if (!insertResult.success) {
        errors.name = insertResult.error
      }
      const roomFromDB = await usersDAO.getRoom(roomCredentials.name)
      if (!roomFromDB) {
        errors.general = "Internal error, please try again later"
      }
      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }
      return res.send(roomFromDB)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getRooms(req, res) {
    try {
      const data = await usersDAO.getRooms()
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getRoom(req, res) {
    try {
      const data = await usersDAO.getRoom(req.body.name)
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }
}
