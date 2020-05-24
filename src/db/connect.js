import adminDAO from "./daos/admin/admins"
import citiesDAO from "./daos/common/cities"
import routesDAO from "./daos/common/routes"
import trainsDAO from "./daos/common/trains"
import bookingsDAO from "./daos/user/bookings"
import usersDAO from "./daos/user/users"

import { MongoClient } from "mongodb"

MongoClient.connect(process.env.MONGO_URI, {
  poolSize: 50,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  wtimeout: 2500,
})
  .catch((err) => {
    console.error(err.stack)
  })
  .then(async (client) => {
    await adminDAO.injectDB(client, "admin")
    await citiesDAO.injectDB(client, "cities")
    await routesDAO.injectDB(client, "routes")
    await trainsDAO.injectDB(client, "trains")
    await bookingsDAO.injectDB(client, "bookings")
    await usersDAO.injectDB(client, "users")
  })
