// adding the stop-levels
// assigning the unique id to each trips

const http = require('http');
const mysql = require('mysql');

const axios = require('axios');

var schedule = require('node-schedule');

var config = require('./config/config')


let intrackMap = new Map();
let nimbusMap = new Map();

let unit_object = {}
let nimbus_unit_array = []

let intrack_unit_object = {}
let intrack_unit_array = []


var fromDateVal = '';
var toDateVal =   '';

let eid = ''
let data6 = ''

var title = 'STM DAILY RUNTIME REPORT'


var token = config.TOKEN
const DB_HOST = config.HOST
const DB_USER = config.USER
const DB_PASS = config.PASS
const DB_DATABASE = config.RTR.DATABASE
const DB_TABLE = config.RTR.TABLE

 var database = DB_DATABASE + '.' + DB_TABLE
var nimbus_token = config.NIMBUS_TOKEN

var db = ''


var res = ''
var res2 = ''


  
  var vehicleData = [];
  var vehicleDataReverse = [];

  const server = http.createServer((req, res) => {});



  let runOnStart = async () => {

    var date = new Date();
    day = date.getDate() - 1;
    mon = date.getMonth() + 1;
    yr = date.getFullYear();

    res = yr + '-' + ('0'+mon).slice(-2) + '-' + ('0'+day).slice(-2)
    //res = '2021-12-29'
    console.log(res)

    var fromDate = new Date(res);
    fromDate.setHours('00');
    fromDate.setMinutes('00');
    fromDate.setSeconds('00');
    fromDateVal = fromDate.getTime()/1000;


    var toDate = new Date(res);
    toDate.setHours('23');
    toDate.setMinutes('59');
    toDate.setSeconds('59');
    toDateVal = toDate.getTime()/1000;



    await getAllDataAsync()

    await processIntrackData()

    //
    await getAllDataFromNimbus()

   //await letsProcess()

     // await savingNimbusDataResponse()

     //
     await letsProcess_2()

     // show()

    console.log(' ... process completed ...')

}


let savingNimbusDataResponse = () => {
try {
  let letDriver = ''

  for(let gg=0; gg<nimbus_unit_array.length; gg++) {

    let beginning = nimbus_unit_array[gg].beginning
    let end = nimbus_unit_array[gg].end
    let duration = nimbus_unit_array[gg].duration
    let average = nimbus_unit_array[gg].average
    let unit = nimbus_unit_array[gg].unit
    let date = nimbus_unit_array[gg].date
    let stop_name = nimbus_unit_array[gg].stop_name
    let direction = nimbus_unit_array[gg].direction
    let route_id = nimbus_unit_array[gg].route_id
    // let trip_id_01 = nimbus_unit_array[gg].trip_id_01
    let trip_id = nimbus_unit_array[gg].trip_id
    let schArr = nimbus_unit_array[gg].schDep
    let schDep = nimbus_unit_array[gg].schDep
    let actArr = nimbus_unit_array[gg].actArr
    let actDep = nimbus_unit_array[gg].actDep
    let diffDeparture = nimbus_unit_array[gg].diffDeparture
    let diffArrival = nimbus_unit_array[gg].diffArrival



    let post = {
          the_date: date,
          bus_number: unit,
          route_id: route_id,
          // trip_id_01: trip_id_01,
          trip_id: trip_id,
          driver_id: letDriver,
          // driver_id: '',
          direction: direction,
          stop_name: stop_name,
          schr_arr: schArr,
          schr_dep: schDep,
          act_arr: actArr,
          act_dep: actDep,
          // difference: delay
          diff_departure: diffDeparture,
          diff_arrival: diffArrival
    }

    // --- here actual database details ----
    let sql = 'insert into '+database+' set ?';

    let query = db.query(sql, post, (err, result) => {
        if(err) {
            console.log(err);
        }
    });


  }

} catch(ex) {
  console.log(' *************************** ')
  console.log(ex)
}
}



