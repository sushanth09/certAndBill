(function () {

	'use strict';

    /**
     * Defines application-wide key value pairs
     **/

	myApp.constant('config', {
		ENVIRONMENT_LOCAL: "local",
		ENVIRONMENT_SERVER: "server"
	});

	myApp.constant('responseStatus', {
		STATUS_FAILED: "failed",
		STATUS_SUCCESS: "success"
	});

	myApp.constant('localconfig', {
		LOGIN_URL: 'app/Data/login.json',
		LOGOUT_URL: 'app/Data/home.json',
		METHOD_POST: 'POST'
	});

	myApp.constant('serverconfig', {
		LOGIN_URL: APP_API_URL + 'controller/login.php',
		LOGOUT_URL: APP_API_URL + 'controller/logout.php',
		DASHBOARD_URL: APP_API_URL + 'controller/admin.php',
		METHOD_POST: 'POST'
	});

	myApp.constant('appConstants', {
		SUCCESS: "success",
		ERROR: "error",
		EVENTS: {
			OPEN_MODAL: "OPEN_MODAL",
			CLOSE_MODAL: "CLOSE_MODAL"
		},
		CUST_PRIORITY: [],
		PRIORITY: [],
		AUTO_FLOW: [],
		FIELDS: [],
		NAV_BAR_CONFIG: {
			USER_MANAGEMENT: "User Management"
		},

		ROLES: {},
		ACTIONS: [],
		REQUEST_SUBMITTED_TEXT: "Request submitted successfully!",
		UPPER_CASE_CHARS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
		LOWER_CASE_CHARS: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
		ADMIN_PROCESS_DESCIPTION_CHARS: [' ', ',', '.', '-'],
		ADMIN_DOCUMENT_TYPE_MASTER_CHARS: [' ', '-', '.'],
		MONTH : [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN','JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ],
		NUMBERS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
		SPECIAL_CHARACTERS: ['-'],
		COMMENT_SPECIAL_CHARACTERS: ['-', '.', '@', '$', '%', '/', '&', '*', '+', '='],
		ENCRY_CODE: "SMS!2#",
		SESSION_TIMEOUT_POPUP: 120000,
	});

	myApp.constant('appRegEx', {
	});
})();