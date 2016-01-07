/**
 * Created by Dudu on 30/12/2015.
 */
carentApp.controller('carsAvailable', ['$scope', '$uibModal', 'OrderService', 'carFactory', function ($scope, $uibModal, OrderService, carFactory) {

    $scope.carReturning = [];
    carFactory.get().success(function (response) {
        $scope.cars = response;
        OrderService.getActive().success(function (response) {
            $scope.orders = response;
            organizeData();
        });
    });

    function organizeData() {
        $scope.orders.forEach(function (element, index, array) {
            var orderedCar = getCarByNumber($scope.cars, element.carNumber)[0];
            if (orderedCar !== undefined) {
                $scope.cars = deleteCarByNumber($scope.cars, element.carNumber);
                orderedCar.returning = "";
                var now = new Date();
                var diffDays = 0;
                var diffHours = Math.round((Date.parse(element.endDate) - now.getTime()) / 3600000);
                if (diffHours > 24) {
                    diffDays = Math.floor(diffHours / 24);
                    diffHours = diffHours % 24;
                    orderedCar.returning =
                        diffDays.toString() + ((diffDays == 1) ? ' day ' : ' days ');
                }
                orderedCar.returning += (diffHours.toString() + ((diffHours == 1) ? ' hour' : ' hours'));
                $scope.carReturning.push(orderedCar);
            }
        });
    }

    function getCarByNumber(cars, number) {
        return cars.filter(function (car) {
            return car.number === number;
        });
    }

    function deleteCarByNumber(cars, number) {
        return cars.filter(function (car) {
            return car.number !== number;
        });
    }

    $scope.openModal = function (size, car) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/orderModal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                car: function () {
                    return car;
                }
            }
        });

        modalInstance.result.then(function (order) {
            OrderService.create(order);
            alert('Order Created');
        }, function () {
            alert('Order canceled');
        });
    };
}]);


carentApp.controller('ModalInstanceCtrlCar', function ($scope, $uibModalInstance, carNumber, price) {

    $scope.carNumber = carNumber;
    $scope.price = price;


    $scope.today = function () {
        var today = new Date();
        $scope.dt = new Date().toLocaleString();
        var tomorrow = new Date();
        tommorow = tomorrow.setDate(today.getDate() + 1);
        $scope.dtend = tomorrow.toLocaleString();
    };
    $scope.today();

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && (  date.getDay() === 6 ) );
    };

    $scope.ok = function () {
        var order = {
            startDate: $scope.dt,
            endDate: $scope.dtend,
            carNumber: $scope.carNumber,
            price: $scope.price
        };
        $uibModalInstance.close(order);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //
    //$scope.openEntryDateStart = function($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();
    //
    //    $scope.openedEntryDateStart = true;
    //};
    //
    //$scope.openEntryDateEnd = function($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();
    //
    //    $scope.openedEntryDateEnd = true;
    //};
    //

    //
    //$scope.clear = function () {
    //    $scope.dt = null;
    //};
    //
    //$scope.initDate = new Date('2016-15-20');
    //$scope.formats = ['yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
    ////$scope.formatEntryDate = $scope.formats[2];
    ////
    ////$scope.datepickerOptions = {
    ////    datepickerMode:"'year'",
    ////    minMode:"'year'",
    ////    minDate:"minDate",
    ////    showWeeks:"false",
    ////};
    //
    //$scope.datepickerEntryOptions = {
    //
    //};
});