let letsProcess_2 = async () => {

console.log(' ---------- letsProcess() ----------')

      // console.log(intrackMap)
try {
  let letDriver = ''

  for(let gg=0; gg<nimbus_unit_array.length; gg++) {

    let beginning = nimbus_unit_array[gg].beginning
    let end = nimbus_unit_array[gg].end
    let duration = nimbus_unit_array[gg].duration
    let average = nimbus_unit_array[gg].average
    let unit = nimbus_unit_array[gg].unit
    let date = nimbus_unit_array[gg].date
    let stop_name = nimbus_unit_array[gg].stop_name
    let direction = nimbus_unit_array[gg].direction
    let route_id = nimbus_unit_array[gg].route_id
    // let trip_id_01 = nimbus_unit_array[gg].trip_id_01
    let trip_id = nimbus_unit_array[gg].trip_id
    let schArr = nimbus_unit_array[gg].schDep
    let schDep = nimbus_unit_array[gg].schDep
    let actArr = nimbus_unit_array[gg].actArr
    let actDep = nimbus_unit_array[gg].actDep
    let diffDeparture = nimbus_unit_array[gg].diffDeparture
    let diffArrival = nimbus_unit_array[gg].diffArrival

    let theDriverName = await getTheDriverName(unit, beginning, end)

    console.log('theDriverName: ' + theDriverName)

    for(let [key, ent] of intrackMap.entries()) {

      // if(unit != 'W31448') {
      if(intrackMap.has(unit)) {
        if(key == unit) {

          // console.log(ent.)
          // console.log(key)
          // console.log(unit + '\n')

         // here undo




            let post = {
              the_date: date,
              bus_number: unit,
              route_id: route_id,
              // trip_id_01: trip_id_01,
              trip_id: trip_id,
              driver_id: theDriverName,
              // driver_id: '',
              direction: direction,
              stop_name: stop_name,
              schr_arr: schArr,
              schr_dep: schDep,
              act_arr: actArr,
              act_dep: actDep,
              // difference: delay
              diff_departure: diffDeparture,
              diff_arrival: diffArrival
            }

            // --- here actual database details ----
            let sql = 'insert into '+database+' set ?';
            let query = db.query(sql, post, (err, result) => {
                if(err) {
                    console.log(err);
                }
            });

            break;
          // }
          // else {
          //   continue
          // }



        // }

        } // if
      }
      else {

        console.log('------ ' + unit + ' -- not available')

      let post = {
        the_date: date,
        bus_number: unit,
        route_id: route_id,
        // trip_id_01: trip_id_01,
        trip_id: trip_id,
        // driver_id: letDriver,
        driver_id: '',
        direction: direction,
        stop_name: stop_name,
        schr_arr: schArr,
        schr_dep: schDep,
        act_arr: actArr,
        act_dep: actDep,
        // difference: delay
        diff_departure: diffDeparture,
        diff_arrival: diffArrival
      }

      // --- here actual database details ----
      // let sql = 'insert into '+database+' set ?';
      //
      // let query = db.query(sql, post, (err, result) => {
      //     if(err) {
      //         console.log(err);
      //     }
      // });


      }

    } // for

  }
} catch(ex) {
  console.log(' *************************** ')
  console.log(ex)
}

}

