(function () {
    'use strict';

    angular
            .module('app')
            .factory('VendorService', VendorService);

    VendorService.$inject = ['$http', 'urls'];
    function VendorService($http, urls) {
        var service = {};

        // service.GetAll = GetAll;
        service.GetByToken = GetByToken;
        service.GetPickupsByVendorToken = GetPickupsByVendorToken;
        service.GetFuturePickupsByVendorToken = GetFuturePickupsByVendorToken;
        service.GetHoursByDay = GetHoursByDay;
        service.GetStripeSessionID = GetStripeSessionID;
        service.GetVendorspaceStripePriceID = GetVendorspaceStripePriceID;
        service.GetReservationByToken = GetReservationByToken;
        // service.GetByUsername = GetByUsername;
        // service.GetLoggedUser = GetLoggedUser;
        service.CreatePlayer = CreatePlayer;
        // service.Update = Update;
        // service.Delete = Delete;
        // service.GetUsersCount = GetUsersCount;
        // service.AttachRole = AttachRole;
        // service.AttachOrganization = AttachOrganization;
        // service.GetMenuItems = GetMenuItems;

        return service;

        // function GetAll() {
        //     return $http.get(urls.BASE_API + 'users').then(handleSuccess, handleError('Error getting all users'));
        // }

        function GetByToken(token) {
            return $http.get(urls.BASE_API + 'vendor/token/' + token).then(handleSuccess, handleError('Error getting vendor by token'));
        }

        function GetPickupsByVendorToken(token) {
            return $http.get(urls.BASE_API + 'vendor/pickups/token/' + token).then(handleSuccess, handleError('Error getting vendor pickups by token'));
        }

        function GetFuturePickupsByVendorToken(token) {
            return $http.get(urls.BASE_API + 'vendor/fpickups/token/' + token).then(handleSuccess, handleError('Error getting vendor pickups by token'));
        }

        function GetHoursByDay(vendorspace_id, date) {

            return $http.get(urls.BASE_API + 'vendorspace/availability/space/'+vendorspace_id+'/date/' + date).then(handleSuccess, handleError('Error getting schedule'));
        }

         function GetStripeSessionID(reservationdetails) {
                 var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            return $http.post(urls.BASE_API + 'stripe/checkoutsessionid', reservationdetails, config).then(handleSuccess, handleError('Error getting Checkout session ID'));
        }

        function GetReservationByToken(token) {
            return $http.get(urls.BASE_API + 'reservation/token/' + token).then(handleSuccess, handleError('Error getting Reservation by token'));
        }

        function GetVendorspaceStripePriceID(vendorspace_id) {
            return $http.get(urls.BASE_API + 'vendorspace/priceid/' + vendorspace_id).then(handleSuccess, handleError('Error getting Vendorspace Price ID'));
        }

        // function GetByUsername(username) {
        //  return $http.get(urls.BASE_API + 'user/username/' + username).then(handleSuccess, handleError('Error getting user by username'));
        // }

        // function GetLoggedUser(username) {
        //  return $http.get(urls.BASE_API + 'getloggeduser').then(handleSuccess, handleError('Error getting loggeduser'));
        // }

        // function CreatePlayer(player) {
        //     var config = {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        //         }
        //     };
        //     // console.log('user--->');
        //     // console.log(user);
        //     return $http.post(urls.BASE_API + 'public/client/create', player, config).then(handleSuccess, handleError('Error creating player'));
        // }

        function CreatePlayer(player) {
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            return $http.post(urls.BASE_API+'public/player/create', player, config).then(handleSuccess, handleError('Error creating player'));
        }

        // function Update(user, userId) {
        //     var config = {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        //         }
        //     };
        //     return $http.post(urls.BASE_API + 'user/edit/' + userId, user, config).then(handleSuccess, handleError('Error updating user'));
        // }

        // function Delete(id) {
        //     return $http.delete(urls.BASE_API + 'user/delete/' + id).then(handleSuccess, handleError('Error deleting user'));
        // }

        // function GetUsersCount() {
        //     return $http.get(urls.BASE_API + 'users/count').then(handleSuccess, handleError('Error counting users'));
        // }

        // function AttachRole(userId, roleName) {
        //     return $http.get(urls.BASE_API + 'users/' + userId + '/roles/' + roleName).then(handleSuccess, handleError('Error attaching role'));
        // }

        // function AttachOrganization(userId, organizationId) {
        //     return $http.get(urls.BASE_API + 'user/' + userId + '/organization/' + organizationId).then(handleSuccess, handleError('Error attaching organization'));
        // }

        // function GetMenuItems(roleId) {
        //     return $http.get(urls.BASE_API + 'menu/' + roleId).then(handleSuccess, handleError('Error getting menuitems by Role id'));
        // }

// private functions

        function handleSuccess(res) {
//console.log('success!');
            return res.data;
        }

        function handleError(error) {
//console.log('failed!');
            return function () {
                return {success: false, message: error};
            };
        }
    }

})();

// Create and register the new "users" service
// App.factory('users', ['$http', 'urls', function ($http, urls) {

//         return {
//             fetchUsers: function (callback) {
//                 $http.get(urls.BASE_API + "users")
//                         .then(function (response) {
//                             // console.log('fetching users');
//                             // console.log(response);
//                             callback(response.data.users);
//                         });

//             }
//         };
//     }]);