'use strict';
/* Filters */

angular.module('bbApp.filters', [])
  .filter('iif', function () {
      return function (input, trueValue, falseValue) {
          return input ? trueValue : falseValue;
      };
  })
  .filter('isempty', function () {
        return function (input, replaceText) {
            if (input) return input;
            return replaceText;
        }
    })
  .filter('timeFromNow', function () {
      return function (input) {
          if (input) {
              return time_difference_fromNow(new XDate(input));
          }
          else return '';
      }
  }).filter('timeAgo', function () {
      return function (input) {
          if (input) {
              return time_ago_fromNow(new XDate(input));
          }
          else return '';
      }
  }).filter('profileLink', function () {
      return function (input) {
          return '#/Profile/' + input.split('/')[1];
      };
  }).filter('rawHtml', ['$sce', function ($sce) {
      return function (val) {
          return $sce.trustAsHtml(val);
      };
  }]).filter('percentage', ['$filter', function ($filter) {
      return function (input, decimals) {
          return input ? $filter('number')(input * 100, decimals) + '%':"";
      };
  }]).filter('encodeUriComponent', function() {
        return function(input) {
            return window.encodeURIComponent(input);
        }
   })
;

// Simple function to calculate time difference between 2 Javascript date objects
function get_time_difference(earlierDate, laterDate) {
    var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
    var oDiff = new Object();

    oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

    oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

    oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.minutes * 1000 * 60;

    oDiff.seconds = Math.floor(nTotalDiff / 1000);

    return oDiff;

}
// Function Usage
function time_difference_fromNow(laterDate) {
    var oDiff = get_time_difference(new Date(), laterDate);

    var result = "";

    if (oDiff.days != 0) {
        result = oDiff.days + " day" + (oDiff.days > 1 ? "s " : " ");
    }
    if (oDiff.hours != 0) {
        result = result + oDiff.hours + " hour" + (oDiff.hours > 1 ? "s " : " ");
    }
    else if (oDiff.minutes != 0) {
        result = result + oDiff.minutes + " minutes";
    }
    else {
        result = result + oDiff.seconds + " seconds";
    }

    return result;
}

function time_ago_fromNow(pastDate) {
    var oDiff = get_time_difference(pastDate, new Date());

    var result = "";

    if (oDiff.days != 0) {
        result = oDiff.days + " day" + (oDiff.days > 1 ? "s " : " ");
    } else
    if (oDiff.hours != 0) {
        result = result + oDiff.hours + " hour" + (oDiff.hours > 1 ? "s " : " ");
    }
    else if (oDiff.minutes != 0) {
        result = result + oDiff.minutes + " minute" + (oDiff.minutes > 1 ? "s " : " ");
    }
    else {
        result = result + oDiff.seconds + " second" + (oDiff.seconds > 1 ? "s " : " ");
    }

    return result;
}
