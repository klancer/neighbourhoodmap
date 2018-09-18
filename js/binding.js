var Stations = function(data) {
    "user strict";
    this.name = ko.observable(data.name);
    this.marker = ko.observable(data.marker);
};
var ViewModel = function() {
    "user strict";
    var self = this;
    //  for hamburger menu icon
    this.navClick = function() {
        var x = document.getElementById("myDIV");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        var y = document.getElementById("map-column");
        if (y.className === "col-sm-8") {
            y.className = "col-sm-12";
        } else {
            y.className = "col-sm-8";
        }
    }
    this.locationList = ko.observableArray([]);
    this.holdingList = ko.observableArray([]);
    MARKERS.forEach(function(stationItem) {
        self.locationList.push(new Stations(stationItem));
    });
    this.showMarkerInfo = function(name) {
        var trigger = name.name();
        google.maps.event.trigger(markersArray[trigger], 'click');
    };
    // Filter Function (includes Marker functions that are handled via Knockout's computed observable)
    this.filter = ko.observable("");
    // Computed observable from Knockout which filters out arrays and markers from the input
    this.filterSearch = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (markerLoaded) {
            if (!filter) {
                for (i = 0; i < self.locationList().length; i += 1) {
                    self.locationList()[i].marker.setVisible(true);
                    self.locationList()[i].marker.setAnimation(null);
                }
                return self.locationList();
            } else {
                return ko.utils.arrayFilter(self.locationList(),
                    function(item) {
                        var result = item.name().toLowerCase().indexOf(
                                self.filter().toLowerCase()) !==
                            -1;
                        if (result) {
                            if (item.marker) {
                                item.marker.setVisible(true);
                            }
                        } else {
                            if (item.marker) {
                                item.marker.setVisible(false);
                            }
                        }
                        return result;
                    });
            }
        } else {
            return self.locationList();
        }
    });
};
var vm = new ViewModel();
ko.applyBindings(vm);