

// Hide show myDIV function
function hideFunction() {
    "use strict";
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
var Stations = function(data) {
    "use strict";
    this.name = ko.observable(data.name);
    this.marker = ko.observable(data.marker);
};
var ViewModel = function() {
    "use strict";
    var self = this;
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

    //add for indexOF
    //    function viewModel() {
    //    var self = this;
        self.places = ko.observableArray(somelocations);
     //   this.filter = ko.observable();
     //
        var place = item.marker;
        this.visiblePlaces = ko.computed(function() {
            return this.places().filter(function(place) {
                if (!self.filter() || place.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1)
                    return place;
            });
        }, this);



        // if (markerLoaded) {
        //     if (!filter) {
        //         for (var i = 0; i < self.locationList().length; i++) {
        //             self.locationList()[i].marker.setVisible(true);
        //             self.locationList()[i].marker.setAnimation(null);
        //         }
        //         return self.locationList();
        //     } else {
        //         return ko.utils.arrayFilter(self.locationList(),
        //             function(item) {
        //                 var result = stringStartsWith(item.name()
        //                     .toLowerCase(), filter);
        //                 if (result) {
        //                     if (item.marker) {
        //                         item.marker.setVisible(true);
        //                     }
        //                 } else {
        //                     if (item.marker) {
        //                         item.marker.setVisible(false);
        //                     }
        //                 }
        //                 return result;
        //             });
        //     }
        // } else {
        //     return self.locationList();
        // }
    });
};
// var stringStartsWith = function(string, startsWith) {
//     string = string || "";
//     if (startsWith.length > string.length) {
//         return false;
//     }
//     return string.substring(0, startsWith.length) === startsWith;
// };
var vm = new ViewModel();
ko.applyBindings(vm);
