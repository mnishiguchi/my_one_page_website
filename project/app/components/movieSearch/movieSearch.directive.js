/**
 * Defines movie-search related components.
 * Fetches movie information based on the search term that is a full movie name.
 * http://www.omdbapi.com/
 */
(function() {

  // Module declaration.
  // none


  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //


  angular
    .module( "app" )
    .directive( "movieSearch", movieSearchDirective );

  function movieSearchDirective() {

    var directive = {
      restrict: "E",
      scope: {},
      templateUrl: "app/components/movieSearch/movieSearch.template.html",
      controllerAs: "vm",
      controller: movieSearchController,
    };
    return directive;

  } // end movieSearchDirective


  movieSearchController.$inject = [
    "$scope",
    "movieDataService"
  ];
  function movieSearchController( $scope, movieDataService ) {

    var vm    = this;
    var props = $scope.props = $scope;  // Alias for $scope

    // Initial state.
    vm.loading   = false;
    vm.movieInfo = {};
    vm.searchKey = "";
    vm.topID     = "main-container";  // For anchorHashLink

    // Expose the public methods.
    vm.fetchData = fetchData;
    vm.clearData = clearData;


    // ---
    // PUBLIC METHODS.
    // ---


    /**
     * Fetch movie data based on the searchKey.
     * The movieDataService is required.
     */
    function fetchData() {

      vm.loading = true;

      movieDataService.fetchData( vm.searchKey )
      .then   ( function(movieInfo) { vm.movieInfo = movieInfo; } )
      .finally( function()          { vm.loading   = false; } );

    } // end function


    /**
     * Clear movie data and search key.
     */
    function clearData() {

      vm.searchKey = "";
      vm.movieInfo = {};

    }

  } // end movieSearchController


  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //


  angular
    .module( "app" )
    .directive( "movieInfo", movieInfoDirective );

  function movieInfoDirective() {

    var directive = {
      restrict: "E",
      scope: {
        info: "="
      },
      templateUrl: "app/components/movieSearch/movieInfo.template.html",
      controller: movieInfoController,
      controllerAs: "vm"
    };
    return directive;

  } // end movieInfoDirective


  movieInfoController.$inject = [
    "$scope"
  ];
  function movieInfoController( $scope ) {

    var vm    = this;
    var props = $scope.props = $scope;  // Alias for $scope

    // Initial state.
    vm.isDataAvailable = false;

    // Expose the public methods.
    vm.getAmazonUrl      = getAmazonUrl;
    vm.getMoviePosterUrl = getMoviePosterUrl;
    vm.getYouTubeUrl     = getYouTubeUrl;

    // Keep watch on props.info.Response then update vm.isDataAvailable.
    // https://docs.angularjs.org/api/ng/type/$rootScope.Scope
    $scope.$watch(
      "props.info.Response",
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

        return (props.info.Poster == 'N/A')
                ? "http://placehold.it/200x200&text=N/A" // Placeholer.
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

  } // end movieInfoController


})();
