var pdn = angular.module('pdn',["leaflet"]);

pdn.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/latest',{controller: pdnCtrl})
	.when('/meetup/:year/:date',{templateUrl:'partials/event.html', controller:meetupCtrl})
	.otherwise({redirectTo: '/latest'});
}]);

function meetupCtrl($scope, $routeParams , $http) {
	var year = $routeParams.year,
		date = $routeParams.date,
		events;
	$http.get('events/'+year+'/'+date+'.json').success(function(data){
		$scope.event = data;
	});
	$scope.date = $routeParams.date;
	$scope.niceDate = Date.parse(date+'-'+year).toString('dddd, dS MMM yyyy');
}
function pdnCtrl(){

}
function navCtrl($scope, $rootScope, $http, $location) {
	$http.get('events.json').success(function(data){
		var parsedDate;
		for(year in data)
		{
			for(date in data[year])
			{
				parsedDate = Date.parse(data[year][date]+'-'+year)
				data[year][date] = {
					date : data[year][date],
					name : parsedDate.toString('dS MMM'),
					year : year
				}
			}
		}
		$scope.latestEvent = {
			date : parsedDate.toString('dd-MM'),
			name : parsedDate.toString('ddd, dS MMM'),
			year : year
		}
		$scope.events = data;
		if($location.path() == '/latest'){
			console.log('nooo');
			$location.path('/meetup/'+year+'/'+parsedDate.toString('dd-MM'));
			//$scope.$apply();
		}
	});
};


/* leaflet directive */
angular.module('leaflet',[])
	.directive('leaflet', function(){
		return {
			restrict : "E",
			replace : true,
			transclude : true,
			scope: {
				lat : "@leafletLat",
				lng : "@leafletLng"
			},
			template: '<div id="map"></div>',
			link: function(scope, element, attrs,ctrl){
				var el = element[0],
				center = {
					lat:27.709448,
					lng:85.328920
				}
				map = new L.map(el);
				map.setView([center.lat,center.lng], 15);
				map.scrollWheelZoom.disable();
				L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
					attribution: '',
					maxZoom: 18,
					subdomains: ['otile1','otile2','otile3','otile4']
				}).addTo(map);
				var marker = new L.Marker(new L.LatLng(center.lat, center.lng)).addTo(map);
				scope.$watch('lat',function(lat){
					if(lat === undefined || lat === "") return;
					center.lat = lat;
					updateMap();
				});
				scope.$watch('lng',function(lat){
					if(lat === undefined || lat === "") return;
					center.lng = lat;
					updateMap();
				});

				function updateMap(){
					map.setView(new L.LatLng(center.lat,center.lng), 15);
					marker.setLatLng(new L.LatLng(center.lat,center.lng));
				}
				
			}
		}
	});

