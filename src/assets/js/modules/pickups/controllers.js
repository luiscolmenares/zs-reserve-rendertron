// Reservation Controller
App.controller('PickupsCtrl', ['$scope', 
								'$localStorage', 
								'$window', 
								'VendorService',
								'$stateParams',
    function ($scope, 
    		  $localStorage, 
    		  $window, 
    		  VendorService, 
    		  $stateParams) {

    	//Get Pickups by Vendor
    	VendorService.GetFuturePickupsByVendorToken($stateParams.token).then(function (data){
    		$scope.vendor = data;
    		console.log(data);
    	});
        
    }
]);
