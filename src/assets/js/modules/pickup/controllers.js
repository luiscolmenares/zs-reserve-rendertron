// Reservation Controller
App.controller('PickupCtrl', ['$scope', '$rootScope', '$localStorage', '$window', 'VendorService', 'PickupService', '$stateParams', 'urls',
    function ($scope, $rootScope, $localStorage, $window, VendorService, PickupService, $stateParams, urls) {
    	 // $scope.dateSelected = false;
         $scope.helpers.uiBlocks('#main-block', 'state_loading');
        //get the Vendor 
		PickupService.GetByToken($stateParams.token).then(function (data) {
		    $scope.pickup = data;
            $scope.vendor = data.vendor;
            console.log(data);
            // var name = $scope.reservation.vendor.name;
             var latitude = Number($scope.pickup.vendor.lat);
             var longitude = Number($scope.pickup.vendor.long);
            
            $scope.coordinates = 'query='+latitude+', '+longitude;
            //Get Vendor Image
            $scope.pickup.logogenurl = urls.BASE_API_SERVER+'storage/'+$scope.pickup.vendor.logo;

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
        $scope.urlencoded = urls.BASE_APP+"success/pickup/token/"+$stateParams.token;


       
        $scope.helpers.uiBlocks('#main-block', 'state_normal');

        //create Stripe Chekout Session & Open Terms & conditions modal

        jQuery(document).on("click", "#btnSubmit", function () {
            console.log('en el scope');
            console.log($scope);
            var pickupDetails = $.param({
                    pickup_token: $stateParams.token,
                    pickup_id: $scope.pickup.id,
                    vendor_id: $scope.pickup.vendor.id,
                    vendorspace_id: $scope.pickup.vendorspace.id,
                    // price: $scope.pickup.vendorspace.price,
                    // reservation_date: $scope.reservationDate,
                    // reservation_hours: JSON.stringify($scope.selectedhours),
                    // hours_quantity: $scope.quantity,
                    // stripe_price_id: $scope.stripe_price_id
                });

            PickupService.GetStripeSessionID(pickupDetails).then(function (data) {
            $scope.sessionId = data.session_id;
            console.log('data sessionId');
            console.log(data);
            

        });

            jQuery('#modal-top').modal('show');
        }); 

         //Enable Terms Button

        $scope.termsChecked = function(){
            var isChecked = $('#terms').prop("checked");
             if (isChecked) {
                    jQuery('#checkout-button').prop('disabled', false);
                } else {
                    if($scope.sessionId !== null){
                        //enabling button after session id is available
                        jQuery('#checkout-button').prop('disabled', false);
                    }
                    
                }
        }

         // Create a Stripe client.
        var stripe = Stripe('pk_test_41mvEPM4sTDdLh3KDxTzSMNYmtEmTZy6TK7lbF8OLonzouZv801biuIa3k8ZNZF6wXZO1zJM82CewxMNlhXjvelF500aOlTFlvF');

        // var checkoutButton = document.getElementById('checkout-button-price_0HCPHxPM4sTDdLh3UoNpCXlL');

        var checkoutButton = document.getElementById('checkout-button');

        checkoutButton.addEventListener('click', function() {
          stripe.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as argument here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: $scope.sessionId,
          }).then(function (result) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
          });
        });

      
	});        
        
    }
]);
