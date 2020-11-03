// Reservation Controller
App.controller('VendorCtrl', ['$scope', '$rootScope', '$localStorage', '$window', 'VendorService', '$stateParams', 'urls',
    function ($scope, $rootScope, $localStorage, $window, VendorService, $stateParams, urls) {
    	 $scope.dateSelected = false;
         $scope.helpers.uiBlocks('#main-block', 'state_loading');
        //get the Vendor 
		VendorService.GetByToken($stateParams.token).then(function (data) {
            console.log(data);
		    $scope.vendor = data;
            var name = $scope.vendor.name;
            var latitude = Number($scope.vendor.lat);
            var longitude = Number($scope.vendor.long);
            $scope.reservationDate = new Date();
                console.log($scope.reservationDate);

            //Get Vendor Rating
            $scope.vendor.rating =  parseInt(data.ratings.average);
            $scope.vendor.count =  parseInt(data.ratings.count);

            //Get Vendor Image
            $scope.vendor.logogenurl = urls.BASE_API_SERVER+'storage/'+data.logo;
            


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
            var loadHours = function(date){
                if(!$scope.selectedspace){

                     $.notify({
                      // options
                      icon: 'glyphicon glyphicon-warning-sign',
                      message: 'Please select a space.'
                    },{
                      // settings
                      type: 'warning',
                      allow_dismiss: true,
                      delay: 5000,
                      icon_type: 'class',
                      animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                      },
                    });


                }else{

                    //get VendorSpace PriceID
                    VendorService.GetVendorspaceStripePriceID($scope.selectedspace).then(function(data){
                        console.log('priceid');
                        
                        $scope.stripe_price_id = data;
                        console.log($scope.stripe_price_id);

                    });
                    $scope.dateSelected = true;
                    $scope.helpers.uiBlocks('#my-block', 'state_loading');

                    const dat = new Date(date);
                    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
                    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(dat);

                    var formatteddate = day+'-'+month+'-'+year;

                    VendorService.GetHoursByDay($scope.selectedspace, formatteddate).then(function (data) {
                    console.log('gethoursby day');
                    $scope.hours = data;
                    console.log(data);

                    jQuery('#btnSubmit').prop('disabled', true);

                    $scope.helpers.uiBlocks('#my-block', 'state_normal');

                    });

                }
                
            }

            //Space Selection
            $scope.newValue = function(value) {
                 jQuery('#datepicker-reserve').datepicker('update', '');
                 $scope.selectedspace = value;
                 //get VendorSpace PriceID
                    VendorService.GetVendorspaceStripePriceID(value).then(function(data){
                        console.log('priceid');
                        $scope.stripe_price_id = data;
                        console.log($scope.stripe_price_id);

                    });
                 var date = new Date();
                 loadHours(date);
            }

            //Init DatePicker
            jQuery.fn.datepicker.defaults.format = "mm/dd/yyyy";
            var initDatePicker = function(){

                jQuery('#datepicker-reserve').datepicker({
                    startDate: new Date(),
                    todayHighlight: true,
                    format: 'mm/dd/yyyy',
                })
                .on('changeDate', function(e) {
                // `e` here contains the extra attributes
                // console.log(e);
                $scope.reservationDate = e.date;
                console.log($scope.reservationDate);
               loadHours(e.date);
                
                });

            }
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

        function getKeyByValue(object, value) { 
            for (var prop in object) { 
                if (object.hasOwnProperty(prop)) { 
                    if (object[prop] === value) 
                    return prop; 
                } 
            } 
        } 

         function countOccurrences(arr,val) {
          var count = 0;
          for(var position=0, offset; (offset=arr.indexOf(val,position))!=-1; position=offset+1 ) count++;
          return count;
        }

        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        //Enable "ok button"
        $scope.insertedHour = function(hours) {
            console.log(hours);
            var size = Object.size(hours);
            console.log(size);
            
             $scope.selectedhours = {};
             ans = getKeyByValue(hours, true); 
             if (typeof ans !== 'undefined'){
                 $scope.quantity = countOccurrences(Object.values(hours), true);
                 // console.log('ocurrences');
                 // console.log($scope.quantity);
                 for (const [key, value] of Object.entries(hours)) {
                  // console.log(`${key}: ${value}`);
                  if (`${value}` == 'true') {
                    // console.log(`${key}`);
                    $scope.selectedhours[`${key}`] = true;
                    // console.log($scope.selectedhours);

                  }

                }
                 jQuery('#btnSubmit').prop('disabled', false);
             } else {
                 jQuery('#btnSubmit').prop('disabled', true);
             }
        }

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

        initDatePicker();

        initRating();

        initMapMarkers();

        // $scope.helpers.uiBlocks('#my-block-body', 'state_normal');
        $scope.helpers.uiBlocks('#main-block', 'state_normal');

        
        //create Stripe Chekout Session & Open Terms & conditions modal

        jQuery(document).on("click", "#btnSubmit", function () {
            console.log('en el scope');
            console.log($scope);
            var reservationDetails = $.param({
                    vendor_token: $stateParams.token,
                    vendor_id: $scope.vendor.id,
                    vendorspace_id: $scope.selectedspace,
                    reservation_date: $scope.reservationDate,
                    reservation_hours: JSON.stringify($scope.selectedhours),
                    hours_quantity: $scope.quantity,
                    stripe_price_id: $scope.stripe_price_id,
                    price:  $scope.price,
                });
            // console.log('reservationDetails');
            // console.log(reservationDetails);
            VendorService.GetStripeSessionID(reservationDetails).then(function (data) {
            $scope.sessionId = data.session_id;
            console.log('data sessionId');
            console.log(data);
            

        });

            jQuery('#modal-top').modal('show');
        }); 

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
