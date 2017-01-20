// @flow
import React, { Component } from 'react';
import './App.css';
import { Grid, Button, Panel, DropdownButton, MenuItem, Label } from 'react-bootstrap';

const STATION_DATA = [
  {name: "松戸駅", latitude:35.7856351, longitude:139.9018745},
  {name: "北松戸駅", latitude:35.8003695, longitude:139.9134339},
  {name: "馬橋駅", latitude:35.810838, longitude:139.9176731},
  {name: "新松戸駅", latitude:35.8245533, longitude:139.9211922},
  {name: "北小金駅", latitude:35.833227, longitude:139.930774},
  {name: ""},
  {name: "上本郷駅", latitude:35.7885149, longitude:139.9158631},
  {name: "松戸新田駅", latitude:35.79062, longitude:139.922276},
  {name: "みのり台駅", latitude:35.7881568, longitude:139.9286494},
  {name: "八柱駅", latitude:35.7901759, longitude:139.9379298},
  {name: "常盤平駅", latitude:35.8030837, longitude:139.9503831},
  {name: "五香駅", latitude:35.7969461, longitude:139.9668652},
  {name: "元山駅", latitude:35.7898013, longitude:139.9761134},
  {name: ""},
  {name: "矢切駅", latitude:35.756891, longitude:139.9005437},
  {name: "北国分駅", latitude:35.7620618, longitude:139.9140265},
  {name: "秋山駅", latitude:35.765484, longitude:139.93111},
  {name: "東松戸駅", latitude:35.7689836, longitude:139.9432014},
  {name: "松飛台駅", latitude:35.7739715, longitude:139.9577712},
  {name: "大町駅", latitude:35.7733186, longitude:139.9738537},
  {name: ""},
  {name: "六実駅", latitude:35.777636, longitude:139.9920391},
  {name: "幸谷駅", latitude:35.82706, longitude:139.920053},
  {name: "小金城趾駅", latitude:35.835976, longitude:139.916858},
]

/*
const STATION_DATA = [
  {eventKey: 1, value: "松戸駅", latitude:35.7856351, longitude:139.9018745},
  {eventKey: 2, value: "新松戸駅", latitude:35.8258822, longitude:139.9174117}
]
*/

class DropdownButtonStation extends Component {

  render(){

    let infoList = 
      this.props.data.map(
        (info, i) => {
          return (
            info.name ?
              <MenuItem key={i} eventKey={i} href="#top"><h4>{info.name}</h4></MenuItem>
               :
              <MenuItem key={i} divider />
          );
        }
      );
      
    return(
      <DropdownButton id="dropDownButtonStation"
        title={this.props.title} bsStyle="success" bsSize="large"
        onSelect={(key) => this.props.onSelect(key)}>
        {infoList} 
      </DropdownButton>
    );
  }
}

class ServiceInfoList extends Component {
  
  getMapUrl(m)
  {
    const GMAP_KEY = "AIzaSyCCp4cUBvo4_UutOeF-4o0CboW5sqailCg";
    const GMAP_SIZE = "700x700";
    const GMAP_COODINATE = `${m.latitude},${m.longitude}`;
    const GMAP_URL = `https://maps.googleapis.com/maps/api/staticmap?&center=${GMAP_COODINATE}&zoom=17&size=${GMAP_SIZE}&sensor=false&key=${GMAP_KEY}&markers=size:normal|${GMAP_COODINATE}`;
    return GMAP_URL;
  }

  render(){
    let infoList = this.props.display ? (
      this.props.data.map(
        (info, i) => {
          return(
            <Panel header={info.shopName} bsStyle="info" key={i}>
              {info.contents}<br />
              【住所】{info.address} &nbsp;
              <a href={this.getMapUrl(info)} target="_blank"><Button bsStyle="primary" bsSize="xsmall">地図</Button></a>
              <br />
              【電話】{info.tel}
              {/*
              【距離】{miraiInfo.distance}<br />
              */}
            </Panel>
          )
      })
    ) : null;

    return(
      <div>{infoList}</div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0,
      hasLocation: false,
      stationSelected: "最寄駅を選択して近辺表示",
      warningInfo : "",
      serviceInfo:
        this.getTSV("ServiceInfo.tsv",
          (arr) => {
            return {
              shopName : arr[0],
              address: arr[1],
              latitude : arr[2],
              longitude : arr[3],
              tel: arr[4],
              contents: arr[5],
              distance: 0
            }
          }
        )
    };
  }