let getTheDriverName = async (unit, nimBegg, nimEnd) => {
  let letDriver = ''
  for(let [key, ent] of intrackMap.entries()) {

    // if(unit != 'W31448') {
    if(intrackMap.has(unit)) {
      if(key == unit) {
        console.log('\nlength: ' + ent.length + ' -->  ' + nimBegg + '  -  ' + nimEnd)

        for(let hh=0; hh<ent.length; hh++) {

          // TICK:  this will make a full driver name regardless of the .....
          letDriver = ent[hh].driver_id
          console.log(hh + ' : ' + letDriver)

          let nim_Begg_test = new Date(nimBegg)
          let nim_Endd_test = new Date(nimEnd)
          let int_Begg_test = new Date(ent[hh].beginning)
          let int_Endd_test = new Date(ent[hh].end)

          // console.log(int_Begg_test + '     ' + ent[hh].beginning)

          // providing the range for the time of intrack to catch the time from the nimbus
          let int_Begg_init = new Date(ent[hh].beginning)
          int_Begg_init = int_Begg_init.setMinutes(int_Begg_init.getMinutes() - 45)
          int_Begg_init = new Date(int_Begg_init)

          let int_Begg_final = new Date(ent[hh].beginning)
          int_Begg_final = int_Begg_final.setMinutes(int_Begg_final.getMinutes() + 45)
          int_Begg_final = new Date(int_Begg_final)


          let int_Endd_init = new Date(ent[hh].end)
          int_Endd_init = int_Endd_init.setMinutes(int_Endd_init.getMinutes() - 45)
          int_Endd_init = new Date(int_Endd_init)

          let int_Endd_final = new Date(ent[hh].end)
          int_Endd_final = int_Endd_final.setMinutes(int_Endd_final.getMinutes() + 45)
          int_Endd_final = new Date(int_Endd_final)


          if(int_Begg_init <= nim_Begg_test && nim_Begg_test <= int_Begg_final) {
            if(int_Endd_init <= nim_Endd_test && nim_Endd_test <= int_Endd_final) {


              console.log(int_Begg_init + '\n' + nim_Begg_test + '\n' + int_Begg_final)
              console.log()

              console.log(int_Endd_init + '\n' + nim_Endd_test + '\n' + int_Endd_final)
              // console.log(typeof int_Endd_test)
              console.log()
              console.log()

              letDriver = ent[hh].driver_id
              // console.log('letDriver: '+letDriver + '\n')
              break;
            }
          }




        }
      }
    }
  }

  return letDriver
}


let letsProcess = () => {

console.log(' ---------- letsProcess() ----------')

try {
  let letDriver = ''

  for(let gg=0; gg<nimbus_unit_array.length; gg++) {

    let beginning = nimbus_unit_array[gg].beginning
    let end = nimbus_unit_array[gg].end
    let duration = nimbus_unit_array[gg].duration
    let average = nimbus_unit_array[gg].average
    let unit = nimbus_unit_array[gg].unit
    let date = nimbus_unit_array[gg].date
    let stop_name = nimbus_unit_array[gg].stop_name
    let direction = nimbus_unit_array[gg].direction
    let route_id = nimbus_unit_array[gg].route_id
    // let trip_id_01 = nimbus_unit_array[gg].trip_id_01
    let trip_id = nimbus_unit_array[gg].trip_id
    let schArr = nimbus_unit_array[gg].schDep
    let schDep = nimbus_unit_array[gg].schDep
    let actArr = nimbus_unit_array[gg].actArr
    let actDep = nimbus_unit_array[gg].actDep
    let diffDeparture = nimbus_unit_array[gg].diffDeparture
    let diffArrival = nimbus_unit_array[gg].diffArrival

    for(let [key, ent] of intrackMap.entries()) {
    // let key = intrackMap.get(unit)

    // let key_01 = key[0].grouping
      if(key == unit) {

       // here undo
        for(let hh=0; hh<key.length; hh++) {
          letDriver = ent[hh].driver_id
          // letDriver = key[0].driver_id

          break;

        }


        let post = {
          the_date: date,
          bus_number: unit,
          route_id: route_id,
          // trip_id_01: trip_id_01,
          trip_id: trip_id,
          driver_id: letDriver,
          // driver_id: '',
          direction: direction,
          stop_name: stop_name,
          schr_arr: schArr,
          schr_dep: schDep,
          act_arr: actArr,
          act_dep: actDep,
          // difference: delay
          diff_departure: diffDeparture,
          diff_arrival: diffArrival
        }

        // console.log('------ ***** ------ ' + gg)

        // --- here actual database details ----
        /*
        let sql = 'insert into '+database+' set ?';

        let query = db.query(sql, post, (err, result) => {
            if(err) {
              console.log('===============')
              console.log(diffDeparture)
              console.log(diffDeparture)
                //console.log('erro while inserting the record. '+err);
                console.log(err);
            }
        });
        */



      } // if
    } // for

  }
} catch(ex) {
  console.log(' *************************** ')
  console.log(ex)
}

}




