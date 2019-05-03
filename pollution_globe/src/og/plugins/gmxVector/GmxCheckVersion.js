/**
 * @module og/gmx/GmxCheckVersion
 */

'use strict';

import { ajax } from '../../ajax.js';
import { GmxVector } from './GmxVector.js';

const GmxCheckVersion = function (planet) {

    this._layerVersions = {};

    this.hostUrl = "//maps.kosmosnimki.ru/";

    this._layers = [];

    this._r = null;

    this._addLayer = function (layer) {
        this._layers.push(layer);
    };

    this._removeLayer = function (layer) {
        var i = this._layers.length;
        while (i--) {
            if (layer.isEqual(this._layers[i])) {
                this._layers.splice(i, 1);
                return;
            }
        }
    };

    planet.events.on("layeradd", function (l) {
        if (l.instanceName === "GmxVector") {
            if (l._visibility) {
                this._addLayer(l);
            }
        }
    }, this);

    planet.events.on("layerremove", function (l) {
        if (l.instanceName === "GmxVector") {
            this._removeLayer(l);
        }
    }, this);

    planet.events.on("layervisibilitychange", function (l) {
        if (l.instanceName === "GmxVector") {
            if (l._visibility) {
                this._addLayer(l);
            } else {
                this._removeLayer(l);
            }
            this._request();
        }
    }, this);

    planet.camera.events.on("moveend", function () {
        this._request();
    }, this);

    this._checkVersionSuccess = function (data, layersOrder) {
        var res = data.Result;
        for (var i = 0; i < layersOrder.length; i++) {
            layersOrder[i]._checkVersionSuccess(res[i]);
        }
    };

    this.abort = function () {
        if (this._r) {
            this._r.abort();
            this._r = null;
        }
    };

    this._request = function () {
        if (this._layers.length) {
            this._r && this._r.abort();
            var e = planet.getViewExtent();

            if (e) {
                
                e = e.inverseMercator();

                var zoom = planet.minCurrZoom,
                    bbox = [e.southWest.lon, e.southWest.lat, e.northEast.lon, e.northEast.lat];

                var layers = [],
                    _layersOrder = [];
                for (var i = 0; i < this._layers.length; i++) {
                    var li = this._layers[i];
                    if (li._extentMerc.overlaps(e) && li._gmxProperties) {
                        _layersOrder.push(li);
                        var p = { "Name": li._layerId, "Version": li._gmxProperties.LayerVersion || -1 };
                        if (li._gmxProperties.Temporal) {
                            p.dateBegin = parseInt(li._beginDate.getTime() / 1000.0);
                            p.dateEnd = parseInt(li._endDate.getTime() / 1000.0);
                        }
                        layers.push(p);
                    }
                }

                if (layers.length) {
                    var that = this;
                    //TODO: fetch
                    this._r = ajax.request(this.hostUrl + "Layer/CheckVersion.ashx", {
                        'type': "POST",
                        'responseType': "json",
                        'data': {
                            'WrapStyle': "None",
                            'bbox': bbox,
                            'srs': "3857",
                            'layers': layers,
                            'zoom': zoom,
                            'ftc': "osm"
                        },
                        'success': function (data) {
                            that._r = null;
                            that._checkVersionSuccess(data, _layersOrder);
                        },
                        'error': function (err) {
                            that._r = null;
                            console.log(err);
                        }
                    });
                }
            }
        }
    };

    this.getLayers = function () {
        return this._layers;
    };

    this.update = function () {
        this._request();
    };
};

export { GmxCheckVersion };