  // TSV読み込み
  getTSV(fileName, funcReturn){
    let result = [];
    let req = new XMLHttpRequest();
    req.open("get", fileName, true);
    req.send(null);

    req.onload = () =>
    {
      let str = req.responseText;
      let tmp = str.split("\n");

      for(let i=0;i<tmp.length;++i){
        let arr = tmp[i].split('\t');
        result[i] = funcReturn(arr);
      }
    }
    return result;
  }

  // 距離計算関数
  getDistance(myCoords, targetCoords){
    const lat1 = myCoords.latitude;
    const lng1 = myCoords.longitude;
    const lat2 = targetCoords.latitude;
    const lng2 = targetCoords.longitude;

    function radians(deg){
      return deg * Math.PI / 180;
    }

    return 6378.14 * Math.acos(Math.cos(radians(lat1))* 
      Math.cos(radians(lat2))*
      Math.cos(radians(lng2)-radians(lng1))+
      Math.sin(radians(lat1))*
      Math.sin(radians(lat2)));
  }

  // 距離計算し、サービス情報を距離が近い順にソート
  adjustServiceInfo(myCoords)
  {
    let ar = this.state.serviceInfo.slice();

    // 距離計算し、距離が近い順にソート
    for(let i = 0; i < ar.length; i++) {
      ar[i].distance = this.getDistance(myCoords, ar[i])
    }

    ar.sort((a, b) => {
      if(a.distance < b.distance) return -1;
      if(a.distance > b.distance) return 1;
      return 0;
    });

    this.setState({
      latitude: myCoords.latitude,
      longitude: myCoords.longitude,
      hasLocation: true,
      warningInfo : "",
      serviceInfo: ar.slice(),
    });
  }

  // 位置情報取得して一覧表示
  _onClickCurrent(){
    const options = {
      enableHighAccuracy: true,
      maximumAge: 1,
      timeout: 10000,
    };

    let success = (position) => {
      this.adjustServiceInfo(position.coords);
      this.setState({
        stationSelected: "最寄駅を選択して近辺表示"
      });
    }

    let error = (err) => {
      this.setState({
        latitude: 0,
        longitude: 0,
        warningInfo : "残念ながら現在位置の取得に失敗しました。",
        hasLocation: false,   
      })
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  // 駅を指定して一覧表示
  _onSelectStation(key)
  {
    this.setState({
      stationSelected : STATION_DATA[key].name + "の近辺表示",
    });

    //console.log("select:"+key);
    this.adjustServiceInfo(STATION_DATA[key]);
  }

  render() {
    return (
      <div>
          <Grid>
            <div className="page-header">
              <h3>松戸子育てみらいカード協賛店</h3>
            </div>
            <ul>
              <li><a href="http://www.city.matsudo.chiba.jp/kosodate/matsudodekosodate/kosodatenavi/matsudokosodateshien/kosodatejouhou/cardkyousanten.html" target="_blank">松戸子育てみらいカードとは？</a></li>
              <li>カード有効期限は最長で平成37年12月28日までで、そこまで利用できるかどうかはお店次第です。使えたらラッキー程度で考えてください。</li>
            </ul>
            <DropdownButtonStation
              title={this.state.stationSelected}
              data={STATION_DATA}
              onSelect={(key) => this._onSelectStation(key) } />
            <p />
            <Button
              id="buttonGetLocation"
              bsStyle="primary"
              bsSize="large"
              onClick={() => this._onClickCurrent()}>
              現在位置を取得して近辺表示
            </Button>
            <p />
            <h4><Label bsStyle="danger">
              {this.state.warningInfo}
            </Label></h4>
            <ServiceInfoList
              data={this.state.serviceInfo}
              display={this.state.hasLocation} />
          </Grid>
      </div>
    );
  }
}

export default App;