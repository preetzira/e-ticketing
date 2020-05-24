import {
  createRoute,
  fetchTrains,
  fetchCities,
} from '../../store/actions/admin_actions'

import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class RouteForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.dispatch(fetchCities())
    this.props.dispatch(fetchTrains())
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.admin.trains.length !== state.trains.length ||
      props.admin.cities.length !== state.cities.length
    ) {
      return {
        ...state,
        trains: props.admin.trains,
        cities: props.admin.cities,
      }
    }
    return null
  }

  state = {
    cities: [],
    trains: [],
    stationsFrom: [],
    stationsTo: [],
    routedata: {
      from: '',
      to: '',
      trains: [],
      pricing: [],
    },
  }

  setStations = (e) => {
    const {name, value} = e.target
    const idx = this.state.cities.findIndex((city) => city._id === value)

    this.setState((prevState) => ({
      ...prevState,
      [name]: [...prevState.cities[idx].stations],
      routedata: {
        ...prevState.routedata,
        [name.replace('stations', '').toLowerCase()]: '',
      },
    }))
  }

  setRouteInfo = (e) => {
    const {name, value} = e.target
    this.setState((prevState) => ({
      ...prevState,
      routedata: {
        ...prevState.routedata,
        [name]: value,
      },
    }))
  }

  setTrainsInfo = (e) => {
    const {selectedOptions} = e.target
    const trainsArray = Array.from(selectedOptions, (item) => item.value)
    const pricing = trainsArray.map((train) => ({
      train: this.state.trains.filter((t) => t._id === train),
      'Adult (18-50)': '',
      'Ladies (18-50)': '',
      'Kids (0-12)': '',
      'Senior citizen (50+)': '',
    }))
    this.setState((prevState) => ({
      ...prevState,
      routedata: {
        ...prevState.routedata,
        trains: trainsArray,
        pricing,
      },
    }))
  }

  setPricing = (e) => {
    const {name, value} = e.target
    const [id, category] = name.split('--')
    console.log({id, category})
    this.setState((prevState) => ({
      ...prevState,
      routedata: {
        ...prevState.routedata,
        pricing: prevState.routedata.pricing.map((item) => {
          if (item.train[0]._id === id) {
            item[category] = value
          }
          return item
        }),
      },
    }))
  }

  render() {
    const {routedata} = this.state
    const {history, dispatch} = this.props
    return (
      <div className="container" style={{marginTop: '100px'}}>
        <form
          action="#"
          onSubmit={(e) => {
            e.preventDefault()
            dispatch(createRoute(routedata, history))
          }}
        >
          <div className="row">
            <div className="col s12">
              <label htmlFor="from">From</label>
            </div>
            <div className="input-field col s6">
              <select
                className="browser-default"
                name="stationsFrom"
                defaultValue=""
                onChange={this.setStations}
              >
                <option value="" disabled>
                  City
                </option>
                {this.state.cities.map((city) => (
                  <option value={city._id} key={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field col s6">
              <select
                className="browser-default"
                name="from"
                onChange={this.setRouteInfo}
                value={this.state.routedata.from}
                required
              >
                <option value="" disabled>
                  Station
                </option>
                {this.state.stationsFrom.map(
                  ({stationName, stationCode}) =>
                    stationName + ' ' + stationCode !==
                      this.state.routedata.to && (
                      <option
                        value={stationName + ' ' + stationCode}
                        key={stationCode}
                      >
                        {stationName + ' ' + stationCode}
                      </option>
                    )
                )}
              </select>
            </div>
            <div className="col s12">
              <label htmlFor="to">To</label>
            </div>
            <div className="input-field col s6">
              <select
                className="browser-default"
                name="stationsTo"
                defaultValue=""
                onChange={this.setStations}
              >
                <option value="" disabled>
                  City
                </option>
                {this.state.cities.map((city) => (
                  <option value={city._id} key={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field col s6">
              <select
                className="browser-default"
                name="to"
                onChange={this.setRouteInfo}
                value={this.state.routedata.to}
                required
              >
                <option value="" disabled>
                  Station
                </option>
                {this.state.stationsTo.map(
                  ({stationName, stationCode}) =>
                    stationName + ' ' + stationCode !==
                      this.state.routedata.from && (
                      <option
                        value={stationName + ' ' + stationCode}
                        key={stationCode}
                      >
                        {stationName + ' ' + stationCode}
                      </option>
                    )
                )}
              </select>
            </div>
            <div className="input-field col s6">
              <select
                className="browser-default"
                name="trains"
                style={{height: '100px'}}
                onChange={this.setTrainsInfo}
                value={this.state.routedata.trains}
                required
                multiple
              >
                <option value="" disabled>
                  Trains
                </option>
                {this.state.trains.map((train) => (
                  <option value={train._id} key={train._id}>
                    {`${train.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="row"></div>
            {this.state.routedata.pricing.map((priceOf, index) => (
              <div className="input-field col s6" key={'pricing' + index}>
                <label>Price details for {priceOf.train[0].name}</label>
                <br />
                <br />
                {Object.keys(priceOf).map(
                  (name) =>
                    name !== 'train' && (
                      <div
                        className="input-field"
                        key={priceOf.train[0]._id + name}
                      >
                        <input
                          id={priceOf.train[0]._id + name}
                          name={`${priceOf.train[0]._id}--${name}`}
                          type="number"
                          className="validate"
                          onChange={this.setPricing}
                          required
                        />
                        <label htmlFor={priceOf.train[0]._id + name}>
                          {name}
                        </label>
                      </div>
                    )
                )}
              </div>
            ))}
            <div className="col s12">
              <div className="input-field">
                <button
                  className="btn green waves-effect waves-light"
                  type="submit"
                  name="action"
                  style={{marginRight: '10px'}}
                >
                  Submit
                </button>
                <Link
                  className="btn red lighten-1 waves-effect waves-light"
                  to="/"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
  common: state.common,
})

export default connect(mapStateToProps)(RouteForm)
