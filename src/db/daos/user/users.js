let users
let sessions

export default class DAO {
  static async injectDB(conn, collection) {
    if (users) {
      return
    }
    try {
      users = await conn.db(process.env.DB_NAME).collection(collection)
      sessions = await conn.db(process.env.DB_NAME).collection("user_sessions")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  /**
   * Finds a user in the `users` collection
   * @param {string} email - The email of the desired user
   * @return {Object | null} Returns either a single user or nothing
   */
  static async getUser(email) {
    return await users.findOne({ email })
  }

  /**
   * Adds a user to the `users` collection
   * @param {UserInfo} userInfo - The information of the user to add
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addUser(userInfo) {
    const { name, email, password } = userInfo
    try {
      await users.insertOne({ name, email, password }, { w: "majority" })
      return { success: true }
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return {
          error: "A user with the given email already exists.",
        }
      }
      console.error(`Error occurred while adding new user, ${e}.`)
      return { error: e }
    }
  }

  /**
   * Removes a user from the `users` collections
   * @param {string} email - The email of the user to delete
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteUser(email) {
    try {
      await users.deleteOne({ email })
      if (!(await this.getUser(email))) {
        return { success: true }
      } else {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      }
    } catch (e) {
      console.error(`Error occurred while deleting user, ${e}`)
      return { error: e }
    }
  }

  /**
   * Create a user login session the `sessions` collections
   * @param {string} email - The email of the user to login
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async loginUser(email, jwt) {
    try {
      sessions.insertOne({ email, jwt, logged_on: Date.now() })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while generating session, ${e}`)
      return { error: e }
    }
  }

  static async checkUser(email) {
    try {
      const { isuser } = await this.getUser(email)
      return isuser || false
    } catch (e) {
      return { error: e }
    }
  }
}
