angular.module('newApp').controller('mainCtrl',
    ['$scope', 'applicationService', 'quickViewService', 'builderService', 'pluginsService', '$location','$cookies',
        function ($scope, applicationService, quickViewService, builderService, pluginsService, $location, $cookies) {
            $(document).ready(function () {
                applicationService.init();
                quickViewService.init();
                builderService.init();
                pluginsService.init();
            });

            $scope.$on('$viewContentLoaded', function () {



                if(!$cookies.username){

                    pluginsService.init();
                    applicationService.customScroll();
                    $('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');

                    if($location.$$path == '/menu' || $location.$$path == '/layout-api'){

                        $('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
                        $('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
                        if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
                        if ($('body').hasClass('submenu-hover')) return;
                        $('.nav.nav-sidebar .nav-parent .children').slideUp(200);
                        $('.nav-sidebar .arrow').removeClass('active');
                    }
                    if($location.$$path == '/menu'){
                        $('body').addClass('dashboard');
                    }
                    else{
                        $('body').removeClass('dashboard');
                    }
                }else{
                    window.location.href = '../index.html';
                }
            });

            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

        }]);
