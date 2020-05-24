let booking

export default class bookingDAO {
  static async injectDB(conn, collection) {
    if (booking) {
      return
    }
    try {
      booking = await conn.db(process.env.DB_NAME).collection(collection)
    } catch (e) {
      console.error(
        `Unable to establish collection handles in bookingDAO: ${e}`,
      )
    }
  }

  /**
   * Finds a booking in the `bookings` collection
   * @param {string} _id - The _id of the desired booking
   * @return {Object | null} Returns either a single booking or nothing
   */
  static async getBooking(_id) {
    return await booking.findOne({ _id })
  }

  /**
   * Finds all booking in the `bookings` collection
   * @return {Object | null} Returns either all booking or nothing
   */
  static async getBookings() {
    return await booking.find({}).toArray()
  }

  /**
   * Adds a booking to the `bookings` collection
   * @param {BookingInfo} bookingInfo - The information of the booking to add
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addBooking(bookingInfo) {
    const { name, stations } = bookingInfo
    try {
      await booking.insertOne({ name, stations }, { w: "majority" })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while adding new booking, ${e}.`)
      return { error: e }
    }
  }

  /**
   * Removes a booking from the `bookings` collections
   * @param {string} _id - The _id of the booking to delete
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteBooking(_id) {
    try {
      const result = await booking.deleteOne({ _id })
      if (!result) {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      } else {
        return { success: true }
      }
    } catch (e) {
      console.error(`Error occurred while deleting booking, ${e}`)
      return { error: e }
    }
  }

  /**
   * Marks a booking cancelled in the `bookings` collections
   * @param {string} _id - The _id of the booking to cancel
   * @return {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async cancelBooking(_id) {
    try {
      const result = await booking.UpdateOne(
        { _id },
        { $set: { cancelled: true } },
      )
      if (!result) {
        console.error(`Cancellation unsuccessful`)
        return { error: `Cancellation unsuccessful` }
      } else {
        return { success: true }
      }
    } catch (e) {
      console.error(`Error occurred while deleting booking, ${e}`)
      return { error: e }
    }
  }
}
