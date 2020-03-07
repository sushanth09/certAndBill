var jsEncode = {
	encode: function (s, k) {
		var enc = "";
		var str = "";
		// make sure that input is string
		str = s.toString();
		for (var i = 0; i < s.length; i++) {
			// create block
			var a = s.charCodeAt(i);
			// bitwise XOR
			var b = a ^ k;
			enc = enc + String.fromCharCode(b);
		}
		return enc;
	}
};
//var e = jsEncode.encode(JSON.stringify(d),"123");

function addressInput(val) {
	return val.replace(/[^a-zA-Z0-9 \\#\\`\\:\\.\\,\\&\\(\\)\\-]/g, '').substring(0, 50);
}

function amountVal(val) {
	if (val.match(/^\d{1,20}(\.\d{0,4})?$/)) {

	} else {
		val = val.replace(/[^\d.]/g, '');
		inputVal = val.split(".");
		valueBeforeDecimal = inputVal[0].substring(0, 20);
		if (inputVal.length > 1) {
			valueAfterDecimal = inputVal[1].substring(0, 4);
			val = valueBeforeDecimal + "." + valueAfterDecimal;
		} else {
			val = valueBeforeDecimal;
		}
	}
	return val;
}

function clearErrMessage(value) {
	if (!checkEmptyField(value)) {
		document.getElementById(value).innerHTML = "";
	}
}

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

function getAge(value) { //value=>  dd-mm-yyyy
	var dateStr = value.split("-")[1] + "-" + value.split("-")[0] + "-" + value.split("-")[2];
	var date = new Date(dateStr);
	var today = new Date();
	var diff = Math.floor((today - date) / 31557600000);
	return diff;
}

function smallCase(val) {
	return val.toLowerCase().replace(/\s/g, '');
}
function upperCase(val) {
	return val.toUpperCase();
}
function decimalInput(val) {
	return val.replace(/(\..*)\./g, '.');
}
function replaceMultipleWhiteSpace(val) {
	return val.replace(/\s\s+/g, ' ');

}

function toProperCase(value) {
	value = value.toLowerCase();
	var value = value.split(" ");
	for (var i = 0; i < value.length; i++) {
		var j = value[i].charAt(0).toUpperCase();
		value[i] = j + value[i].substr(1);
	}
	return value.join(" ");
}

function bankNameValid(val) {
	return val.replace(/[^a-zA-Z ',.&-]/g, '').substring(0, 100)
}

function emailInput(val) {
	val = val.toLowerCase();
	return val.replace(/[^a-zA-Z0-9\\@\\.\\_\\-]/g, '').substring(0, 150);
}

function isWebsite(val) {
	return val.replace(/[^a-zA-Z\\.\\_\\-\\@]/g, '').substring(0, 50);
}

function alphaNumericInput(val) {
	return val.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
}

function otpInput(val) {
	return val.replace(/[^0-9]/g, '').substring(0, 6);
}

function nameInput(val) {
	return val.replace(/[^a-zA-Z ]/g, '').substring(0, 50);
}

function accountNumber(val) {
	return val.replace(/[^0-9]/g, '').substring(0, 20);
}

function nameValidate(val) {
	return val.replace(/[a-zA-Z ',.()&-]/g, '').substring(0, 50);
}

function mobileInput(val) {
	return val.replace(/[^0-9]/g, '').substring(0, 10);
}

function pincode(val) {
	return val.replace(/^([1-9]{1}[0-9]{5})$/g, '').substring(0, 6);
}

function numberInput(val) {
	return val.replace(/[^0-9]/g, '');
}
function contractName(val) {
	return val.replace(/^[^-\s][a-zA-Z0-9_\s-]+$/);

}


function checkEmptyField(val) {
	return val == undefined || val == null || val === "";
}

function validateEmail(email) {
	var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	if (reg.test(email)) {
		return true; //valid email id
	} else {
		return false; // invalid email id
	}
}

function serverSideErrorMessViewer(messages) {
	for (var key in messages) {
		// check if the property/key is defined in the object itself, not in parent
		if (messages.hasOwnProperty(key)) {
			if (document.getElementById(key) !== null) {
				document.getElementById(key).innerHTML = messages[key];
			}
		}
	}
}

function clearErrorMessages(messages) {
	for (var key in messages) {
		// check if the property/key is defined in the object itself, not in parent
		if (messages.hasOwnProperty(key)) {
			if (document.getElementById(key) != null) {
				document.getElementById(key).innerHTML = "";
			}
		}
	}
}

function clearErrors(checkId, setId) {
	if (document.getElementById(checkId).value != "" && document.getElementById(checkId).value != undefined && document.getElementById(checkId).value != null) {
		document.getElementById(setId).innerHTML = "";
	}
}

function tanNo(tanVal) {
	return tanVal.substring(0, 10).toUpperCase();
}

function gstNo(gstVal) {
	return gstVal.substring(0, 15).toUpperCase();
}

function ifscNo(gstVal) {
	return gstVal.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 11);
}

function panNo(panVal) {
	return panVal.substring(0, 10).toUpperCase();
}

function capitalizeValue(value) {
	return value.toUpperCase();
}

function aadhar(aadharno) {
	/* var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ */
	//	$scope.regxPancard = /^\d{4}\s\d{4}\s\d{4}$/
	/* if (reg.test(aadharno)){
		return true; //valid email id
	}else{
		return false; // invalid email id
	} */
	return aadharno.replace(/^\d{4}\s\d{4}\s\d{4}$/g, '').substring(0, 12);
}

function validateAppAadharno(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/^[2-9]{1}[0-9]{11}$/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid Aadhar number";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter Aadhar number.";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function validateGstNo(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid GST number.";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter GST number.";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function validateCode(value) {
	if (/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(document.getElementById(checkId).value)) {
		document.getElementById(setId).innerHTML = "";
	} else {
		document.getElementById(setId).innerHTML = "Provide valid Website name.";
	}
}

function validateWebsite(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid Website name.";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter Website name.";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function validatePincode(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/^([1-9]{1}[0-9]{5})$/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid Pincode.";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter Pincode.";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function numberOnlyInput(val) {
	return val.replace(/[^\d]/g, '');
}

function allowNegativeNumber(val) {
	val = val.replace(/[^-\d]/g, '');
	val = val.split("-");
	if (val[0] == "") {
		val = val.join('');
		val = "-" + val;
	} else {
		val = val.join('');
	}
	return val;
}

function validatePancardno(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/^[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}$/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid Pan number.";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter Pan number.";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function validIFSCCode(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid IFSC number.";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter IFSC number.";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function percentOnlyInput(value) {
	value = value.replace(/[^\d.]/g, '');
	if (value == undefined || value == null || value == "" || value == ".") {
		return "";
	}
	if (parseFloat(value) > 100) {
		return Math.floor(parseInt(value) / 10).toString();
	} else if (parseFloat(value) == 100) {
		return parseInt(value).toString();
	}
	var valueArr = value.split(".");
	if (valueArr.length > 1) {
		if (valueArr[1].length > 2) {
			return value.substring(0, value.length - 1);
		}
		valueArr[0] += ".";
	}
	var result = valueArr.toString();
	result = result.replace(/,/g, "");
	if (valueArr.length > 1 && valueArr[1].length > 2) {
		if (result.charAt(result.length - 1) != ".") {
			var result = Math.floor((parseFloat(result) * 100).toFixed(1)) / 100;
		}
	}
	return result;
}
function decimalOnlyInput(value) {
	value = value.replace(/[^\d.]/g, '').substring(0, 10);
	if (value == undefined || value == null || value == "" || value == ".") {
		return "0";
	}
	var valueArr = value.split(".");
	if (valueArr.length > 1) {
		valueArr[0] += ".";
	}
	var result = valueArr.toString();
	result = result.replace(/,/g, "");
	if (result.charAt(result.length - 1) != ".") {
		var result = Math.floor((parseFloat(result) * 100).toFixed(4)) / 100;
	}
	return result;
}

function decimalInputRange(value) {
	value = value.replace(/[^\d.]/g, '');
	if (value == undefined || value == null || value == "" || value == ".") {
		return "";
	}
	if (parseFloat(value) > 100000) {
		return Math.floor(parseInt(value) / 10).toString();
	} else if (parseFloat(value) == 100000) {
		return parseInt(value).toString();
	}
	var valueArr = value.split(".");
	if (valueArr.length > 1) {
		if (valueArr[1].length > 2) {
			return value.substring(0, value.length - 1);
		}
		valueArr[0] += ".";
	}
	var result = valueArr.toString();
	result = result.replace(/,/g, "");
	if (valueArr.length > 1 && valueArr[1].length > 2) {
		if (result.charAt(result.length - 1) != ".") {
			var result = Math.floor((parseFloat(result) * 100).toFixed(1)) / 100;
		}
	}
	return result;
}


//format date to dd-mm-yyyy
function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}


function displayFormatDate(date) {
	if (date == undefined || date == null || date == "") {
		return "";
	}
	var dt = date.split('-');
	var dt2 = dt[2].split(' ');  // this is use to again seperate the timestamp from last index. eg. 2018-06-04 13:17:06
	return dt2[0] + "-" + dt[1] + "-" + dt[0];
}

function amount(val) {
	if (val.match(/^\d{1,16}(\.\d{0,2})?$/)) {
	} else {
		val = val.replace(/[^\d.]/g, '');
		inputVal = val.split(".");
		valueBeforeDecimal = inputVal[0].substring(0, 16);
		if (inputVal.length > 1) {
			valueAfterDecimal = inputVal[1].substring(0, 2);
			val = valueBeforeDecimal + "." + valueAfterDecimal;
		} else {
			val = valueBeforeDecimal;
		}
	}
	return val.replace(/^0*/g, '');
}

function inrFormat(nStr) { // nStr is the input string
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	var z = 0;
	var len = String(x1).length;
	var num = parseInt((len / 2) - 1);

	while (rgx.test(x1)) {
		if (z > 0) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		} else {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
			rgx = /(\d+)(\d{2})/;
		}
		z++;
		num--;
		if (num == 0) {
			break;
		}
	}
	return x1 + x2;
}
function inrFormatVal(input) { // nStr is the input string
	var cursor = input.selectionStart;
	
	value = input.value;
	console.log("value :: "+value);
	parseValue = Number(value);
	stringVal = parseValue.toLocaleString();
	$(input).val(stringVal);
	$(input).setCursorPosition(cursor);
}
function inrFormatVal1(value) { // nStr is the input string
	parseValue = Number(value);
	stringVal = parseValue.toLocaleString('en-IN', { minimumFractionDigits: 2 });
	return stringVal;
}
$.fn.setCursorPosition = function(pos) {
  this.each(function(index, elem) {
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  });
  return this;
};


function validateMobileNo(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/^([7-8-9]{1})([0-9]{9})$/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid contact number.";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter Contact number.";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function validateEmailId(checkId, setId, isMandatory) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		if (/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/.test(document.getElementById(checkId).value)) {
			document.getElementById(setId).innerHTML = "";
		} else {
			document.getElementById(setId).innerHTML = "Provide valid Email Id.";
		}
	} else {
		if (isMandatory) {
			document.getElementById(setId).innerHTML = "Enter Email Id";
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}

function validateDob(checkId, setVal, setId) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		checkDateOfBirth(checkId, setVal, setId);
	} else {
		document.getElementById(setId).innerHTML = "Please enter Date of Birth.";
	}
}

function checkDateOfBirth(checkId, setVal, setId) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		var d = new Date();
		var DOB = document.getElementById(checkId).value;
		var sp = DOB.split('-');
		var selectde_date = parseInt(sp[2]);
		var current_date = d.getFullYear();
		var final_age = (current_date - selectde_date);
		if (final_age <= 18) {
			document.getElementById(setId).innerHTML = "Applicant age must be greater than 18 years";
			return;
		} else {
			if (setVal != "") {
				document.getElementById(setVal).value = final_age;
			}
			document.getElementById(setId).innerHTML = "";
		}
	}
}


function calculateAge(checkId, setVal, setId) {
	var i = checkEmptyField(document.getElementById(checkId).value);
	if (!i) {
		var d = new Date();
		var DOB = document.getElementById(checkId).value;
		var sp = DOB.split('-');
		var selectde_date = parseInt(sp[2]);
		var current_date = d.getFullYear();
		var final_age = (current_date - selectde_date);
		if (setVal != "") {
			document.getElementById(setVal).value = final_age;
		} else {
			document.getElementById(setId).innerHTML = "";
		}
	}
}


function removeCommaFromINRValue(comaValue) {
	if (comaValue == "" || comaValue == undefined || comaValue == null || comaValue == "-Infinity" || comaValue == "Infinity" || comaValue == NaN) {
		return 0;
	}
	var num = comaValue;
	var n = num.toString();
	if (n.indexOf(',') > -1) {
		n = n.replace(/,/g, "");
	}
	return n;
}



function dateChange(dateVal) {
	var splitDate = dateVal.split('-');
	var month;
	if (splitDate[1] == "01") {
		month = "January"
	} else if (splitDate[1] == "02") {
		month = "February"
	} else if (splitDate[1] == "03") {
		month = "March"
	} else if (splitDate[1] == "04") {
		month = "April"
	} else if (splitDate[1] == "05") {
		month = "May"
	} else if (splitDate[1] == "06") {
		month = "June"
	} else if (splitDate[1] == "07") {
		month = "July"
	} else if (splitDate[1] == "08") {
		month = "August"
	} else if (splitDate[1] == "09") {
		month = "September"
	} else if (splitDate[1] == "10") {
		month = "October"
	} else if (splitDate[1] == "11") {
		month = "November"
	} else if (splitDate[1] == "12") {
		month = "December"
	}
	var dateString = month + " " + splitDate[0] + ", " + splitDate[2];

	return dateString;
}

function numberFormat(val) {
	if (val == "" || val == undefined || val == null) {
		return "";
	}
	return val.replace(/,/g, '');
}
function getListByValue(data, key, value) {
	var filterdData = data.filter(function(obj) {
		return obj[key] == value
	})
	return filterdData;
}
function getIndexByValue(data, key, value) {
	return data.findIndex(x => x[key] === value);
}
function getSum(data, key) {
	sum = 0.00;
	$.each(data, function(index, value) {
		sum += Number(value[key])
	})
	return sum;
}
function dateFormat(input) {
	if (input == "" || input == undefined || input == null) {
		return "";
	}
	var res = input.split("-");
	return res[2] + "-" + res[1] + "-" + res[0];
}

function validateBankAccNo(num, checkId, setId) {
	var count = document.getElementById(num).value;
	var accNoCheck = document.getElementById(checkId).value;
	if (accNoCheck.length == count) {
		document.getElementById(setId).innerHTML = "";
	} else {
		document.getElementById(setId).innerHTML = "Length doesn't match.";
	}
}

function pincodeValid(val) {
	if (/^([1-9]{1}[0-9]{5})$/.test(val)) {
		return true
	} else {
		return false
	}
}

function numberValid(val) {
	if (/^[0-9]*$/.test(val)) {
		return true
	} else {
		return false
	}
}

function emailValid(val) {
	if (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(val)) {
		return true
	} else {
		return false
	}
}

function alphaNumericValid(val) {
	if (/^[a-zA-Z0-9]*$/.test(val)) {
		return true
	} else {
		return false
	}
}

function alphabetNumberSpaceValid(val) {
	if (/^[a-zA-Z0-9-:.() ]*$/.test(val)) {
		return true
	} else {
		return false
	}
}

function characterValid(val) {
	if (/^[a-zA-Z ]*$/.test(val)) {
		return true
	} else {
		return false
	}
}

function decimalValid(val) {
	if (/^-?\d+(\.\d{0,5})?$/.test(val)) {
		return true
	} else {
		return false
	}
}

function addressValid(val) {
	if (/^[a-zA-Z0-9 ':,.\/()-]+$/.test(val)) {
		return true
	} else {
		return false
	}
}

function ifscValid(val) {
	if (/^[A-Za-z]{4}[0]{1}[a-zA-Z0-9]{6}$/.test(val)) {
		
		return true
	} else {
		return false
	}
}

function nameValid(val) {
	if (/^[a-zA-Z ',.()&-]+$/.test(val)) {
		return true
	} else {
		return false
	}
}
function getRequestHeaders(loginUserDetails) {
	var loginDetails = {};
	loginDetails.userId = loginUserDetails.userId;
	loginDetails.userName = loginUserDetails.userName;
	loginDetails.currentRole = loginUserDetails.currentRole;
	loginDetails.accessToken = loginUserDetails.accessToken;
	return loginDetails;
}

function getCurrentFiscalYear() {
	var today = new Date();
	var curMonth = today.getMonth();
	var currentYear;
	var fiscalYr = "";
	if (curMonth > 3) { //
		var nextYr1 = (today.getFullYear() + 1).toString();
		currentYear = today.getFullYear().toString();
		fiscalYr = currentYear.charAt(2) + currentYear.charAt(3) + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
	} else {
		var nextYr2 = today.getFullYear().toString();
		currentYear = (today.getFullYear() - 1).toString();
		fiscalYr = currentYear.charAt(2) + currentYear.charAt(3) + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
	}

	return fiscalYr;
}

Array.prototype.sortBy = function (p) {
	return this.slice(0).sort(function (a, b) {
		return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
	});
}
