var messageBox;                    //訊息視窗物件  
var pMap;                      //初始化地圖物件
//------------------------------須自行修改的參數,包含點位坐標,訊息視窗內容及圖示檔案來源設定------------------------------
var infotext = '<B>內政部資訊中心</B><br>台北市松江路469巷4號';         //地標名稱及訊息視窗內容
var imgUrl = "https://i.imgur.com/XHDWW8c.png";         //標記點圖示來源
var nowPoint = null;  


function InitWnd(Latitude=303895,Longitude=2773227){
    var markerPoint = new TGOS.TGPoint(Latitude, Longitude);   
    var pOMap = document.getElementById("OMap");
    var mapOptiions = {
        scaleControl: false,                //不顯示比例尺
        navigationControl: true,     //顯示地圖縮放控制項
        navigationControlOptions: {        //設定地圖縮放控制項
            controlPosition: TGOS.TGControlPosition.TOP_LEFT,  //控制項位置
            navigationControlStyle: TGOS.TGNavigationControlStyle.SMALL         //控制項樣式
        },
            mapTypeControl: false                   //不顯示地圖類型控制項
    };
    pMap = new TGOS.TGOnlineMap(pOMap, TGOS.TGCoordSys.EPSG3826, mapOptiions);    //建立地圖,選擇TWD97坐標
    pMap.setZoom(11);                                   //初始地圖縮放層級
    pMap.setCenter(markerPoint);   //初始地圖中心點
    //------------------建立標記點---------------------
    /*var markerImg = new TGOS.TGImage(imgUrl, new TGOS.TGSize(76, 66), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(0, 0), new TGOS.TGSize(76, 66));       //設定標記點圖片及尺寸大小
    var pTGMarker = new TGOS.TGMarker(pMap, markerPoint,'', markerImg); //建立機關單位標記點
    //-----------------建立訊息視窗--------------------
    var InfoWindowOptions = {
        maxWidth:4000,       //訊息視窗的最大寬度
        pixelOffset: new TGOS.TGSize(5, 0),         //InfoWindow起始位置的偏移量, 使用TGSize設定, 向右X為正, 向上Y為負 
        zIndex:99                                //視窗堆疊順序
    };                                       
    messageBox = new TGOS.TGInfoWindow(infotext, markerPoint, InfoWindowOptions);          //建立訊息視窗                                                                  
    TGOS.TGEvent.addListener(pTGMarker, "mouseover", openInfoWindow);   //滑鼠監聽事件--開啟訊息視窗
    TGOS.TGEvent.addListener(pTGMarker, "mouseout", closeInfoWindow);     //滑鼠監聽事件--關閉訊息視窗*/

    



    return pMap;
}

function openInfoWindow() {      //開啟訊息視窗函式
    messageBox.open(pMap);
}

function closeInfoWindow() {      //關閉訊息視窗函式
    messageBox.close();
}

/*function transTM97(lat,lon){
    var TT = new TGOS.TGTransformation();
    TT.wgs84totwd97(lat,lon);
    return [x,y];
}*/

var myMap=InitWnd()
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
          let TT = new TGOS.TGTransformation();
          TT.wgs84totwd97(position.coords.longitude,position.coords.latitude);
          let test = new TGOS.TGPoint(Math.floor(TT.transResult.x), Math.floor(TT.transResult.y))
          //Map.setCenter(new TGOS.TGPoint(position.coords.longitude, position.coords.latitude))
          myMap.setCenter(test)
      });
    } else {
    }
}
getLocation()


