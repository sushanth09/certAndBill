myApp.directive('inputValidator', function ($parse) {
    return {
        scope: {
            validValues: '=validValues',
            firstCharvalidValues: '=firstCharValidValues',
            otherCharvalidValues: '=otherCharValidValues',
            inputFieldName: '=inputFieldName',
            inputFieldValue: '=ngModel'
        },
        link: function (scope, elm, attrs) {
            elm.bind('keypress', function (e) {
                // debugger;
                var char = String.fromCharCode(e.which || e.charCode || e.keyCode), matches = [];
                if (scope.inputFieldName === 'userName' || scope.inputFieldName === 'searchUserId') {

                    if (scope.inputFieldValue == undefined || scope.inputFieldValue === "" || scope.inputFieldValue.length === 0) {

                        angular.forEach(scope.firstCharvalidValues, function (value, key) {

                            char = char.toUpperCase();

                            if (char === value)
                                matches.push(char);
                        }, matches);


                    } else {
                        angular.forEach(scope.otherCharvalidValues, function (value, key) {
                            char = char.toUpperCase();
                            if (char === value)
                                matches.push(char);
                        }, matches);


                    }
                } else if (scope.inputFieldName === 'minAmount' || scope.inputFieldName === 'maxAmount'
                        || scope.inputFieldName === 'customerId' || scope.inputFieldName === 'accNo') {

                    angular.forEach(scope.validValues, function (value, key) {

                        char = char.toUpperCase();

                        if (char === value)
                            matches.push(char);
                    }, matches);


                } else if (scope.inputFieldName === 'currency') {

                    angular.forEach(scope.validValues, function (value, key) {

                        char = char.toUpperCase();

                        if (char === value)
                            matches.push(char);
                    }, matches);


                } else {
                    //****************Edited by AI**************//
                    //if(scope.inputFieldName === 'tradeTypeChar' || scope.inputFieldName === 'categoryChar' 
                    // || scope.inputFieldName === 'processCodeChar' || scope.inputFieldName === 'processSubcodeChar' ) {

                    angular.forEach(scope.validValues, function (value, key) {
                        char = char.toUpperCase();
                        if (char === value)
                            matches.push(char);
                    }, matches);

                    //}
                    //******************************************//

                }


                if (matches.length === 0) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    };
});