myApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("login");
    $stateProvider
		.state('login', {
			url: "/login",
			controller: "loginController",
			templateUrl: "app/Views/login.html"
		})
		.state('home', {
			url: "/home",
			controller: "homeController",
			templateUrl: "app/Views/home.html"
		})
		.state('user', {
			url: "/user",
			controller: "userController",
			templateUrl: "app/Views/user/user.html"
		})
		.state('userAdmin', {
			url: "/userAdmin",
			controller: "userAdminController",
			templateUrl: "app/Views/admin/userAdmin.html",
			params: {data: null}
		})
		.state('admin', {
			url: "/admin",
			controller: "adminController",
			templateUrl: "app/Views/admin/admin.html",
			params: {data: null}
		})
		.state('userManagement', {
			url: "/userManagement",
			controller: "userManagementController",
			templateUrl: "app/Views/management/userManagement.html",
			params: {data: null}
		})
		.state('applicationConfiguration', {
			url: "/applicationConfiguration",
			controller: "configurationController",
			templateUrl: "app/Views/admin/configuration.html",
			params: {data: null}
		})
		.state('nbfc', {
			url: "/nbfc",
			controller: "nbfcController",
			templateUrl: "app/Views/management/nbfc.html",
			params: {data: null}
		});

});