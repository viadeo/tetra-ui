/*! tetra-ui v1.4.0 - 2013 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("api", {
    scope: "maps",
    constr: function(me, app, page) {
        return {
            events: {
                view: {
                    "maps: load api": function(api) {
                        me.methods.loadscript(api);
                    },
                    "maps: api loaded": function(api) {
                        page.notify("maps: api loaded", api);
                    }
                },
                controller: {
                    "maps: load api": function(api) {
                        me.methods.loadscript(api);
                    }
                }
            },
            methods: {
                init: function() {},
                loadscript: function(api) {
                    var key = api.key ? api.key : "", version = api.version ? api.version : "3", language = api.language ? api.language : "", libraries = api.libraries ? api.libraries : "", url = "http://maps.googleapis.com/maps/api/js?", script = document.createElement("script");
                    script.type = "text/javascript", script.src = url + "key=" + key + "&v=" + version + "&language=" + language + "&libraries=" + libraries + "&sensor=false&callback=mapsApiLoaded", 
                    document.body.appendChild(script), window.mapsApiLoaded = function() {
                        tetra.controller.notify("maps: api loaded", api, "maps");
                        try {
                            delete window.mapsApiLoaded;
                        } catch (e) {}
                    };
                }
            }
        };
    }
}), tetra.controller.register("geocode", {
    scope: "maps",
    constr: function() {
        return {
            events: {
                controller: {
                    "maps: geocode": function(params) {
                        if ("undefined" != typeof google) {
                            var geocoder = new google.maps.Geocoder();
                            if ("undefined" != typeof params.address) geocoder.geocode({
                                address: params.address
                            }, function(results, status) {
                                return status !== google.maps.GeocoderStatus.OK ? params.cbk(null) : params.cbk(results[0]);
                            }); else if ("undefined" != typeof params.latLng) {
                                var latlng = new google.maps.LatLng(params.latLng[0], params.latLng[1]);
                                geocoder.geocode({
                                    location: latlng
                                }, function(results, status) {
                                    return status !== google.maps.GeocoderStatus.OK ? params.cbk(null) : params.cbk(results[1].formatted_address);
                                });
                            }
                        }
                    }
                }
            }
        };
    }
}), tetra.controller.register("itinerary", {
    scope: "maps",
    constr: function(me, app, page) {
        return {
            events: {
                controller: {
                    "maps: api loaded": function() {
                        me.directionsDisplay = {}, me.directionsService = {};
                    },
                    "maps: set itinerary": function(params) {
                        if ("undefined" != typeof google) {
                            var origin = params.origin, destination = params.destination, mode = params.mode, mapId = params.mapId, cbk = params.cbk;
                            me.methods.start_service(params);
                            var request = {
                                origin: origin,
                                destination: destination,
                                travelMode: google.maps.TravelMode[mode],
                                durationInTraffic: !0
                            };
                            me.directionsDisplay[mapId].setDirections({
                                routes: []
                            }), me.directionsService.route(request, function(result, status) {
                                status === google.maps.DirectionsStatus.OK && me.directionsDisplay[mapId].setDirections(result), 
                                cbk(result, status);
                            });
                        }
                    },
                    "maps: unset itinerary": function(id) {
                        me.directionsDisplay[id].setDirections({
                            routes: []
                        });
                    }
                }
            },
            methods: {
                start_service: function(params) {
                    me.directionsDisplay[params.mapId] || (me.directionsService = new google.maps.DirectionsService(), 
                    page.notify("maps: get map", {
                        mapId: params.mapId,
                        cbk: function(map) {
                            me.directionsDisplay[params.mapId] = new google.maps.DirectionsRenderer(), me.directionsDisplay[params.mapId].setMap(map), 
                            params.panelId && me.directionsDisplay[params.mapId].setPanel(document.getElementById(params.panelId));
                        }
                    }));
                }
            }
        };
    }
}), tetra.controller.register("map", {
    scope: "maps",
    constr: function(me) {
        return {
            events: {
                controller: {
                    "maps: api loaded": function(api) {
                        me.maps = {}, me.markers = {}, me.infoWindow = {}, me.center = {}, me.bounds = {}, 
                        me.markerPath = api.marker || "/v_img/global/marker.png";
                    },
                    "maps: set map": function(params) {
                        if ("undefined" != typeof google) {
                            var options = {
                                zoom: 12,
                                zoomControl: !0,
                                streetViewControl: !0,
                                streetViewControlOptions: {
                                    position: google.maps.ControlPosition.RIGHT_TOP
                                },
                                zoomControlOptions: {
                                    style: google.maps.ZoomControlStyle.SMALL
                                },
                                mapTypeControl: !1,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            }, map = new google.maps.Map(document.getElementById(params.mapId), options);
                            me.markers[params.mapId] = [], me.center[params.mapId] = map.getCenter(), me.bounds[params.mapId] = new google.maps.LatLngBounds(), 
                            me.maps[params.mapId] = map, me.infoWindow[params.mapId] = new google.maps.InfoWindow({
                                maxWidth: 300,
                                pixelOffset: new google.maps.Size(-10, 0)
                            }), google.maps.visualRefresh = !0, me.methods.setStyle_314(map), document.getElementById(params.mapId).style.lineHeight = "normal";
                        }
                    },
                    "maps: set options": function(params) {
                        me.maps[params.mapId].setOptions(params.options);
                    },
                    "maps: get map": function(params) {
                        params.cbk(me.maps[params.mapId]);
                    },
                    "maps: set marker": function(params) {
                        var marker = new google.maps.Marker({
                            map: me.maps[params.mapId],
                            position: new google.maps.LatLng(params.latLng[0], params.latLng[1]),
                            title: params.title
                        });
                        marker.setIcon(me.methods.getIcons().icon()), marker.setShape(me.methods.getIcons().shape()), 
                        params.infoWindow && me.methods.setInfoWindow({
                            mapId: params.mapId,
                            marker: marker,
                            content: params.infoWindow.content,
                            event: params.infoWindow.event
                        }), me.bounds[params.mapId].extend(new google.maps.LatLng(params.latLng[0], params.latLng[1])), 
                        me.markers[params.mapId].push(marker), params.cbk && params.cbk(marker);
                    },
                    "maps: unset marker": function(marker) {
                        marker.setMap(null);
                    },
                    "maps: unset markers": function(id) {
                        for (var markers = me.markers[id], i = 0, l = markers.length; l > i; i++) markers[i].setMap(null);
                    },
                    "maps: get markers": function(params) {
                        params.cbk(me.markers[params.mapId]);
                    },
                    "maps: set center": function(params) {
                        me.maps[params.mapId].setCenter(new google.maps.LatLng(params.latLng[0], params.latLng[1])), 
                        me.center[params.mapId] = me.maps[params.mapId].getCenter();
                    },
                    "maps: fit bounds": function(id) {
                        me.markers[id].length > 0 && (me.maps[id].fitBounds(me.bounds[id]), google.maps.event.addListenerOnce(me.maps[id], "bounds_changed", function() {
                            me.maps[id].setZoom(Math.min(12, Math.max(2, me.maps[id].getZoom())));
                        }), me.center[id] = me.bounds[id].getCenter());
                    },
                    "maps: set bounds": function(params) {
                        me.bounds[params.mapId] = new google.maps.LatLngBounds(params.latLng[0], params.latLng[1]);
                    },
                    "maps: set zoom": function(params) {
                        me.maps[params.mapId].setZoom(params.zoom);
                    },
                    "maps: set infoWindow": function(params) {
                        me.methods.setInfoWindow(params);
                    }
                }
            },
            methods: {
                setInfoWindow: function(params) {
                    google.maps.event.addListenerOnce(me.maps[params.mapId], "idle", function() {
                        "string" == typeof params.content && "" !== params.content && (google.maps.event.addListener(params.marker, "click", function() {
                            me.infoWindow[params.mapId].setContent(params.content), me.infoWindow[params.mapId].open(me.maps[params.mapId], params.marker);
                        }), google.maps.event.addListener(me.infoWindow[params.mapId], "closeclick", function() {
                            me.maps[params.mapId].panTo(me.center[params.mapId]);
                        }), "string" == typeof params.event && "onload" === params.event && setTimeout(function() {
                            google.maps.event.trigger(params.marker, "click");
                        }, 100));
                    });
                },
                getIcons: function() {
                    return {
                        icon: function() {
                            return new google.maps.MarkerImage(me.markerPath, new google.maps.Size(50, 45), new google.maps.Point(0, 0), new google.maps.Point(25, 45));
                        },
                        shape: function() {
                            return {
                                coord: [ 22, 0, 25, 1, 28, 2, 29, 3, 30, 4, 32, 5, 32, 6, 33, 7, 34, 8, 35, 9, 35, 10, 35, 11, 36, 12, 36, 13, 36, 14, 37, 15, 37, 16, 37, 17, 37, 18, 37, 19, 37, 20, 37, 21, 37, 22, 36, 23, 36, 24, 36, 25, 35, 26, 35, 27, 35, 28, 34, 29, 33, 30, 33, 31, 32, 32, 32, 33, 31, 34, 30, 35, 30, 36, 29, 37, 29, 38, 28, 39, 27, 40, 27, 41, 26, 42, 26, 43, 25, 44, 24, 45, 24, 46, 23, 47, 23, 48, 22, 49, 19, 50, 18, 50, 15, 49, 14, 48, 14, 47, 13, 46, 13, 45, 12, 44, 11, 43, 11, 42, 10, 41, 10, 40, 9, 39, 8, 38, 8, 37, 7, 36, 7, 35, 6, 34, 5, 33, 5, 32, 4, 31, 4, 30, 3, 29, 2, 28, 2, 27, 2, 26, 1, 25, 1, 24, 1, 23, 0, 22, 0, 21, 0, 20, 0, 19, 0, 18, 0, 17, 0, 16, 0, 15, 1, 14, 1, 13, 1, 12, 2, 11, 2, 10, 2, 9, 3, 8, 4, 7, 5, 6, 5, 5, 7, 4, 8, 3, 9, 2, 12, 1, 15, 0, 22, 0 ],
                                type: "poly"
                            };
                        }
                    };
                },
                setStyle_314: function(map) {
                    var viadeoStyles = [ {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [ {
                            hue: "#ff8800"
                        }, {
                            gamma: 1
                        }, {
                            saturation: -87
                        }, {
                            lightness: 29
                        } ]
                    }, {
                        featureType: "road",
                        elementType: "geometry.fill",
                        stylers: [ {
                            lightness: 100
                        } ]
                    }, {
                        featureType: "road.highway",
                        elementType: "labels",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.icon",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "road.local",
                        elementType: "labels.icon",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "administrative.locality",
                        elementType: "labels.icon",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "poi",
                        elementType: "geometry.fill",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            hue: "#d9ccbe"
                        } ]
                    }, {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            lightness: 0
                        }, {
                            color: "#c8df9f"
                        } ]
                    } ];
                    map.setOptions({
                        styles: viadeoStyles
                    });
                },
                setStyle: function(map) {
                    var viadeoStyles = [ {
                        featureType: "landscape",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "landscape.natural",
                        elementType: "geometry",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            color: "#e8e0d8"
                        } ]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [ {
                            color: "#73b6e6"
                        } ]
                    }, {
                        featureType: "water",
                        elementType: "labels",
                        stylers: [ {
                            color: "#2a75aa"
                        } ]
                    }, {
                        featureType: "water",
                        elementType: "labels.text.stroke",
                        stylers: [ {
                            lightness: 100
                        }, {
                            weight: 2
                        } ]
                    }, {
                        featureType: "road",
                        elementType: "geometry.fill",
                        stylers: [ {
                            lightness: 100
                        } ]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [ {
                            hue: "#ff8800"
                        }, {
                            gamma: 1
                        }, {
                            saturation: -87
                        }, {
                            lightness: 29
                        } ]
                    }, {
                        featureType: "road.highway",
                        elementType: "labels",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry.fill",
                        stylers: [ {
                            lightness: 100
                        } ]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry.stroke",
                        stylers: [ {
                            hue: "#ff8800"
                        }, {
                            gamma: 1
                        }, {
                            saturation: -87
                        }, {
                            lightness: 29
                        } ]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.text.fill",
                        stylers: [ {
                            color: "#000000"
                        } ]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.text.stroke",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            hue: "0xffffff"
                        }, {
                            lightness: 100
                        }, {
                            weight: 2.5
                        } ]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.icon",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "road.local",
                        elementType: "labels.text.fill",
                        stylers: [ {
                            color: "#7a7a7a"
                        } ]
                    }, {
                        featureType: "road.local",
                        elementType: "labels.icon",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "administrative.country",
                        elementType: "geometry",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            color: "#5b5b5b"
                        }, {
                            weight: .5
                        } ]
                    }, {
                        featureType: "administrative.country",
                        elementType: "labels.text.stroke",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            lightness: 100
                        }, {
                            weight: 3
                        } ]
                    }, {
                        featureType: "administrative.locality",
                        elementType: "labels.icon",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "administrative.locality",
                        elementType: "labels.text.stroke",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            lightness: 100
                        }, {
                            weight: 4.9
                        } ]
                    }, {
                        featureType: "poi",
                        elementType: "geometry.fill",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            color: "#d9ccbe"
                        } ]
                    }, {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [ {
                            visibility: "off"
                        } ]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [ {
                            visibility: "on"
                        }, {
                            lightness: 0
                        }, {
                            color: "#c8df9f"
                        } ]
                    } ];
                    map.setOptions({
                        styles: viadeoStyles
                    });
                }
            }
        };
    }
}), tetra.controller.register("places", {
    scope: "maps",
    constr: function() {
        return {
            events: {
                controller: {
                    "maps: places": function() {
                    }
                }
            },
            methods: {
                init: function() {}
            }
        };
    }
});