function getData(){
    $.ajax({
        url: "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json", //請求的url地址
        dataType: "json", //返回格式為json
        async: true, //請求是否非同步，預設為非同步，這也是ajax重要特性
        type: "GET", //請求方式
        beforeSend: function() {
        //請求前的處理
        },
        success: function(data) {
            data["features"].forEach((Element,Index)=>{
                if(Index<data["features"].length){
                    let TT = new TGOS.TGTransformation();
                    TT.wgs84totwd97(Element["geometry"]["coordinates"][0],Element["geometry"]["coordinates"][1]);
                    //console.log(Index.toString()+"/"+data["features"].length.toString())
                    let test = new TGOS.TGPoint(Math.floor(TT.transResult.x), Math.floor(TT.transResult.y))
                    //myMap.setCenter(test)
                    if(Element["properties"]["note"].indexOf("號碼")!=-1)
                        var center=new TGOS.TGImage("https://i.imgur.com/bJbfHdf.png", new TGOS.TGSize(76, 66), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(0, 0), new TGOS.TGSize(76, 66)); 
                    else if(Element["properties"]["mask_adult"]>50)
                        var center=new TGOS.TGImage("https://i.imgur.com/nBNymm3.png", new TGOS.TGSize(76, 66), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(0, 0), new TGOS.TGSize(76, 66)); 
                    else if(Element["properties"]["mask_adult"]>0)
                        var center=new TGOS.TGImage("https://i.imgur.com/nHKXMQa.png", new TGOS.TGSize(76, 66), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(0, 0), new TGOS.TGSize(76, 66)); 
                    else
                        var center=new TGOS.TGImage("https://i.imgur.com/KEfkAbV.png", new TGOS.TGSize(76, 66), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(0, 0), new TGOS.TGSize(76, 66)); 
                    var pTGMarker = new TGOS.TGMarker(myMap, test,'', center);
                    TGOS.TGEvent.addListener(pTGMarker, "click", ()=>{
                        const handlePointChange=()=>{
                            var nowImg=new TGOS.TGImage("https://i.imgur.com/T0DvgvY.png", new TGOS.TGSize(76, 76), new TGOS.TGPoint(0, 0), new TGOS.TGPoint(0, 0), new TGOS.TGSize(76, 76)); 
                            nowPoint = new TGOS.TGMarker(myMap, test,'', nowImg);
                            document.getElementsByClassName("card-title")[0].textContent=Element["properties"]["name"];
                            document.getElementsByClassName("card-subtitle")[0].textContent=Element["properties"]["address"];
                            var realNote=""
                            if(Element["properties"]["note"]!="-"){
                            for(let i=0;i<Element["properties"]["note"].length;++i){
                                    if((Element["properties"]["note"][i]>="0" && Element["properties"]["note"][i]<="9")
                                    ||Element["properties"]["note"][i]==":" ||Element["properties"]["note"][i]=="點")
                                        realNote+= "<strong>"+Element["properties"]["note"][i]+"</strong>"
                                    else
                                        realNote+=  Element["properties"]["note"][i]
                                }
                            }
    
                            document.getElementsByClassName("card-text")[0].innerHTML=realNote
                            document.getElementsByClassName("btn-bot")[1].value = "https://www.google.com/maps/search/?api=1&query="+Element["properties"]["county"]+Element["properties"]["name"];
                            document.getElementById("tel").textContent=Element["properties"]["phone"];

                            var dt = new Date();
                            var week= dt.getDay()==0?6:dt.getDay()-1
                            var hour=1
                            if(dt.getHours()<=12)
                                hour=0
                            else if(dt.getHours()>17)
                                hour=2
                            if(Element["properties"]["service_periods"][week*7+hour]=="N" &&dt.getHours()<21){
                                document.getElementsByClassName("btn-bot")[0].textContent="查看營業時間(營業中)"
                                document.getElementsByClassName("btn-bot")[0].style.backgroundColor="rgb(41,171,164)"
                                document.getElementsByClassName("btn-bot")[0].style.borderColor="rgb(41,171,164)"
                            }
                            else{
                                document.getElementsByClassName("btn-bot")[0].textContent="查看營業時間(休業中)"
                                document.getElementsByClassName("btn-bot")[0].style.backgroundColor="#ef5285"
                                document.getElementsByClassName("btn-bot")[0].style.borderColor="#ef5285"
                            }
                            
    
                            document.getElementById("mask-adult").textContent=Element["properties"]["mask_adult"];
                            if(Element["properties"]["mask_adult"]>50)
                                document.getElementById("mask-adult").style.backgroundColor="rgb(41,171,164)"
                            else if(Element["properties"]["mask_adult"]>0)
                                document.getElementById("mask-adult").style.backgroundColor="rgb(242,153,75)"
                            else
                                document.getElementById("mask-adult").style.backgroundColor="#ef5285"
                            
                            document.getElementById("mask-child").textContent=Element["properties"]["mask_child"];
                            if(Element["properties"]["mask_child"]>50)
                                document.getElementById("mask-child").style.backgroundColor="rgb(41,171,164)"
                            else if(Element["properties"]["mask_child"]>0)
                                document.getElementById("mask-child").style.backgroundColor="rgb(242,153,75)"
                            else
                                document.getElementById("mask-child").style.backgroundColor="#ef5285"
                            $(".card").show()
                            
                            document.getElementsByClassName("modal-title")[0].textContent=Element["properties"]["name"]+" 的營業時間如下";
                            for(let j=0;j<3;++j){
                                var code=""
                                if(j==0)
                                    code+="<td>早上</td>"
                                else if(j==1)
                                    code+="<td>下午</td>"
                                else
                                    code+="<td>晚上</td>"
                                for(let i=0;i<7;++i){
                                    if(Element["properties"]["service_periods"][j*7+i]=="N")
                                        code+='<td style="color:rgb(41,171,164);">○</td>'
                                    else
                                        code+='<td style="color:#ef5285;">╳</td>'   
                                }
                                document.getElementsByClassName("time")[j].innerHTML=code
                            }
                        }
                        if(nowPoint!=null){
                            nowPoint.setMap(null)
                            $(".card-body").fadeOut("slow",()=>{
                                handlePointChange()
                                $(".card-body").fadeIn("slow")
                            })
                        }
                        else{
                            $(".card-body").show()
                            handlePointChange()
                        }

                    });
                    


                    if(Index==Math.floor(data["features"].length/2))
                        $("#load-topic-1").fadeOut( "fast",function(){
                            $("#load-topic-2").fadeIn("fast")
                        })
                    if(Index==data["features"].length-1)
                        $("#load").hide()
                        document.getElementById("OMap").style.visibility="visible";
                }})
        },
        complete: function() {
        //請求完成的處理
        },
        error: function() {
        //請求出錯處理
        }
    });
}

getData()

const closeCard=()=>{
    $(".info-card").hide() 
}

const openGoogleMap=()=>{
    window.open(document.getElementsByClassName("btn-bot")[1].value, '_blank');
}