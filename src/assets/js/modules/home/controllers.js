// Reservation Controller
App.controller('HomeCtrl', ['$scope', '$rootScope', '$localStorage', '$window', 'VendorService', 'PickupService', '$stateParams', 'urls', 'MetaTagsService',
    function ($scope, $rootScope, $localStorage, $window, VendorService, PickupService, $stateParams, urls, MetaTagsService) {
    	 // $scope.dateSelected = false;
         $scope.helpers.uiBlocks('#main-block', 'state_loading');
         
        //get the Vendor 
		VendorService.GetByToken($stateParams.token).then(function (data) {
		    $scope.vendor = data;

            // Set the route tags
            MetaTagsService.setTags({
              'title': $scope.vendor.name,
              // OpenGraph
              'og:title': $scope.vendor.name,
              'og:description': 'Reserve a field or space in '+$scope.vendor.name,
              'og:image': $scope.vendor.logo,
              'og:image:width': '680',
              'og:image:height': '340',
              // Twitter
              'twitter:card': $scope.vendor.short_description,
              'twitter:site': '@zonasoccerus',
              'twitter:creator': '@zonasoccerus',
              'twitter:title': 'Reserve a field or space in '+$scope.vendor.name,
              'twitter:description': $scope.vendor.short_description,
              'twitter:image': $scope.vendor.logo,
            });
            // console.log(data);
            // var name = $scope.reservation.vendor.name;
             var latitude = Number($scope.vendor.lat);
             var longitude = Number($scope.vendor.long);
            
            $scope.coordinates = 'query='+latitude+', '+longitude;
            //Get Vendor Image
            $scope.logogenurl = urls.BASE_API_SERVER+'storage/'+$scope.vendor.logo;

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


       
        $scope.helpers.uiBlocks('#home-block', 'state_normal');

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

        // Init Rating
            var initRating = function(){
            // Set Default options
            jQuery.fn.raty.defaults.starType = 'i';

            // Init Raty on .js-rating class
            jQuery('.js-rating').each(function(){
                var ratingEl = jQuery(this);

                ratingEl.raty({
                    score: ratingEl.data('score') || $scope.vendor.rating,
                    number: ratingEl.data('number') || 5,
                    cancel: ratingEl.data('cancel') || false,
                    target: ratingEl.data('target') || false,
                    targetScore: ratingEl.data('target-score') || false,
                    precision: ratingEl.data('precision') || false,
                    cancelOff: ratingEl.data('cancel-off') || 'fa fa-fw fa-times text-danger',
                    cancelOn: ratingEl.data('cancel-on') || 'fa fa-fw fa-times',
                    starHalf: ratingEl.data('star-half') || 'fa fa-fw fa-star-half-o text-warning',
                    starOff: ratingEl.data('star-off') || 'fa fa-fw fa-star text-gray',
                    starOn: ratingEl.data('star-on') || 'fa fa-fw fa-star text-warning',
                    click: function(score, evt) {
                        // Here you could add your logic on rating click
                        // console.log('ID: ' + this.id + "\nscore: " + score + "\nevent: " + evt);
                    }
                });
            });
        };

        initRating();

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

        var el = document.getElementById('overlayBtn');

        if(checkoutButton){
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
        }
    
	});        
        
    }
]);