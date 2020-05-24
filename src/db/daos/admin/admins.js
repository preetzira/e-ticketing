let admins
let sessions

export default class DAO {
  static async injectDB(conn, collection) {
    if (admins) {
      return
    }
    try {
      admins = await conn.db(process.env.DB_NAME).collection(collection)
      sessions = await conn.db(process.env.DB_NAME).collection("admin_sessions")
    } catch (e) {
      console.error(`Unable to establish collection handles in adminDAO: ${e}`)
    }
  }

  /**
   * Finds a admin in the `admins` collection
   * @param {string} email - The email of the desired admin
   * @return {Object | null} Returns either a single admin or nothing
   */
  static async getAdmin(email) {
    return await admins.findOne({ email }, { email: 1, _id: 0 })
  }

  /**
   * Adds a admin to the `admins` collection
   * @param {AdminInfo} adminInfo - The information of the admin to add
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addAdmin(adminInfo) {
    const { name, email, password } = adminInfo
    try {
      await admins.insertOne({ name, email, password }, { w: "majority" })
      return { success: true }
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return {
          error: "A admin with the given email already exists.",
        }
      }
      console.error(`Error occurred while adding new admin, ${e}.`)
      return { error: e }
    }
  }

  /**
   * Removes a admin from the `admins` collections
   * @param {string} email - The email of the admin to delete
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteAdmin(email) {
    try {
      await admins.deleteOne({ email })
      if (!(await this.getAdmin(email))) {
        return { success: true }
      } else {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      }
    } catch (e) {
      console.error(`Error occurred while deleting admin, ${e}`)
      return { error: e }
    }
  }

  /**
   * Create a admin login session the `sessions` collections
   * @param {string} email - The email of the admin to login
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async loginAdmin(email, jwt) {
    try {
      sessions.insertOne({ email, jwt, logged_on: Date.now() })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while generating session, ${e}`)
      return { error: e }
    }
  }

  static async checkAdmin(email) {
    try {
      const doesExists = await this.getAdmin(email)
      return doesExists || false
    } catch (e) {
      return { error: e }
    }
  }
}
