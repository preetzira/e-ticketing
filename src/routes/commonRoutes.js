import CommonController from "../db/controllers/commonController"

module.exports = function () {
  return {
    setupRouting: async function (router) {
      router.get("/city", CommonController.getCities)
      router.get("/route", CommonController.getRoute)
      router.get("/train", CommonController.getTrain)
      router.get("/cities", CommonController.getCities)
      router.get("/trains", CommonController.getTrains)
      router.get("/routes", CommonController.getRoutes)
      router.post("/cities/create", CommonController.createCity)
      router.post("/trains/create", CommonController.createTrain)
      router.post("/routes/create", CommonController.createRoute)
      router.get("/login-status", CommonController.getLoginStatus)
      router.post("/logout", CommonController.logout)
    },
  }
}
