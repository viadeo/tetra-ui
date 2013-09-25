tetra.controller.register('fakeMap', {
    scope:'fakeMap', // application name
    constr:function (me, app, page, orm) {

        'use strict';

        return {
            events:{
                controller:{
                    'maps: api loaded':function () {
                        // Simple Map
                        page
                            .notify("maps: set map", {
                                mapId: "maps-marker"
                            })
                            .notify("maps: set marker", {
                                mapId: "maps-marker",
                                title: "Paris, FR",
                                latLng: [48.856614,2.352222],
                                infoWindow : {
                                    content: "Paris, FR",
                                    event: "onload"
                                }
                            })
                            .notify("maps: set zoom", {
                                mapId: "maps-marker",
                                zoom: 15
                            }).notify("maps: set center", {
                                mapId: "maps-marker",
                                latLng: [48.856614,2.352222]
                            })
                        ;

                        // Advanced Map
                        page
                            .notify("maps: set map", {
                                mapId: "maps-markers"
                            })
                            .notify("maps: set marker", {
                                mapId: "maps-markers",
                                title: "San Francisco, CA",
                                latLng: [37.77493,-122.419416],
                                infoWindow : {
                                    content: "San Francisco, CA"
                                }
                            })
                            .notify("maps: set marker", {
                                mapId: "maps-markers",
                                title: "Toronto",
                                latLng: [43.653226,-79.383184],
                                infoWindow : {
                                    content: "Toronto"
                                }
                            })
                            .notify("maps: set marker", {
                                mapId: "maps-markers",
                                title: "Miami",
                                latLng: [25.788969,-80.226439],
                                infoWindow : {
                                    content: "Miami"                                }
                            })
                            .notify("maps: fit bounds", "maps-markers")
                        ;
                    }
                }
            },

            methods:{
                init:function () {
                    page.notify("maps: load api", {
                        version : "3",
                        language : "en"
                    });
                }
            }
        };
    }
});
