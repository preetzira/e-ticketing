import citiesDAO from "../daos/common/cities"
import routesDAO from "../daos/common/routes"
import trainsDAO from "../daos/common/trains"

export default class CommonController {
  static async createCity(req, res) {
    try {
      if (!req.isAdmin()) {
        return res.send({
          error: "Access denied!, operation is for admin only",
        })
      }
      const { name = "", stations = [] } = req.body
      const errors = {}
      if (name.length < 3) {
        errors.name = "You must specify a name of at least 3 characters."
      }
      if (!stations.length) {
        errors.stations = "Can't add city with no stations"
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const insertResult = await citiesDAO.addCity({
        name,
        stations,
      })
      if (!insertResult.success) {
        errors.name = insertResult.error
        return res.send({ errors })
      }
      return res.send({
        log: "Inserion successful",
        flag: 143,
      })
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async createRoute(req, res) {
    console.log(req.body)
    try {
      const { from = "", to = "", pricing = {}, trains = [] } = req.body
      const errors = {}
      if (!from || !to || !trains.length || !Object.keys(pricing).length) {
        errors.params =
          "Missing Params!, You must specify all the required parameters"
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const insertResult = await routesDAO.addRoute({
        from,
        to,
        trains,
        pricing,
      })
      if (!insertResult.success) {
        errors.name = insertResult.error
        return res.send({ errors })
      }
      return res.send({
        log: "Inserion successful",
        flag: 143,
      })
    } catch (e) {
      console.log(e)
      return res.send({ error: e })
    }
  }

  static async createTrain(req, res) {
    try {
      const { name = "", available_classes = [], running_days = [] } = req.body
      const errors = {}
      if (!name || !available_classes.length || !running_days.length) {
        errors.params =
          "Missing Params!, You must specify all the required parameters"
      }

      if (Object.keys(errors).length > 0) {
        return res.send({ errors })
      }

      const insertResult = await trainsDAO.addTrain({
        name,
        available_classes,
        running_days,
      })
      if (!insertResult.success) {
        errors.name = insertResult.error
        return res.send({ errors })
      }
      return res.send({
        log: "Inserion successful",
        flag: 143,
      })
    } catch (e) {
      console.log(e)
      return res.send({ error: e })
    }
  }

  static async getCity(req, res) {
    try {
      const data = await citiesDAO.getCity(req.body.name)
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getRoute(req, res) {
    try {
      const { from, to } = req.body
      const data = await routesDAO.getRoute({ from, to })
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getTrain(req, res) {
    try {
      const data = await trainssDAO.getTrain(req.body.id)
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getCities(req, res) {
    try {
      const data = await citiesDAO.getCities()
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getRoutes(req, res) {
    try {
      const { from, to } = req.body
      const data = await routesDAO.getRoutes({ from, to })
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getTrains(req, res) {
    try {
      const data = await trainsDAO.getTrains()
      return res.send(data)
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async getLoginStatus(req, res) {
    try {
      if (req.isAuthenticated()) {
        return res.send({ userType: req.user.userType })
      } else return res.send({ userType: null })
    } catch (e) {
      return res.send({ error: e })
    }
  }

  static async logout(req, res) {
    try {
      const { token } = req.signedCookies
      res.cookie("token", "", {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now()),
      })
      res.send({
        success: true,
      })
    } catch (e) {
      return res.send({ error: e })
    }
  }
}
