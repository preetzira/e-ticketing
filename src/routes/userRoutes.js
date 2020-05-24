import UserController from "../db/controllers/userController"

module.exports = function () {
  return {
    setupRouting: async function (router) {
      router.post("/user/register", UserController.register)
      router.post("/user/login", UserController.login)
    },
  }
}
