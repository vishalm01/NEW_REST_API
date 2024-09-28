// admin.js

const app = angular.module('adminPanel', []);

app.controller('adminCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.items = [];
    $scope.newItem = {};

    // Function to fetch items from the database
    $scope.fetchItems = async function() {
        try {
            const response = await $http.get('http://localhost:3000/items'); // Adjust the URL as needed
            $scope.items = response.data;
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    // Function to add a new item
    $scope.addItem = async function() {
        try {
            const response = await $http.post('http://localhost:3000/items', $scope.newItem);
            $scope.items.push(response.data);
            $scope.newItem = {}; // Clear the input fields
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Function to edit an existing item
    $scope.editItem = function(item) {
        $scope.newItem = angular.copy(item); // Copy item data to the newItem for editing
    };

    // Function to delete an item
    $scope.deleteItem = async function(itemId) {
        try {
            await $http.delete(`http://localhost:3000/items/${itemId}`);
            $scope.items = $scope.items.filter(item => item._id !== itemId);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Initial fetch of items
    $scope.fetchItems();
}]);
