let cities

export default class citiesDAO {
  static async injectDB(conn, collection) {
    if (cities) {
      return
    }
    try {
      cities = await conn.db(process.env.DB_NAME).collection(collection)
    } catch (e) {
      console.error(`Unable to establish collection handles in citiesDAO: ${e}`)
    }
  }

  /**
   * Finds a city in the `cities` collection
   * @param {string} _id - The _id of the desired city
   * @return {Object | null} Returns either a single city or nothing
   */
  static async getCity(_id) {
    return await cities.findOne({ _id })
  }

  /**
   * Finds all cities in the `cities` collection
   * @return {Object | null} Returns either all cities or nothing
   */
  static async getCities() {
    return await cities.find({}).toArray()
  }

  /**
   * Adds a city to the `cities` collection
   * @param {CityInfo} cityInfo - The information of the city to add
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addCity(cityInfo) {
    const { name, stations } = cityInfo
    try {
      await cities.insertOne({ name, stations }, { w: "majority" })
      return { success: true }
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return {
          error: "A city with the given name already exists.",
        }
      }
      console.error(`Error occurred while adding new city, ${e}.`)
      return { error: e }
    }
  }

  /**
   * Removes a city from the `cities` collections
   * @param {string} _id - The _id of the city to delete
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteCity(_id) {
    try {
      const result = await cities.deleteOne({ _id })
      if (!result) {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      } else {
        return { success: true }
      }
    } catch (e) {
      console.error(`Error occurred while deleting city, ${e}`)
      return { error: e }
    }
  }
}
