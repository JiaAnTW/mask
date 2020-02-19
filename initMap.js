var myMap = L.map('mapid', {
    center: [22.73444963475145, 120.28458595275877],
    zoom: 14
});

var dt = new Date();
var nowPoint=null

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 40,
    //attribution: 'Map data: © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);

var blueIcon = L.icon({
    iconUrl: 'https://i.imgur.com/bJbfHdf.png',
    iconSize:     [32, 55], // size of the icon
    iconAnchor:   [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var greenIcon = L.icon({
    iconUrl: 'https://i.imgur.com/nBNymm3.png',
    iconSize:     [32, 55], // size of the icon
    iconAnchor:   [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var yellowIcon = L.icon({
    iconUrl: 'https://i.imgur.com/nHKXMQa.png',
    iconSize:     [32, 55], // size of the icon
    iconAnchor:   [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var redIcon = L.icon({
    iconUrl: 'https://i.imgur.com/KEfkAbV.png',
    iconSize:     [32, 55], // size of the icon
    iconAnchor:   [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var markerOptions = {
    fillColor: 'rgb(242,153,75)',
    color: 'rgb(242,153,75)',
    opacity: 1,
    fillOpacity: 0.8
};

var centerPoint=null
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
            centerPoint=[position.coords.latitude, position.coords.longitude]
            myMap.setView([position.coords.latitude, position.coords.longitude],15);
            nowPoint=[L.circleMarker([position.coords.latitude, position.coords.longitude],{
                radius: 20,
                fillColor: '#212529',
                color: '#212529',
                opacity: 1,
                fillOpacity: 0.8
            }),L.circleMarker([position.coords.latitude, position.coords.longitude],{
                radius: 10,
                fillColor: '#212529',
                color: '#212529',
                opacity: 1,
                fillOpacity: 0.8
            })]
            nowPoint[0].addTo(myMap)
            nowPoint[1].addTo(myMap)
      });
    } else {
    }
}
getLocation()

const backToCenter=()=>{
    if(centerPoint!=null){
        nowPoint[0].setLatLng(new L.LatLng(centerPoint[0], centerPoint[1]))
        nowPoint[1].setLatLng(new L.LatLng(centerPoint[0], centerPoint[1]))
        myMap.panTo(centerPoint)
    }
        
    else
        getLocation()
}

const closeCard=()=>{
    $(".info-card").hide()
    document.getElementsByClassName("option-area")[0].style.bottom="70px"; 
}

const openGoogleMap=()=>{
    window.open(document.getElementsByClassName("btn-bot")[1].value, '_blank');
}

$(".shade").hide()

const closeModal=()=>{
    
    $(".shade").fadeOut("slow",()=>{
        document.getElementsByClassName("shade")[0].style.zIndex=0
    })
}
document.getElementsByClassName("shade")[0].addEventListener("click",closeModal)
const openModal=()=>{
    document.getElementsByClassName("shade")[0].style.zIndex=5
    $(".shade").fadeIn("slow")
}

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
            const handleClick=(Element)=>{
                if(nowPoint==null){
                    if(window.innerWidth<674)
                        myMap.setView([Element["geometry"]["coordinates"][1],Element["geometry"]["coordinates"][0]],18);
                    else
                        myMap.setView([Element["geometry"]["coordinates"][1],Element["geometry"]["coordinates"][0]],18);
                    nowPoint=[L.circleMarker([Element["geometry"]["coordinates"][1],Element["geometry"]["coordinates"][0]],{
                        radius: 20,
                        fillColor: 'rgb(242,153,75)',
                        color: 'rgb(242,153,75)',
                        opacity: 1,
                        fillOpacity: 0.8
                    }),L.circleMarker([Element["geometry"]["coordinates"][1],Element["geometry"]["coordinates"][0]],{
                        radius: 10,
                        fillColor: 'rgb(242,153,75)',
                        color: 'rgb(242,153,75)',
                        opacity: 1,
                        fillOpacity: 0.8
                    })]
                    nowPoint[0].addTo(myMap)
                    nowPoint[1].addTo(myMap)
                }
                nowPoint[0].setLatLng(new L.LatLng(Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]))
                nowPoint[1].setLatLng(new L.LatLng(Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]))
                if(window.innerWidth<674)
                    myMap.panTo(new L.LatLng(Element["geometry"]["coordinates"][1]-0.005, Element["geometry"]["coordinates"][0]))
                else
                myMap.panTo(new L.LatLng(Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]))
                const handlePointChange=()=>{
                    document.getElementsByClassName("card-title")[0].textContent=Element["properties"]["name"];
                    document.getElementsByClassName("card-subtitle")[0].textContent=Element["properties"]["address"];
                    /*let realNote=""
                    if(Element["properties"]["note"]!="-"){
                    for(let i=0;i<Element["properties"]["note"].length;++i){
                            if((Element["properties"]["note"][i]>="0" && Element["properties"]["note"][i]<="9")
                            ||Element["properties"]["note"][i]==":" ||Element["properties"]["note"][i]=="點")
                                realNote+= "<strong>"+Element["properties"]["note"][i]+"</strong>"
                            else
                                realNote+=  Element["properties"]["note"][i]
                        }
                    }*/

                    document.getElementsByClassName("card-text")[0].innerHTML=Element["properties"]["note"]
                    document.getElementsByClassName("btn-bot")[1].value = "https://www.google.com/maps/search/?api=1&query="+Element["properties"]["county"]+Element["properties"]["name"];
                    document.getElementById("tel").textContent=Element["properties"]["phone"];

                    
                    let week= dt.getDay()==0?6:dt.getDay()-1
                    let hour=1
                    if(dt.getHours()<=12)
                        hour=0
                    else if(dt.getHours()>17)
                        hour=2
                    
                    if(Element["properties"]["service_periods"][week*3+hour]=="N" &&dt.getHours()<21){
                        document.getElementsByClassName("btn-bot")[0].textContent="查看營業時間(營業中)"
                        document.getElementsByClassName("btn-bot")[0].style.backgroundColor="rgb(41,171,164)"
                        document.getElementsByClassName("btn-bot")[0].style.borderColor="rgb(41,171,164)"
                    }
                    else{
                        console.log(Element["properties"]["service_periods"])
                        console.log(dt.getHours())
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
                        let code=[]
                        if(j==0)
                            code.push("<td>早上</td>")
                        else if(j==1)
                            code.push("<td>下午</td>")
                        else
                            code.push("<td>晚上</td>")
                        document.getElementsByClassName("time")[j].innerHTML=code.join("")
                        for(let i=0;i<7;++i){
                            if(Element["properties"]["service_periods"][j*7+i]=="N"){
                                let child = document.createElement('td');
                                child.innerHTML = "○";
                                child.style.color="rgb(41,171,164)"
                                document.getElementsByClassName("time")[j].appendChild(child);
                            }
                            else{
                                let child = document.createElement('td');
                                child.innerHTML = "╳";
                                child.style.color="#ef5285"
                                document.getElementsByClassName("time")[j].appendChild(child);
                            }
                        }
                        
                    }
                }
                
                 
                $(".card-body").show(()=>{
                    if(window.innerWidth<674)
                        document.getElementsByClassName("option-area")[0].style.bottom="350px";
                })
                handlePointChange()

            }



            data["features"].forEach((Element,Index)=>{
                    //myMap.setCenter(test)
                    if(Element["properties"]["note"].indexOf("號碼")!=-1)
                        L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {icon: blueIcon}).addTo(myMap).on("click",()=>{handleClick(Element)});
                    else if(Element["properties"]["mask_adult"]>50)
                        L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {icon: greenIcon}).addTo(myMap).on("click",()=>{handleClick(Element)});
                    else if(Element["properties"]["mask_adult"]>0)
                        L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {icon: yellowIcon}).addTo(myMap).on("click",()=>{handleClick(Element)});
                    else
                        L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {icon: redIcon}).addTo(myMap).on("click",()=>{handleClick(Element)});
                    
                    


                    /*if(Index==Math.floor(data["features"].length/2))
                        $("#load-topic-1").fadeOut( "fast",function(){
                            $("#load-topic-2").fadeIn("fast")
                        })
                    if(Index==data["features"].length-1){
                        $("#load").hide()
                        document.getElementById("mapid").style.visibility="visible";
                    }*/
            })
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