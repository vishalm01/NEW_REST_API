const app = angular.module("adminPanel", []);

app.controller("adminCtrl", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $scope.items = [];
    $scope.newItem = {};
    $scope.isEditing = false; // Track if an item is being edited
    $scope.editingItemId = null; // To store the id of the item being edited

    // Function to fetch items from the database
    $scope.fetchItems = async function () {
      try {
        const response = await $http.get("http://localhost:3000/items");
        $scope.items = response.data;
        $scope.$apply(); // Ensure AngularJS updates the view
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    // Function to add a new item
    $scope.addItem = async function () {
      if ($scope.isEditing) {
        // If editing, call update function
        $scope.updateItem();
        return;
      }

      // If not editing, add a new item
      try {
        const response = await $http.post(
          "http://localhost:3000/items/create",
          $scope.newItem
        );
        $scope.items.push(response.data); // Add item to the array dynamically
        $scope.newItem = {}; // Clear input fields
        $scope.$apply(); // Ensure AngularJS updates the view
      } catch (error) {
        console.error("Error adding item:", error);
      }
    };

    // Function to edit an existing item (pre-fill the form)
    $scope.editItem = function (item) {
      $scope.newItem = angular.copy(item); // Copy item data to the form
      $scope.isEditing = true; // Set editing mode to true
      $scope.editingItemId = item._id; // Store the id of the item being edited
    };

    // Function to update an existing item
    $scope.updateItem = async function () {
      try {
        const response = await $http.put(
          `http://localhost:3000/items/${$scope.editingItemId}`,
          $scope.newItem
        );

        // Update the item in the items array dynamically
        const index = $scope.items.findIndex(
          (item) => item._id === $scope.editingItemId
        );
        if (index !== -1) {
          $scope.items[index] = response.data;
        }

        // Clear the form and reset the editing mode
        $scope.newItem = {};
        $scope.isEditing = false;
        $scope.editingItemId = null;
        $scope.$apply(); // Ensure AngularJS updates the view
      } catch (error) {
        console.error("Error updating item:", error);
      }
    };

    // Function to delete an item
    $scope.deleteItem = async function (itemId) {
      try {
        await $http.delete(`http://localhost:3000/items/${itemId}`);
        // Dynamically remove the deleted item from the array
        $scope.items = $scope.items.filter((item) => item._id !== itemId);
        alert("An item has been deleted");
        $scope.$apply(); // Ensure AngularJS updates the view
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };

    // Initial fetch of items
    $scope.fetchItems();
  },
]);
