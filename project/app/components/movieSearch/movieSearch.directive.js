/**
 * Defines movie-search related components.
 * Fetches movie information based on the search term that is a full movie name.
 * http://www.omdbapi.com/
 */
(function() {

  // Module declaration.
  var module = angular.module(
  "movieSearchComponents",
  [
    "movieDataService",
    "anchorHashLink"
  ]);


  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //


  module.directive(
  'movieSearch',
  function () {

    return {
      restrict: "E",
      scope: {},
      templateUrl: "app/components/movieSearch/movieSearch.template.html",

      controllerAs: "vm",
      controller:
      [
        '$scope',
        'movieDataService',
        function( $scope, movieDataService ) {

          var vm    = this;
          var props = $scope.props = $scope;  // Alias for $scope

          // Initial state.
          vm.searchKey = "";
          vm.movieInfo = {};
          vm.loading   = false;
          vm.topID     = "main-container";  // For anchorHashLink

          // Expose the public methods.
          vm.fetchData = fetchData;
          vm.clearData = clearData;


          // ---
          // PUBLIC METHODS.
          // ---


          /**
           * I fetch movie data based on the searchKey.
           * The movieDataService is required.
           */
          function fetchData() {

            vm.loading = true;
            movieDataService.fetchData( vm.searchKey )
            .then(
              function successCallback(movieInfo) {
                vm.loading   = false;
                vm.movieInfo = movieInfo;
              },
              function errorCallback(reason) {
                vm.loading = false;
              }
            ); // end then
          } // end function


          /**
           * I clear movie data and search key.
           */
          function clearData() {

            vm.searchKey = "";
            vm.movieInfo = {};

          } // end function

        } // end function
      ] // end controller
    }; // end return
  }); // end directive


  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //


  module.directive(
  'movieInfo',
  function () {

    return {
      restrict: "E",
      scope: {
        info: "="
      },
      templateUrl: "app/components/movieSearch/movieInfo.template.html",

      controllerAs: "vm",
      controller:
      [
        '$scope',
        function( $scope ) {

          var vm    = this;
          var props = $scope.props = $scope;  // Alias for $scope

          // Initial state.
          vm.isDataAvailable = false;

          // Expose the public methods.
          vm.getMoviePosterUrl = getMoviePosterUrl;
          vm.getYouTubeUrl     = getYouTubeUrl;
          vm.getAmazonUrl      = getAmazonUrl;

          // Keep watch on props.info.Response then update vm.isDataAvailable.
          // https://docs.angularjs.org/api/ng/type/$rootScope.Scope
          $scope.$watch(
            function() {
              return props.info.Response;
            },
            function(newVal, oldVal) {
              if ( newVal !== oldVal ) {
                vm.isDataAvailable = (props.info.Response === 'True');
              }
            }
          ); // end $scope.$watch


          // ---
          // PUBLIC METHODS.
          // ---


          /**
           * @return An URL for a poster based on the current info,
           *         a placeholder URL if the current info is empty.
           */
          function getMoviePosterUrl() {
              var PLACEHOLDER_URL  = "http://placehold.it/200x200&text=N/A";
              return (props.info.Poster == 'N/A')
                      ? PLACEHOLDER_URL
                      : props.info.Poster;
          }


          /**
           * @return An URL for Amazon based on the current info.
           */
          function getAmazonUrl() {
            return "http://www.amazon.com/s/ref=nb_sb_noss_1/?url=search-alias%3Ddvd&field-keywords=" + props.info.Title;
          }


          /**
           * @return An URL for YouTube based on the current info.
           */
          function getYouTubeUrl() {
            return "https://www.youtube.com/results/?search_query=" + props.info.Title;
          }

        } // end function
      ] // end controller
    }; // end return
  }); // end directive

})();
