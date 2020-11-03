// Reservation Controller
App.controller('ReservationCtrl', ['$scope', '$rootScope', '$localStorage', '$window', 'VendorService', '$stateParams', 'urls',
    function ($scope, $rootScope, $localStorage, $window, VendorService, $stateParams, urls) {
    	 // $scope.dateSelected = false;
         $scope.helpers.uiBlocks('#main-block', 'state_loading');
        //get the Vendor 
		VendorService.GetReservationByToken($stateParams.session_token).then(function (data) {
		    $scope.reservation = data;
            $scope.vendor = data.vendor;
		    $scope.reservation.message = 'Reservation Successful!';

            // var name = $scope.reservation.vendor.name;
             var latitude = Number($scope.reservation.vendor.lat);
             var longitude = Number($scope.reservation.vendor.long);
            console.log(data);
            $scope.coordinates = 'query='+latitude+', '+longitude;
            //Get Vendor Image
            $scope.reservation.logogenurl = urls.BASE_API_SERVER+'storage/'+$scope.reservation.vendor.logo;

		    // Init Markers Map
            var initMapMarkers = function(){
                
                new GMaps({
                    div: '#js-map-markers',
                    lat: latitude,
                    lng: longitude,
                    zoom: 11,
                    scrollwheel: false,
                    mapTypeControl: false,
                }).addMarkers([
                    {lat: latitude, lng: longitude, title: name, animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>'+name+'</strong>'}},
                    
                ]);
            };

            initMapMarkers();     

        // $scope.helpers.uiBlocks('#my-block-body', 'state_normal');
        $scope.urlencoded = urls.BASE_APP+"success/token/"+$stateParams.session_token;


        $scope.helpers.uiBlocks('#main-block', 'state_normal');
      
	});        
        
    }
]);
