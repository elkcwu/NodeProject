/**
 * http://usejsdoc.org/
 */
angular.module('mainCtrl', [])

.controller('MainCtroller', function($rootScope, $location, Auth){
	var vm = this;
	
	vm.loggedIn = Auth.isLoggedIn();
	
	$rootScope.$on('$routechangeStart', function(){
		vm.loggedIn = Auth.isLoggedIn();
		
		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
			});		
	});
	
	vm.doLogin = function(){
		
		vm.processing = true;
		vm.error = '';
		
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){
				vm.processing = false;
				
				Auth.getUser()
					.then(function(data){
						vm.user = data.data;
					});
				
				if(data.success)
					$location.path('/');
				else
					rm.error = data.message;
			});
	}
	
	vm.doLogout = function(){
		Auth.logout();
		$location.path('/logout');
	}
	
})