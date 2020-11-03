// Reservation Controller
App.controller('PickupListCtrl', ['$scope', '$rootScope', '$localStorage', '$window', 'VendorService', '$stateParams', 'urls', '$state',
    function ($scope, $rootScope, $localStorage, $window, VendorService, $stateParams, urls, $state) {
    	 // $scope.dateSelected = false;
         $scope.optselected = true;

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

        // initDatePicker();


        //Checkbox options
        $scope.interests = ["Pickup", "Academy"];
        $scope.positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"];
        $scope.playtimes = ["Flexible", "Mornings", "Weekdays", "Weeknights"];
        $scope.checkboxSMS = {
           value : 0,
         };
         $scope.checkboxEmail = {
           value : 0,
         };


        // Selected options
        $scope.selectioninterests = [];
        $scope.selectionpositions = [];
        $scope.selectionplaytimes = [];

        // Toggle selection for a given option by name
        $scope.toggleSelectionInterests = function toggleSelectionInterests(interest) {
        var idx = $scope.selectioninterests.indexOf(interest);

        // Is currently selected
        if (idx > -1) {
          $scope.selectioninterests.splice(idx, 1);
        }

        // Is newly selected
        else {
          $scope.selectioninterests.push(interest);
        }

        // console.log('$scope.electionInterestsv');
        // console.log($scope.selectioninterests);
        };

        $scope.toggleSelectionPositions = function toggleSelectionPositions(position) {
        var idx = $scope.selectionpositions.indexOf(position);

        // Is currently selected
        if (idx > -1) {
          $scope.selectionpositions.splice(idx, 1);
        }

        // Is newly selected
        else {
          $scope.selectionpositions.push(position);
        }

        // console.log('$scope.electionPositionsv');
        // console.log($scope.selectionpositions);
        };

        $scope.toggleSelectionPlaytimes = function toggleSelectionPlaytimes(playtime) {
        var idx = $scope.selectionplaytimes.indexOf(playtime);

        // Is currently selected
        if (idx > -1) {
          $scope.selectionplaytimes.splice(idx, 1);
        }

        // Is newly selected
        else {
          $scope.selectionplaytimes.push(playtime);
        }

        console.log('$scope.selectionplaytimes');
        console.log($scope.selectionplaytimes);
        };

        // $scope.helpers.uiBlocks('#my-block-body', 'state_normal');
        $scope.helpers.uiBlocks('#main-block', 'state_normal');

        
        //create Stripe Chekout Session & Open Terms & conditions modal

        jQuery(document).on("click", "#btnSubmit", function () {
            // console.log('en el scope');
            // console.log($scope);
            // var reservationDetails = $.param({
            //         vendor_token: $stateParams.token,
            //         vendor_id: $scope.vendor.id,
            //         vendorspace_id: $scope.selectedspace,
            //         reservation_date: $scope.reservationDate,
            //         reservation_hours: JSON.stringify($scope.selectedhours),
            //         hours_quantity: $scope.quantity,
            //         stripe_price_id: $scope.stripe_price_id,
            //         price:  $scope.price,
            //     });
            // console.log('reservationDetails');
            // console.log(reservationDetails);
        //     VendorService.GetStripeSessionID(reservationDetails).then(function (data) {
        //     $scope.sessionId = data.session_id;
        //     console.log('data sessionId');
        //     console.log(data);
            

        // });
           

            jQuery('#modal-top').modal('show');
        }); 

        // Init Bootstrap Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
        var initValidationBootstrap = function(){
            jQuery('.js-validation-player').validate({
                ignore: [],
                errorClass: 'help-block animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                    elem.closest('.help-block').remove();
                },
                success: function(e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: {
                    'val-vendor-id': {
                        required: true,
                    
                    },
                   
                    'val-name': {
                        required: true,
                        minlength: 3
                    },
                    'val-email': {
                        required: true,
                        email: true
                    },
                    'val-phoneus': {
                        required: true,
                        phoneUS: true
                    },
                    'val-zipcode': {
                        required: true,
                        minlength: 3
                    },
                    
                    
                    
                                      
                },
                messages: {
                    'val-vendor-id': 'Please select vendor',
                    'val-name': {
                        required: 'Please enter player name',
                        minlength: 'The player name must consist of at least 3 characters'
                    },
                    'val-email': 'Please enter a valid email address',
                    'val-phoneus': 'Please enter a US mobile phone!',
                    
                    'val-zipcode': {
                        required: 'Please enter player zipcode',
                        minlength: 'The player zipcode must consist of at least 3 characters'
                    },
                    
                    
                    
                }
            });
        };

        // Init Bootstrap Forms Validation
        initValidationBootstrap();

        var checkoutButton = document.getElementById('checkout-button');

        checkoutButton.addEventListener('click', function() {
            console.log('en el scope');
            console.log($scope.vendor.id);

            jQuery('#modal-top').modal('hide');

             var player = $.param({
                vendor_id: $scope.vendor.id,
                name: $('#val-name').val(),
                email: $('#val-email').val(),
                phone: $('#val-phoneus').val(),
                zipcode: $('#val-zipcode').val(),
                // vendor_id: $('#val-vendor-id').val(),
                birthdate: $('#val-birthdate').val(),
                skill_level: $('#val-skill-level').val(),
                interest: $scope.selectioninterests.toString(),
                preferred_position: $scope.selectionpositions.toString(),
                preferred_playtime: $scope.selectionplaytimes.toString(),
                sms_notifications: $scope.checkboxSMS.value,
                email_notifications: $scope.checkboxEmail.value,
                
            });

             VendorService.CreatePlayer(player).then(function(response){

                if (response.success == false) {
                  // swal("Error Creating new player", "", "error");
                  $.notify({
                              // options
                              icon: 'fa fa-warning',
                              message: 'There was a problem adding to the pickup list.'
                            },{
                              // settings
                              type: 'danger',
                              allow_dismiss: true,
                              delay: 5000,
                              icon_type: 'class',
                              animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                              },
                            });
                  } else {
                    // swal("New player has been created", "", "success");
                    $.notify({
                              // options
                              icon: 'fa fa-check-circle',
                              message: 'Added to Pickup List!.'
                            },{
                              // settings
                              type: 'success',
                              allow_dismiss: true,
                              delay: 5000,
                              icon_type: 'class',
                              animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                              },
                            });
                    $state.go('listsuccess', {
                                token: $scope.vendor.token,
                                redirect: true,
                            });
                    // $state.go('listsuccess(token: vendor.token)', {redirect: true});
                  } 
              });

             console.log(player);
         
      });


      
	});        
        
    }
]);
