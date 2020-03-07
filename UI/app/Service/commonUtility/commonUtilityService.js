myApp.factory('commonUtilityService', ['appConstants',
    function (appConstants) {

        var service = {};
        
		service.getPagination = function (data, pagination) {

            customTableFooter = "";
            var totalPages = data.length/pagination['noOfRecords'];
            vpagination = JSON.stringify(pagination.varName);
			if(totalPages != undefined) {
				for (var i = 0; i < pagination.pagearray.length; i++) {
					isPrev = pagination.pagearray[i] == 'Prev' ? true : false;
					isNext = pagination.pagearray[i] == 'Next' ? true : false;
					isContinue = pagination.pagearray[i] == '...' || pagination.pagearray[i] == '..' ? true : false;
					if(!isNext && !isPrev && !isContinue) {
						item = Math.trunc(pagination.pagearray[i]);
					} else {
						item = pagination.pagearray[i];
					}
					
					isActive = item === pagination.currentPage ? 'active' : '';
					customTableFooter += "<li class='"+isActive+"'>"
					if(isNext) {
						customTableFooter += "<a onclick='angular.element(this).scope().changePage("+(pagination.currentPage+1)+", "+vpagination+")'>"+item+"</a>";
					} else if(!(item == 'Prev' || item == 'Next' ||  item == '..' || item == '...')) {
						customTableFooter += "<a onclick='angular.element(this).scope().changePage("+item+", "+vpagination+")'>"+item+"</a>";
					} else if (item == '..' || item == '...') {
						customTableFooter += "<a class='continue'>"+item+"</a>";
					} else if(isPrev) {
						customTableFooter += '<a onclick="angular.element(this).scope().changePage('+(pagination.currentPage-1)+', '+vpagination+')">'+item+'</a>';
					}
					customTableFooter += "</li>";
				}
			}
			
			if(((pagination.currentPage)*pagination.noOfRecords) > data.length) {
				displayEndsRecordCount = data.length;
			} else {
				displayEndsRecordCount = ((pagination.currentPage)*pagination.noOfRecords);
			}
			if(data.length > 0) {
				pagination['showing'] = "Showing: "+(((pagination.currentPage-1)*pagination.noOfRecords)+1)+" - "+displayEndsRecordCount+" of "+data.length+" Records";
			} else {
				pagination['showing'] = "Showing: 0 - 0 of 0 Records";
			}
			$("#"+pagination['tableName']).closest('.tableData').next('.customTableFooter').children('.col-md-4').children('.pull-right').children('.pagination').html(customTableFooter)
			return pagination;
		};
		
		service.setPagination = function(data, pagination) {
			pagination.pagearray = [];
			var totalPages = Math.ceil(data.length/pagination['noOfRecords']);
            
			if(totalPages <= 1) {
				return pagination;
			}
			
			if (totalPages <= 5) {
				for (var i = 1; i <= totalPages; i++)
					pagination.pagearray.push(i);
			}

			if (totalPages > 5) {
				if (pagination['currentPage'] <= 3) {
					for (var j = 1; j <= 5; j++) {
						pagination.pagearray.push(j);
					}
					pagination.pagearray.push('...');
					pagination.pagearray.push(totalPages);
					pagination.pagearray.push('Next');
				} else if (totalPages - pagination['currentPage'] <= 3) {
					pagination.pagearray.push('Prev');
					pagination.pagearray.push(1);
					pagination.pagearray.push('..');
					for (var k = totalPages - 4; k <= totalPages; k++) {
						pagination.pagearray.push(k);
					}
						
				} else {
					pagination.pagearray.push('Prev');
					pagination.pagearray.push(1);
					pagination.pagearray.push('..');
					for (var l = pagination['currentPage'] - 2; l <= pagination['currentPage'] + 2; l++) {
						pagination.pagearray.push(l);
					}
					pagination.pagearray.push('...');
					pagination.pagearray.push(totalPages);
					pagination.pagearray.push('Next');
				}
			}
			return pagination;
		}
		service.filterDataLength = function(data, criteria) {
			filteredData = data.filter(function(itm) {
				return itm.id == criteria.id;
			})
			return filteredData;
		}
		service.filterTableRecords = function(data, criteria) {
			matchFound = false;
			$.each(criteria, function (index, value) {
				if(data[index] == value) {
					matchFound = true;
				}
			})
			if(matchFound) {
				return data;
			}
			
		}

        return service;
    }]);