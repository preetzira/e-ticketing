import AdminController from "../db/controllers/adminController"

module.exports = function () {
  return {
    setupRouting: async function (router) {
      router.post("/admin/register", AdminController.register)
      router.post("/admin/login", AdminController.login)
    },
  }
}