let processIntrackData = async () => {

  await getURLOneData()

  await getAllVehicles()

  await getURLTwoData()

  await getURLThreeData()

  await getURLFourData()

  // console.log('..... calling  getURLFiveData() .....')
  await getURLFiveData()

}





let processforURL5 = async (response) => {
  console.log('... processforURL5() ....')
  try {
    let grouping = ''
    let driver_name = ''

    if(response.data !== undefined) {
      let coreData = response.data;

      let vehicle = '';
      for(let ii=0; ii<coreData.length; ii++) {
        let theData = coreData[ii].r;

        for(let jj=0; jj<theData.length; jj++) {
          let response_one = theData[jj].r;

          for(let kk=0; kk<response_one.length; kk++) {
            let response_two = response_one[kk].r

            for(let mm=0; mm<response_two.length; mm++) {
              let response_three = response_two[mm].r


              for(let nn=0; nn<response_three.length; nn++ ) {
                let response_four = response_three[nn].r;

                let final_response = response_four



                for(let zz=0; zz<final_response.length; zz++) {
                  try {
                  intrack_unit_array = []

                  beginning = '';

                  grouping = final_response[zz].c[1];

                  //if(grouping == TEST_UNIT) {


                    beginning = final_response[zz].c[2].t;
                    if(beginning == undefined) {
                      beginning = final_response[zz].c[2]
                    }
                    end = final_response[zz].c[4].t;

                    beginning = res + beginning

                    if(end.split(' ').length > 1) {

                    } else {
                      end = res + end
                    }

                    let testtDate = beginning.split(' ')[0];
                    let testtTime = beginning.split(' ')[1];
                    // console.log(grouping +' --2-- ' + beginning)
                    let ne = ''
                    let test = beginning.split(' ')

                    try{
                      ne = new Date(beginning);
                    } catch(ex) { console.log('******** '+ex)}

                    ne.setHours(ne.getHours() + 4)

                    let dateHrs = ('0' + ne.getHours()).slice(-2)
                    let dateMin = ('0' + ne.getMinutes()).slice(-2)
                    let dateSec = ('0' + ne.getSeconds()).slice(-2)

                    beginning = testtDate + ' ' + dateHrs + ':' + dateMin + ':' + dateSec;

                    initial_location = final_response[zz].c[3].t;

                    // 2019-11-09 23:37:10
                    let testtDate_2 = end.split(' ')[0];

                    let ne_2 = new Date(end);
                    ne_2.setHours(ne_2.getHours() + 4)

                    let endDateHrs = ('0' + ne_2.getHours()).slice(-2)
                    let endDateMin = ('0' + ne_2.getMinutes()).slice(-2)
                    let endDateSec = ('0' + ne_2.getSeconds()).slice(-2)

                    end = testtDate_2 + ' ' + endDateHrs + ':' + endDateMin + ':' + endDateSec;

                    // got data
                    // now compare with nimbusMap
                    final_location = final_response[zz].c[5].t;

                    let driver = final_response[zz].c[13];

                    // console.log('..... driver name ....')
                    // console.log(beginning + '  -  ' + end)
                    // console.log(driver+'\n')

                    let obj = {}

                    obj.grouping = grouping
                    obj.beginning = beginning
                    obj.end = end
                    obj.initial_location = initial_location
                    obj.final_location = final_location
                    obj.driver_id = driver

                    intrack_unit_array.push(obj)

                    //
                    let len = intrack_unit_array.length-1;
                    let id = intrack_unit_array[len]

                    id = id.grouping

                    // trying to update if exists or adding new object
  // if(intrackMap.get(id) != null && intrackMap.get(id) != null) {
    if(intrackMap.get(id) != null) {
      let intrackDataSet = intrackMap.get(id)
      intrackDataSet.push(obj)

      intrackMap.set(id, intrackDataSet)
  } else {
    intrackMap.set(id, intrack_unit_array)
  }

// intrackMap.set(id, intrack_unit_array) here .....

      //} // if(grouping == TEST_UNIT)

} catch(ex) {
console.log(' --- here ----')
console.log(ex)
}



} // final_response


} // end loop: response_three

} // end loop: response_two

console.log('---- intrack data:   ' + intrackMap.size + '  units')
//console.log(intrackMap)


// so far so good
// got datas from intrack and nimbus
// now trying to match and map the data from both sets
}

}

}

} else {
console.log('response.data === undefined');
}
} catch(err) {
console.log(' ++++++++++ err ++++++++    '+err);
}
}





