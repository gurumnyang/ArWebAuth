document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById('map');
    if (container) {
        var markerPosition  = new kakao.maps.LatLng(36.512884, 127.245108);

        var options = {center: markerPosition, level: 3};
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({ position: markerPosition });

        var map = new kakao.maps.Map(container, options);
        marker.setMap(map);
    }
    else {
        console.error("Map container element not found");
    }
});