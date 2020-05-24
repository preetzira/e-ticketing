let trains

export default class trainsDAO {
  static async injectDB(conn, collection) {
    if (trains) {
      return
    }
    try {
      trains = await conn.db(process.env.DB_NAME).collection(collection)
    } catch (e) {
      console.error(`Unable to establish collection handles in trainsDAO: ${e}`)
    }
  }

  /**
   * Finds a train in the `trains` collection
   * @param {string} _id - The _id of the desired train
   * @return {Object | null} Returns either a single train or nothing
   */
  static async getTrain(_id) {
    return await trains.findOne({ _id })
  }

  /**
   * Finds all trains in the `trains` collection
   * @return {Object | null} Returns either all trains or nothing
   */
  static async getTrains() {
    return await trains.find({}).toArray()
  }

  /**
   * Adds a train to the `trains` collection
   * @param {TrainInfo} trainInfo - The information of the train to add
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addTrain(trainInfo) {
    const { name, running_days, available_classes } = trainInfo
    try {
      await trains.insertOne(
        { name, running_days, available_classes },
        { w: "majority" },
      )
      return { success: true }
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return {
          error: "A train with the given name already exists.",
        }
      }
      console.error(`Error occurred while adding new train, ${e}.`)
      return { error: e }
    }
  }

  /**
   * Removes a train from the `trains` collections
   * @param {string} _id - The _id of the train to delete
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteTrain(_id) {
    try {
      const result = await trains.deleteOne({ _id })
      if (!result) {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      } else {
        return { success: true }
      }
    } catch (e) {
      console.error(`Error occurred while deleting train, ${e}`)
      return { error: e }
    }
  }
}
