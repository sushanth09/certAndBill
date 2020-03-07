myApp.controller('userAdminController', ['busyNotificationService', '$timeout', '$scope', '$uibModal', '$filter', '$location', '$window', '$rootScope', '$state', 'appConstants', 'modalService', '$stateParams', 'userManagementService',
    function(busyNotificationService, $timeout, $scope, $uibModal, $filter, $location, $window, $rootScope, $state, appConstants, modalService, $stateParams, userManagementService) {
        $scope.stateAction = "userManagement";
        $scope.userAdminPage = true;
        
        $scope.changeSubMenutab = function(subMenuType) {
            $scope.stateAction = subMenuType;
        }

        $scope.setBackgroundColor = function(id, bgColor, txtColor) {
            $("#" + id).css("background-color", bgColor);
            $("#" + id).css("color", txtColor);
        }

        $scope.validateUserCreate = function(elementID) {
            var passError = false;
            if (elementID == "createNewUserName") {
                if ($scope.userName != undefined && $scope.userName.length != "") {
                    $scope.setBackgroundColor("createNewUserName", appConstants.BG_COLOR_WHITE, appConstants.TXT_COLOR_BLACK);
                } else {
                    passError = true;
                    $scope.setBackgroundColor("createNewUserName", appConstants.BG_COLOR_DANGER, appConstants.TXT_COLOR_WHITE);
                }
            }

            if (elementID == "createNewUserMobile") {
                var mobileregex = /^[0]?[789]\d{9}$/;
                $scope.mobileToolTip = "";
                if (mobileregex.test($scope.mobileNumber)) {
                    $scope.mobileToolTip += "<span><i class='fa fa-check-circle' style='color:green'></i> Please enter 10 digit mobile number</span><br/>";
                    $scope.setBackgroundColor("createNewUserMobile", appConstants.BG_COLOR_WHITE, appConstants.TXT_COLOR_BLACK);
                } else {
                    passError = true;
                    $scope.mobileToolTip += "<span><i class='fa fa-warning' style='color:red'></i> Please enter 10 digit mobile number</span><br/>";
                    $scope.setBackgroundColor("createNewUserMobile", appConstants.BG_COLOR_DANGER, appConstants.TXT_COLOR_WHITE);
                }
            }

            if (elementID == "createNewUserID") {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                $scope.emailToolTip = "";
                if (regex.test($scope.emailID)) {
                    $scope.emailToolTip += "<span><i class='fa fa-check-circle' style='color:green'></i> Please enter a valid email address</span><br/>";
                    $scope.setBackgroundColor("createNewUserID", appConstants.BG_COLOR_WHITE, appConstants.TXT_COLOR_BLACK);
                } else {
                    passError = true;
                    $scope.emailToolTip += "<span><i class='fa fa-warning' style='color:red'></i> Please enter a valid email address</span><br/>";
                    $scope.setBackgroundColor("createNewUserID", appConstants.BG_COLOR_DANGER, appConstants.TXT_COLOR_WHITE);
                }
            }

            if (elementID == "createNewUserRoles") {
                if ($scope.roles != "" && $scope.roles != undefined) {
                    $scope.setBackgroundColor("createNewUserRoles", appConstants.BG_COLOR_WHITE, appConstants.TXT_COLOR_BLACK);
                } else {
                    passError = true;
                    $scope.setBackgroundColor("createNewUserRoles", appConstants.BG_COLOR_DANGER, appConstants.TXT_COLOR_WHITE);
                }
            }

            var mobileregex = /^[0]?[789]\d{9}$/;
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if ((!checkEmptyField($scope.mobileNumber) && (mobileregex.test($scope.mobileNumber))) && (!checkEmptyField($scope.emailID) && (regex.test($scope.emailID))) && (!checkEmptyField($scope.userName)) && (!checkEmptyField($scope.roles))) {
                $scope.allowCreateUser = true;
            } else {
                $scope.allowCreateUser = false;
            }
        }
    }
])