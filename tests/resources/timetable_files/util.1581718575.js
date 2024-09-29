var util = function() {
  /**
   * @author Tomasz Zak <tomasz.zak[at].librus.pl>
   * @function getCookie
   * @description Return cookie value by name 
   * @param {string} name - Cookie's key
   * @returns {string}
   */
  var getCookie = function(name) {
    var filter = function(cookie, name) {
      return _.trim(cookie.split('=')[0]) === name;
    }
    var filterByName = _.partial(filter, _, name);
    var find = _.partial(_.find, _, filterByName);
    var split = _.partial(_.split, _, '=', 2);
  
    return _.flow([
      find,
      split,
      _.last,
      _.trim
    ])(document.cookie.split(';'));
  };

  /**
   * @author Tomasz Zak <tomasz.zak[at].librus.pl>
   * @function createApiService
   * @description Class to communicate with API
   * @param {object} options - Configuration object
   * - prefix {string}
   * @returns {string}
   */
  function createApiService(options) {
    var options = options || {};
    var prefix = options.prefix || '';

    var makeApiCall = function(options) {
      return $.ajax(
        _.assign({
          url: prefix + options.endpoint,
          headers: {
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
          }
        }, options)
      );
    };

    return {
      makeApiCall: makeApiCall
    };
  }

  return {
    getCookie: getCookie,
    createApiService: createApiService
  }
}();