let getURLOneData = async () => {
let url = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"'+token+'"}';

let response = ''

try {
response = await axios.get(url);
} catch(err) {
console.log(err)
}

eid = response.data.eid;
 //console.log(eid)
return response
}


let getURLTwoData = async () => {
let url = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"'+token+'"}';
var eid = '';

let resp = ''
try {
resp = await axios.get(url)
eid = resp.data.eid;
} catch(ex) {
console.log(ex)
}
}

let getURLThreeData = async () => {
let urlThree = 'https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec": {' +
'"itemsType": "avl_resource",' +
'"propName": "sys_name",' +
'"propValueMask": "*",' +
'"sortType": "sys_name"' +
'},' +
'"force": 1,' +
'"flags": "8193",' +
'"from": 0,' +
'"to": 0' +
'}&sid='+eid;

let response = ''

try {
response = await axios.get(urlThree)
} catch(ex) {
console.log(ex)
}

let ii = '27';
let resourceID = '';
let reourceName = '';
let id = '';
let name = '';
let ct = '';
let c = '';

try {
resourceID = response.data.items[0].id;
reourceName = response.data.items[0].nm;
id = response.data.items[0].rep[ii].id;
name = response.data.items[0].rep[ii].n;
ct = response.data.items[0].rep[ii].ct;
c = response.data.items[0].rep[ii].c;

// console.log(resourceID+'\n'+reourceName+'\n'+name+'\n'+ct+'\n'+c);
} catch(err) {
console.log('err ----------'+err);
// throw new Error(err);
}

// TODO

}

let getURLFourData = async () => {
let url4 = 'https://hst-api.wialon.com/wialon/ajax.html?svc=report/exec_report&params={' +
'"reportResourceId":'+16278637+','+
'"reportTemplateId":'+27+','+ // 27 -- -CLETEKG group Trips Kinglong Only
'"reportObjectId":19194735,'+
'"reportObjectSecId":0,'+
'"interval":{'+
'"from":'+fromDateVal+','+
'"to":'+toDateVal+','+
'"flags":0'+
'}}&sid='+eid;

let response = ''

try {
response = await axios.get(url4, {
headers: {
Authorization: nimbus_token
}
})
} catch(ex) {
console.log(ex)
}
}

let getURLFiveData = async () => {
let url5 = 'https://hst-api.wialon.com/wialon/ajax.html?svc=report/select_result_rows&params={' +
'"tableIndex":0,' + // tableIndex: 0 --
'"config":{' +
'"type":"range",' +
'"data":{"from":0,"to":0,"level":7,"unitInfo":1}' +
'}}&sid='+eid;

let response = ''
try {
response = await axios.get(url5, {
headers: {
Authorization: nimbus_token
}
})

processforURL5(response)

} catch(ex) {
console.log('in getURLFiveData() method')
console.log(ex)
}

}


let getAllDataAsync = async () => {

let url = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"'+token+'"}';

const responseOne = await getURLOneData(url);
eid = responseOne.data.eid;

console.log(eid)

