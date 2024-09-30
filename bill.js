var billing = angular.module("billingProcess", []);

billing.controller("billCtrl", function ($scope, $http) {
  $scope.currentDate = new Date();
  $scope.currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

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
    _id: null,
    name: "",
    quantity: 1.0,
    mrp: 0.0,
    rate: 0.0,
  };

  $scope.$watch("newItem.name", function (newVal) {
    let item = $scope.items?.find((item) => item.name === newVal);
    if (item) {
      $scope.newItem._id = item._id; // Assign MongoDB _id
      $scope.newItem.mrp = item.mrp;
      $scope.newItem.rate = item.rate;
    } else {
      $scope.newItem._id = null;
      $scope.newItem.mrp = 0.0;
      $scope.newItem.rate = 0.0;
    }
  });

  $scope.addItem = function () {
    if (
      $scope.newItem.name &&
      $scope.newItem.quantity > 0 &&
      $scope.newItem._id
    ) {
      let index = $scope.items.findIndex(
        (item) => item.name === $scope.newItem.name
      );
      if (index !== -1) {
        $scope.billedItems.push({
          _id: $scope.newItem._id, // Use MongoDB _id
          name: $scope.newItem.name,
          mrp: parseFloat($scope.newItem.mrp),
          rate: parseFloat($scope.newItem.rate),
          quantity: parseFloat($scope.newItem.quantity),
        });

        $scope.totalAmount = $scope.calculateTotal();
        $scope.updateBalance();
        $scope.newItem = {
          _id: null,
          name: "",
          quantity: 1.0,
          mrp: 0.0,
          rate: 0.0,
        };
        document.getElementById("nameInput").focus();
      } else {
        alert("Item not found or invalid input");
      }
    } else {
      alert("Please enter a valid item name, quantity, and item.");
    }
  };

  $scope.removeItem = function (index) {
    $scope.billedItems.splice(index, 1);
    $scope.totalAmount = $scope.calculateTotal();
    $scope.updateBalance();
  };

  $scope.calculateTotal = function () {
    return $scope.billedItems.reduce(function (total, item) {
      return total + item.rate * item.quantity;
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
    var query = $scope.newItem.name.toLowerCase();
    $scope.filteredItems = $scope.items.filter(function (item) {
      return item.name.toLowerCase().includes(query);
    });
    if ($scope.filteredItems.length > 0) {
      $scope.selectedIndex = 0; // Highlight the first item
    } else {
      $scope.selectedIndex = -1;
    }
  };

  $scope.selectItem = function (item) {
    $scope.newItem.name = item.name;
    $scope.newItem._id = item._id; // Assign the MongoDB _id
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
    if (!$scope.customerName || !$scope.mobileNumber) {
      alert("Please add customer details before proceeding.");
      return;
    }

    // Prepare customer data
    const customerData = {
      name: $scope.customerName,
      mobileNumber: $scope.mobileNumber,
    };

    var amtReceived = parseFloat($scope.amtReceived);
    var totalAmount = parseFloat($scope.totalAmount);
    var balanceAmount = parseFloat($scope.balanceAmt);

    if (isNaN(amtReceived) || isNaN(totalAmount) || isNaN(balanceAmount)) {
      alert("One or more values are not valid numbers.");
      return;
    }

    const orderData = {
      name: $scope.customerName,
      phoneno: $scope.mobileNumber,
      totalAmount: totalAmount,
      amountReceived: amtReceived,
      balanceAmount: balanceAmount,
      cart: $scope.billedItems.map((item) => ({
        itemId: item._id, // Use MongoDB _id
        quantity: item.quantity,
      })),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    $http
      .post("http://localhost:3000/orders/create", orderData)
      .then(function (response) {
        console.log("Order saved successfully:", response.data);
        // Redirect to billItem.html if needed
        alert("BILL ADDED TO DATABASE");
      })
      .catch(function (error) {
        console.error("Error saving order:", error);
        alert("Error saving order. Please try again.");
      });

    console.log(JSON.stringify(orderData));

    // window.location.href = "bill"
  };
});
