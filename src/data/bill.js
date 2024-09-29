var billing = angular.module("billingProcess", []);

billing.controller("billCtrl", function ($scope, $http) {
  $scope.currentDate = new Date();

  // Fetch items from the backend
  $http
    .get("http://localhost:3000/items")

    .then(function (response) {
      $scope.items = response.data;
      $scope.filteredItems = [];
    })
    .catch(function (error) {
      console.error("Error fetching items:", error);
      alert("Could not fetch items. Please try again later.");
    });

  $scope.billedItems = [];
  $scope.customerName = "";
  $scope.mobileNumber = ""; // Add mobile number here
  $scope.amtReceived = 0;
  $scope.balanceAmt = 0;

  $scope.newItem = {
    sno: 1,
    itemName: "",
    quantity: 1.0,
    MRP: 0.0,
    Rate: 0.0,
  };

  $scope.$watch("newItem.itemName", function (newVal) {
    let item = $scope.items.find((item) => item.itemName === newVal);
    if (item) {
      $scope.newItem.MRP = item.MRP;
      $scope.newItem.Rate = item.Rate;
    } else {
      $scope.newItem.MRP = 0.0;
      $scope.newItem.Rate = 0.0;
    }
  });

  $scope.addItem = function () {
    if ($scope.newItem.itemName && $scope.newItem.quantity > 0) {
      let index = $scope.items.findIndex(
        (item) => item.itemName === $scope.newItem.itemName
      );
      if (index !== -1) {
        let snoin = $scope.billedItems.length + 1;
        $scope.billedItems.push({
          sno: snoin,
          itemName: $scope.newItem.itemName,
          MRP: parseFloat($scope.newItem.MRP),
          Rate: parseFloat($scope.newItem.Rate),
          quantity: parseFloat($scope.newItem.quantity),
        });

        $scope.totalAmount = $scope.calculateTotal();
        $scope.updateBalance();
        $scope.newItem = {
          sno: snoin + 1,
          itemName: "",
          quantity: 1.0,
          MRP: 0.0,
          Rate: 0.0,
        };
        document.getElementById("itemNameInput").focus();
      } else {
        alert("Item not found or invalid input");
      }
    } else {
      alert("Please enter a valid item name and quantity.");
    }
  };

  $scope.removeItem = function (index) {
    $scope.billedItems.splice(index, 1);
    $scope.billedItems.forEach((item, idx) => {
      item.sno = idx + 1;
    });
    $scope.newItem.sno = $scope.billedItems.length + 1;
    $scope.totalAmount = $scope.calculateTotal();
    $scope.updateBalance();
  };

  $scope.calculateTotal = function () {
    return $scope.billedItems.reduce(function (total, item) {
      return total + item.Rate * item.quantity;
    }, 0);
  };

  $scope.updateBalance = function () {
    $scope.balanceAmt = $scope.amtReceived - $scope.totalAmount || 0;
  };

  $scope.$watch("amtReceived", function () {
    $scope.updateBalance();
  });

  $scope.filteredItems = [];
  $scope.selectedIndex = -1;

  $scope.filterItems = function () {
    var query = $scope.newItem.itemName.toLowerCase();
    $scope.filteredItems = $scope.items.filter(function (item) {
      return item.itemName.toLowerCase().includes(query);
    });
    if ($scope.filteredItems.length > 0) {
      $scope.selectedIndex = 0; // Highlight the first item
    } else {
      $scope.selectedIndex = -1;
    }
  };

  $scope.selectItem = function (item) {
    $scope.newItem.itemName = item.itemName;
    $scope.filteredItems = []; // Clear the dropdown after selection
    $scope.selectedIndex = -1; // Reset selected index
  };

  $scope.handleKeydown = function (event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if ($scope.selectedIndex < $scope.filteredItems.length - 1) {
        $scope.selectedIndex++;
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if ($scope.selectedIndex > 0) {
        $scope.selectedIndex--;
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (
        $scope.selectedIndex > -1 &&
        $scope.selectedIndex < $scope.filteredItems.length
      ) {
        $scope.selectItem($scope.filteredItems[$scope.selectedIndex]);
      }
    } else if (event.key === "Escape") {
      $scope.filteredItems = [];
      $scope.selectedIndex = -1;
    }
  };

  $scope.print = function () {
    var amtReceived = parseFloat($scope.amtReceived);
    var totalAmount = parseFloat($scope.totalAmount);
    var balanceAmount = parseFloat($scope.balanceAmt);

    if (isNaN(amtReceived) || isNaN(totalAmount) || isNaN(balanceAmount)) {
      alert("One or more values are not valid numbers.");
      return;
    }

    // Store additional information for printing
    localStorage.setItem("customerName", JSON.stringify($scope.customerName));
    localStorage.setItem("mobileNumber", JSON.stringify($scope.mobileNumber)); // Store mobile number
    localStorage.setItem("billedItems", JSON.stringify($scope.billedItems));
    localStorage.setItem("totalAmount", totalAmount.toFixed(2));
    localStorage.setItem("amountReceived", amtReceived.toFixed(2));
    localStorage.setItem("balanceAmount", balanceAmount.toFixed(2));

    window.location.href = "billItem.html";
  };
});