let url6 = 'https://hst-api.wialon.com/wialon/ajax.html?params= {'+
'"spec": {'+
'"itemsType": "avl_unit",'+
'"propName": "sys_name",'+
'"propValueMask": "*",'+
'"sortType": "sys_name"'+
'},'+
'"force": 1,'+
'"flags": 1,'+
'"from": 0,'+
'"to": 4294967295'+
'}&svc=core/search_items&sid='+eid;
const data6 = await getAllVehicles(url6);

}



let getAllVehicles = async () => {
let url6 = 'https://hst-api.wialon.com/wialon/ajax.html?params= {'+
'"spec": {'+
'"itemsType": "avl_unit",'+
'"propName": "sys_name",'+
'"propValueMask": "*",'+
'"sortType": "sys_name"' +
'},'+
'"force": 1,'+
'"flags": 1,'+
'"from": 0,'+
'"to": 4294967295'+
'}&svc=core/search_items&sid='+eid;

let resp = ''

try {
resp = await axios.get(url6);
} catch(ex) {
console.log(ex)
}

console.log(url6)
console.log(resp)
console.log()
data6 = resp.data.items;
vehicleData = []
vehicleDataReverse = []

for(let j=0; j<data6.length; j++) {
vehicleData[data6[j].nm] = data6[j].id;  // vehicleData[F21826] = 19099024
vehicleDataReverse[data6[j].id] = data6[j].nm; // vehicleData[19099024] = F21826
// if(data6[j].nm == 'W31448') {
//  console.log(data6[j].nm + ' -- ' + data6[j].id)
// }

}

// console.log('data6.length:  ' + data6.length)
}



