import React, {Component} from 'react';
import {render} from 'react-dom';

import {StaticMap} from 'react-map-gl';
import DeckGL, {LineLayer, ScatterplotLayer} from 'deck.gl';
import GL from 'luma.gl/constants';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data CSV
const basid_url = "https://data.cityofnewyork.us/resource/2yzn-sicd.json?"
const limit = "$limit=1000&"
const time = "$where=pickup_datetime between '2015-10-02T21:00:00' and '2015-10-02T21:30:00'"
const app_token = "$$app_token=3njIZDVTxGRWHGJSkxO5d348o"
const DATA_URL = {
  CAB_PATHS: basid_url + limit + time
  // 'https://data.cityofnewyork.us/resource/2yzn-sicd.json?$limit=500000&$where=pickup_datetime%20between%20%272015-09-18T21:00:00%27%20and%20%272015-09-18T21:30:00%27'
};

export const INITIAL_VIEW_STATE = {
  latitude: 40.70,
  longitude: -74,
  zoom: 12,
  maxZoom: 16,
  pitch: 50,
  bearing: 0
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredObject: null
    };
    this._onHover = this._onHover.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
  }

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }

  _renderTooltip() {
    const {x, y, hoveredObject} = this.state;
    return (
      hoveredObject && (
        <div className="tooltip" style={{left: x, top: y}}>
          <div>{hoveredObject.pickup_datetime || hoveredObject.dropoff_datetime}</div>
        </div>
      )
    );
  }

  _renderLayers() {
    const {
      cabPaths = DATA_URL.CAB_PATHS,
    } = this.props;

    return [
      new LineLayer({
        id: 'cabs-paths',
        data: cabPaths,
        getStrokeWidth: 0.8,
        fp64: false,
        getSourcePosition: d => {
            return [parseFloat(d.pickup_longitude), parseFloat(d.pickup_latitude)];
        },
        getTargetPosition: d => {
            return [parseFloat(d.dropoff_longitude), parseFloat(d.dropoff_latitude)]
        },
        getColor: [253, 128, 93],
        pickable: true,
        onHover: this._onHover
      })
    ];
  }

  render() {
    const {viewState, controller = true, baseMap = true} = this.props;
    return (
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
        pickingRadius={5}
        parameters={{
          blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
          blendEquation: GL.FUNC_ADD
        }}
      >
        {baseMap && (
          <StaticMap
            reuseMaps
            //mapStyle="mapbox://styles/mapbox/dark-v9"
            mapStyle="mapbox://styles/ychen1030/cjtl52qwc32781fnhqonbva1s"
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        )}

        {this._renderTooltip}
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
