import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";


const MAP_API = process.env.MAP_API

const Map = withScriptjs(withGoogleMap((props) =>{  
  const courts = props.courts  
  const center = courts[0].the_geom.coordinates[0][0][0]
    return (
      <GoogleMap zoom={14} center={ { lat:  center[1]*1, lng: center[0]*1 } } >
        {courts.map((court) => {
          const coord = court.the_geom.coordinates[0][0][0];
          return(
            <div key={ court.id }>
              <Marker key={court.objectid} position={{lat: coord[1]*1, lng: coord[0]*1}} onClick={(ev)=>{
                props.setCourt(ev,court)
                props.handleMarkers(court)
              }}
              />
              {props.selectedCourt === court && (
                <InfoWindow
                // marker= {props.marker}
                
                 onCloseClick={() => {
                   this.setState({selectedCourt: null})
                 }}
                 position={{
                    lat: coord[1]*1,
                    lng: coord[0]*1
                 }}
              >
                <div>
                  <h5>Court: {court.objectid}</h5>
                  <p>Court Type: {court.dimensions}</p>
                  <p>Zip Code: {court.zipcode}</p>
                </div>
              </InfoWindow>
              )}
                
             
            </div>
          )
        })}
      </GoogleMap>
    )  
}))

export default class CourtMap extends React.Component{
  constructor(){
    super()
    this.state ={
      selectedCourt: null,
      selectedMarker: null
    }
    this.setCourt = this.setCourt.bind(this)
  }

  setCourt(ev,court){
    if(this.state.selectedCourt === court){
      this.setState({selectedCourt: null})
    }
    this.setState({selectedCourt: court, selectedMarker: ev.target})
  }

  

  render(){
    return (
      <div className="map-container">
        <Map
           courts={this.props.courts}
           handleMarkers = {this.props.handleMarkers}
           marker= {this.state.selectedMarker}
           selectedCourt={this.state.selectedCourt}
           setCourt={this.setCourt}
           googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
           loadingElement={<div style={{ height: `100%` }} />}
           containerElement={<div style={{ height: `400px`, width: `100%` }} />}
           mapElement={<div style={{ height: `100%` }} />}
        />
       </div>
    )
  }
}