let getAllDataFromNimbus = async () => {

let nimbusAPIOneURL = 'https://nimbus.wialon.com/api/depots';

//const resp =  callNimbusDepotAPI(nimbusAPIOneURL);
callNimbusDepotAPI(nimbusAPIOneURL);

for(let dd=1; dd<=data6.length; dd++) {
// for(let dd=1; dd<=1; dd++) {

try {
if(data6[dd] != undefined) {
let theUnit = data6[dd].nm

//if(theUnit == TEST_UNIT) {

let unit_equivalent = data6[dd].id
// let unit_equivalent = '18390603'
// unit rides (details)

let theRouteURL = 'https://nimbus.wialon.com/api/depot/2097/report/avl_unit/'+unit_equivalent+'?flags=1&df='+res+'&dt='+res+'&sort=timetable'
console.log(theRouteURL)
let response = await axios.get(theRouteURL, {
 headers: {
     Authorization: nimbus_token
 }
})

// console.log('********************************')

if(response != undefined) {

  let subResult = response.data.report_data

  console.log(response.data)

  if(subResult != undefined) {

  subResult = subResult.rows; // all rows


  for(let ll=0; ll<subResult.length; ll++) {

    let header_route_name = subResult[ll].cols[0].t // GD09 Qusais, Public Transport Depot 2 — DXB SUPER GATE (G3) (INBOUND GD09)
    let route_id = header_route_name.split(' ')[0] // GD12

    let direction = header_route_name.split(' ').slice(1).join(' ');
    direction = direction.match(/\(([^)]*)\)[^(]*$/)[1];
    direction = direction.toLowerCase()
    if ( /in|inbound|in bound/.test( direction )) {
        direction = 'inbound';
    }
    else if ( /out|outbound|out bound/.test( direction )) {
        direction = 'outbound';
    }


    let _testTimeSch = subResult[ll].cols[3].t // 03:47 - 04:20



    let subRows = subResult[ll].rows

    let result = subResult[ll].cols[11].t

    // we got it
    // now get all sub route names one by one
    let colObject = subResult[ll].cols
    let testR = colObject[0].t
    let routeAssigned = colObject[0].t // GD09 Qusais, Public Transport Depot 2 — DXB SUPER GATE (G3) (INBOUND GD09)
    routeAssigned = routeAssigned.split(' ')[0] // GD12

    let assignedTime = subResult[ll].cols[3].t // 03:47 - 04:20

    assignedTime = assignedTime.split('-')


    // format - 1
    let assignTimeIni = assignedTime[0].trim()
    let assignTimeEnd = assignedTime[1].trim()
    let trip_id = routeAssigned + '_' + assignTimeIni + '_' + assignTimeEnd


    // format - 2
    let sampleDate = res2 + ' ' + assignTimeEnd
    sampleDate = new Date(sampleDate)
    let trip_id_02 = sampleDate.getTime() / 1000


    let rowObject = subResult[ll].rows;

    for(let kk=0; kk<rowObject.length; kk++) {

      let nimObj = {}
    // for(let kk=0; kk<15; kk++) {
      let subObjec = rowObject[kk]
      let name = subObjec[0].t


       // schedule data........
       let new_sch = subObjec[3].t
       // new_sch = theDate + ' ' + new_sch
       // console.log('\n------------------------------------ ' + new_sch)
       // console.log(subObjec)

       let new_sch_arr = new_sch
       let new_sch_dep = new_sch


      let newArr = subObjec[4].t
      let newDept = subObjec[5].t




      if((newDept != '—') && (new_sch_dep != '—')) {
        // newDept = newDept.split(' ')[1]
        let actDepartureDate = res + ' ' + newDept
        let schDepartureDate = res + ' ' + new_sch_dep

        actDepartureDate = new Date(actDepartureDate)
        schDepartureDate = new Date(schDepartureDate)


        difference_departure = Math.floor( (schDepartureDate.getTime() - actDepartureDate.getTime()) / 60 ) / 1000


      } else {
          difference_departure = '-'
          newDept = '-'
      }



      if((newArr != '—') && (new_sch_arr != '—')) {
        // actArr = actArr.split(' ')[1]
        let actArrivalDate = res + ' ' + newArr
        let schArrivalDate = res + ' ' + new_sch_arr
        actArrivalDate = new Date(actArrivalDate)
        schArrivalDate = new Date(schArrivalDate)

        difference_arrival = Math.floor( (schArrivalDate.getTime() - actArrivalDate.getTime()) / 60) / 1000
      } else {
        difference_arrival = '-'
        newArr = '-'
      }


      name = name.substring(3, name.length)


      let time_01 = new_sch.split('-')[0]
      let time_02 = new_sch.split('-')[1]




      nimObj.beginning = res + assignTimeIni
      nimObj.end = res + assignTimeEnd
      nimObj.duration = subObjec[6].t
      nimObj.average = subObjec[7].t
      nimObj.unit = theUnit
      nimObj.date = res
      nimObj.stop_name = name
      nimObj.direction = direction
      nimObj.route_id = route_id
      // nimObj.trip_id_01 = 'trip_id_02'
      nimObj.trip_id = trip_id
      nimObj.schArr = new_sch_arr
      nimObj.schDep = new_sch_dep
      nimObj.actArr = newArr
      nimObj.actDep = newDept
      nimObj.diffDeparture = difference_departure
      nimObj.diffArrival = difference_arrival

      //nimbus_unit_array.push(nimObj)
      
      nimbus_unit_array.push(nimObj)
    

    } // kks

  } // ll

}

} // response != undefined

//} // if(grouping == TEST_UNIT)

}
} catch(ex) {
console.log(' --- in catch(0) ---')
console.log(ex)

console.log('nimbus: '+nimbus_unit_array.length)
}

} // dd

console.log('----processNimbusDataResponse nimbus data:   ' + nimbus_unit_array.length + ' trips')

}


let callNimbusDepotAPI = async (url) => {
  // console.log('*****  '+url+'  ********')
  try {
  let response = await axios.get(url, {
  headers: {
    Authorization: nimbus_token
  }
  });

  return response;
  } catch(err) {
  console.log('callNimbusDepotAPI .... ..... ........'+err);
}
}


