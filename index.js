//도로교통공사 http://data.ex.co.kr/openapi/basicinfo/openApiInfoM?apiId=0508
const APIKey = "3561290751";

const hour = new Date().toLocaleDateString("ko-kr");
document.getElementById("date").innerHTML += hour;

const url = `http://data.ex.co.kr/openapi/restinfo/restWeatherList?key=${APIKey}&type=json&sdate=20230119&stdHour=12`;
let i = 0;

async function getData(i) {
  const response = await fetch(url);
  //json형태로 필요한 정보를 data에 넣어줌
  const data = await response.json();
  const info = data.list.map((val) => [
    val.unitName,
    val.weatherContents,
    val.addr,
    val.tempValue,
  ]);
  const latlng = data.list.map((val) => [val.xValue, val.yValue]);
  makeJson(latlng);
  i = show(info, i);
}

getData(i);

function makeJson(latlng) {
  //객체 { }
  let container = new Object();
  //객체 {"positions":[ ]}
  container["positions"] = new Array();

  for (let i = 0; i < latlng.length; i++) {
    //객체 {"positions":[{ },... ]}
    let position = new Object();
    position["lat"] = latlng[i][0];
    position["lng"] = latlng[i][1];
    container["positions"].push(position);
  }
  //Object.values(container.positions); obj의 값만 출력
  console.log(container.positions);
  map(container);
}

function show(info, start) {
  var box = document.getElementById("box");
  let end = start + 10;
  for (let i = start; i < end; i++) {
    var temp = info[i][3].substr(0, 3);
    box.innerHTML +=
      "<div id='info'><h5>" +
      info[i][0] +
      "</h5><span id='addr'>" +
      info[i][2] +
      "<br/></span><h6> 현재 " +
      info[i][1] +
      temp +
      "º</h6></div>";
  }
  console.log("show");
  return (i = end);
}

//다음페이지
function next(value) {
  var box = document.getElementById("box");
  box.innerHTML = "";
  getData(10 * (value - 1));
  console.log(value);
}

function map(xy) {
  var map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(36.2683, 127.6358),
    level: 13,
  });
  //교통정보표시
  map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

  // 마커 클러스터러
  var clusterer = new kakao.maps.MarkerClusterer({
    map: map,
    // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    averageCenter: true,
    // 클러스터 할 최소 지도 레벨
    minLevel: 10,
  });
  m_cluster(xy);
  // 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
  function m_cluster(xy) {
    // 데이터에서 좌표 값을 가지고 마커를 표시합니다
    var markers = $(xy.positions).map(function (i, position) {
      return new kakao.maps.Marker({
        position: new kakao.maps.LatLng(position.lat, position.lng),
      });
    });
    //container.positions[0].lat
    // 클러스터러에 마커들을 추가합니다
    clusterer.addMarkers(markers);
  }
}
