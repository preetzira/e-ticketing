let routes

export default class routesDAO {
  static async injectDB(conn, collection) {
    if (routes) {
      return
    }
    try {
      routes = await conn.db(process.env.DB_NAME).collection(collection)
    } catch (e) {
      console.error(`Unable to establish collection handles in routesDAO: ${e}`)
    }
  }

  /**
   * Finds a route in the `routes` collection
   * @param {string} _id - The _id of the desired route
   * @return {Object | null} Returns either a single route or nothing
   */
  static async getRoute(_id) {
    return await routes.findOne({ _id })
  }

  /**
   * Finds all routes in the `routes` collection
   * @return {Object | null} Returns either all routes or nothing
   */
  static async getRoutes({ from = null, to = null }) {
    const searchParams = from && to ? { from, to } : {}
    return await routes.find(searchParams).toArray()
  }

  /**
   * Adds a route to the `routes` collection
   * @param {RouteInfo} routeInfo - The information of the route to add
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addRoute(routeInfo) {
    const { name, stations } = routeInfo
    try {
      await routes.insertOne({ name, stations }, { w: "majority" })
      return { success: true }
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return {
          error: "A route with the given name already exists.",
        }
      }
      console.error(`Error occurred while adding new route, ${e}.`)
      return { error: e }
    }
  }

  /**
   * Removes a route from the `routes` collections
   * @param {string} _id - The _id of the route to delete
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteRoute(_id) {
    try {
      const result = await routes.deleteOne({ _id })
      if (!result) {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      } else {
        return { success: true }
      }
    } catch (e) {
      console.error(`Error occurred while deleting route, ${e}`)
      return { error: e }
    }
  }
}