let callNimbusAPI = async (url) => {

  let response = '';
  // setTimeout(async () => {
  try {
  response = await axios.get(url, {
    headers: {
        Authorization: nimbus_token
    }
  });

  return response;
  } catch(err) {
  console.log('callNimbusAPI ... >>>'+err)
  }
// }, 1000);

}







let generateCSV = () => {
  ws = fs.createWriteStream(config.RTR.CSV_PATH + config.RTR.CSV_FILE_NAME + theDateForNimbus + '.csv');
  
  let sql = 'select distinct * from '+database+' where beginning >= '+theDateForNimbus //+currentDate
    console.log(sql)
    let query = db.query(sql, (err, data) => {
        if(err){
          console.log('erro while retrieving the record. '+err);
          console.log(err)
          console.log('\n\n')
        }

        const jsonData = JSON.parse(JSON.stringify(data));
        //console.log("jsonData", jsonData);

      
      for(let kk=0; kk<jsonData.length; kk++) {
          let begg = jsonData[kk].beginning
          let endd = jsonData[kk].end

          begg = new Date(begg)
          endd = new Date(endd)

          /*console.log(typeof schDate)
          console.log()
          console.log(typeof arrDate)
          console.log()*/

          jsonData[kk].beginning = begg.getFullYear() + '-'+begg.getMonth() + '-' + begg.getDate() + ' ' 
                                          + begg.getHours() + ':' + begg.getMinutes() + ':' + begg.getSeconds()

          jsonData[kk].end = endd.getFullYear() + '-'+endd.getMonth() + '-' + endd.getDate() + ' ' 
                                  + endd.getHours() + ':' + endd.getMinutes() + ':' + endd.getSeconds()
      }
      

        fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function() {
          console.log("Successfully generated csv");
        })
        .pipe(ws);

    });
}


let sendEmail = async () => {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'support@inbound.ae',
        pass: 'P@ssw0rd@inbound'
      }
  })


  let listOfaddresses = 'ammar.redhat@gmail.com,';
                         // +
                         // 'shafirk@et.ae,'+
                          //'bijoybp@et.ae,'+
                          //'ekgstafftran@emirates.com,'+
                         // 'ashwin.nayar@emirates.com';

  let cclist = 'alou.redhat@gmail.com';




  let theDate = yr + '-' + ('0'+mon).slice(-2) + '-' + ('0'+day).slice(-2); 
  //let filename = 'Realtime_Report_'+theDate;

  
  let fileName = 'Realtime_Report_'+theDate+'.csv';
  let subject_line = 'Realtime Report Report'


  let fileAttachment = '/home/inbound/Documents/All_Reports_Files/EKG/2021/'+fileName

  console.log(fileAttachment)

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Inbound" <support@inbound.ae>', // sender address
      to: listOfaddresses, // list of receivers
      cc: cclist,
      subject: subject_line, // Subject line

      attachments: [
          {
              filename: fileName,
              path: fileAttachment
          }
      ]
  };

  transporter.sendMail(mailOptions, (error, success) => {
      if(error) {
          console.log(error)
      }

      console.log('Message sent. ')
      console.log(success)
  })
}








let getConnection = () => {

  db = mysql.createConnection({
    host     : DB_HOST,
    user     : DB_USER,
    password : DB_PASS,
    database : DB_DATABASE
  });

  db.connect((err) => {
    if(err){
        throw err;
    }

    console.log('MySql Connected...');
  });
}



let closeConnection = () => {
  db.end((err) => {
    if(err) {
      throw err
    }

    process.exit(1)
  })
}

  server.listen(3112, async () => {
    console.log('server running ...');
    
   await getConnection()
    await runOnStart()
    await closeConnection()
    await generateCSV()
    await sendEmail()
  

    
    // let job = schedule.scheduleJob('45 00 * * *', async function() {
    //   await getConnection()
    //   await runOnStart()
    //   await closeConnection()
    //   await sendEmail()
    // })

  })
