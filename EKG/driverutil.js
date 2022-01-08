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
// let letDriver = ''
let driver_Name_Global = ''


var title = 'V2 GUI-CLETEKG Driver Trips Report with Message Tracing'

let theDateForNimbus = ''
var res = ''


var token = config.TOKEN
const DB_HOST = config.HOST
const DB_USER = config.USER
const DB_PASS = config.PASS
const DB_DATABASE = config.DRIVER_UTIL.DATABASE
const DB_TABLE = config.DRIVER_UTIL.TABLE

 var database = DB_DATABASE + '.' + DB_TABLE
var nimbus_token = config.NIMBUS_TOKEN

var db = ''


// Connect
function getDBConnection() {
  
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


function closeDBConnection() {
  db.end((err) => {
    if(err) {
      return console.log(err)
    }
  
    console.log('Database connection closed.\n')
  })
}



  var vehicleData = [];
  var vehicleDataReverse = [];

  const server = http.createServer((req, res) => {});

  let runOnStart = async () => {

    var date = new Date();
      date.setDate(date.getDate()-1)
      day = date.getDate();
      mon = date.getMonth() + 1;
      yr = date.getFullYear();

      theDateForNimbus = yr + '-' + ('0'+   mon).slice(-2) + '-' + ('0'+day).slice(-2)
      //theDateForNimbus = '2021-12-28'  //'2020-12-27' //'2020-10-20'
      res = theDateForNimbus + ' '

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





      await getURLOneData()
      // getAllUnitsData()

      await getAllDataFromNimbus()


      // await processIntrackData()
      await savingNimbusDataResponse()

      // await processIntrackData()

      console.log(' ... process completed ...')

}

  let display = async (unit, begg, endd) => {
    console.log('in display() .......')

    if(begg != '—'  &&  endd != '—') {

          let reportObjectId = await getURLThreeData(unit)

          // 28.01.2020 16:41
          begg = begg.split(' ')[1]         // 16:41
          let begg_hr = begg.split(':')[0]  // 16
          let begg_min = begg.split(':')[1] // 41

          // 28.01.2020 16:41
          endd = endd.split(' ')[1]         // 00:35
          let endd_hr = endd.split(':')[0]  // 00
          let endd_min = endd.split(':')[1] // 35






          fromDate = new Date(res);
          fromDate.setHours(begg_hr);
          fromDate.setMinutes(begg_min);
          fromDate.setSeconds('00');
          fromDateVal = fromDate.getTime()/1000;



          let res_2 = ''
          // this situation where trip ends on next day after mifnight
          // 23:35 - 00:35
          if(begg_hr > endd_hr) {
            // console.log(begg_hr + '  ' + endd_hr)
            let new_date = new Date(res)

            new_date.setDate(new_date.getDate() + 1)

            let yr = new_date.getFullYear()
            let mn = new_date.getMonth() + 1
            let dt = new_date.getDate()

            mn = ('0'+mn).slice(-2)
            dt = ('0'+dt).slice(-2)

             res_2 = yr + '-' + mn + '-' + dt + ' '
             // console.log(res)
             toDate = new Date(res_2);
             toDate.setHours(endd_hr);
             toDate.setMinutes(endd_min);
             toDate.setSeconds('00');
             // console.log(toDate)
             toDateVal = toDate.getTime()/1000;
          } else {
            toDate = new Date(res);
            toDate.setHours(endd_hr);
            toDate.setMinutes(endd_min);
            toDate.setSeconds('00');
            // console.log(toDate)
            toDateVal = toDate.getTime()/1000;
          }


            // let reportObjectId = '19194735'
            console.log('1. ' + reportObjectId)
            console.log('calling getURLFourData() .... ')
          await getURLFourData(reportObjectId, fromDateVal, toDateVal)
            console.log('calling getURLFiveData() ....')
          await getURLFiveData()
        }

  }




  let processforURL5 = async (response) => {
    console.log('    in processforURL5() ....')
      try {
        let grouping = ''
        let driver_name = ''

        if(response.data != undefined) {
          let coreData = response.data;
          let vehicle = '';

          // saving intrack data
          for(let ii=0; ii<coreData.length; ii++) {

            try {

              let len = coreData[ii].c
              len = len.length - 1

              driver_name = coreData[ii].c[len]

              let io_1 = coreData[ii].c[8]
              let date = coreData[ii].c[0]

              if(driver_name != '-----' && driver_name != '') {
                driver_Name_Global = driver_name
                break;
              }

              driver_Name_Global = driver_name

            } catch(ex) {
              console.log('assumption for error ... ')
              console.log(ex)
            }

          }


          // still name is empty then look for above till io_1 is 0
          if(driver_name == '') {
                    console.log('... did not get driver_name ...')
            let newFromDate = new Date(res)
            newFromDate.setHours('00');
            newFromDate.setMinutes('00');
            newFromDate.setSeconds('00');
            newFromDate = newFromDate.getTime()/1000


            // let reportObjectId = '19194735'
            let reportObjectId = '19098983'

                      console.log('2. ' + reportObjectId + '\n')
                      console.log('calling getURLFourData()-222222 .... ')
            await getURLFourData_2(reportObjectId, newFromDate, fromDateVal)
                      console.log('calling getURLFiveData()-222222 ....')
            await getURLFiveData_2()
          }
        }


      } catch(err) {
          console.log(' ++++++++++ err ++++++++    '+err);
      }
    }






  let processforURL5_2 = async (response) => {

        console.log(' ---- processforURL5_2() ----')

          try {
            let grouping = ''
            let driver_name = ''

            if(response.data != undefined) {

              let coreData = response.data;
              let vehicle = '';

              // console.log('3. '+coreData.length)
              // saving intrack data
              for(let ii=coreData.length; ii>=0; ii--) {
//console.log(coreData.length + ' ---- ' + ii)
                let theValue = coreData[ii-1]

                /*
                if(ii == 1) {
                    console.log(theValue)
                }
                */


                if(theValue != undefined) {

                  theValue = theValue.c


                  len = theValue.length - 1

                  driver_name = theValue[len]

                  let io_1 = theValue[8]
                  let date = theValue[0]

                  if(driver_name != '-----' && driver_name != '') {
                      break;
                  }
                }



            }


            // still name is empty then look for above till io_1 is 0
            console.log('driver_name: '+driver_name)
              driver_Name_Global = driver_name
            }

          } catch(err) {
              console.log(' ++++++++++ err ++++++++    '+err);
          }

        }



  let getURLOneData = async () => {
    let url = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"'+token+'"}';

    let response = ''

    try{
        response = await axios.get(url);
    } catch(err) {
        console.log(err)
    }

    eid = response.data.eid;
    console.log(eid)
    return response
  }




  let getURLThreeData = async (unit) => {
        let urlThree = 'https://hst-api.wialon.com/wialon/ajax.html?params={"spec":{' +
                          '"itemsType":"'+config.ITEMS_TYPE+'"' + ',' +
                          '"propName":"'+config.PROP_NAME+'"' +',' +
                          '"propValueMask":"'+config.PROP_VALUE_MASK+'"' +','+
                          '"sortType":"'+config.SORT_TYPE+'"' +
                        '},'+
                        '"force":'+config.FORCE+','+
                        '"flags":'+config.FLAG_40961+','+
                        '"from":0'+','+ '"to":4294967295}&' +
                        'svc=core/search_items&sid='+eid

        let response = ''
        let reportObjectId = ''

        try {
          response = await axios.get(urlThree)
        } catch(ex) {
          console.log(ex)
        }


        try {
            let theItem = response.data.items
            for(let ll=0; ll<=theItem.length; ll++) {
              let nm = theItem[ll].nm

              if(nm == unit) {
                // console.log(nm)
                reportObjectId = theItem[ll].id
                break
              }
            }
        } catch(err) {
            console.log('err ----------'+err);
            // throw new Error(err);
        }
        return reportObjectId;
  }


  let getURLFourData = async (reportObjectId) => {
    let url4 = 'https://hst-api.wialon.com/wialon/ajax.html?svc=report/exec_report&params={' +
                  '"reportResourceId":"16278637",'+
                  '"reportTemplateId":"1",' + // Message Tracing
                  '"reportObjectId":'+reportObjectId+',' +
                  '"reportObjectSecId":"0",'+
                  '"interval":{' +
                    '"flags":0,'+
                    '"from":'+fromDateVal+','+
                    '"to":'+toDateVal+
                  '}'+
                '}&sid='+eid

      let response = ''

      // console.log('fromDateVal - toDateVal')
      // console.log(fromDateVal + ' - ' + toDateVal)


      // console.log(url4 + '\n')

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




  let getURLFourData_2 = async (reportObjectId, newFromDateVal, newEndDateVal) => {
  // console.log(newFromDateVal + '\n' + newEndDateVal)

      let url4_2 = 'https://hst-api.wialon.com/wialon/ajax.html?svc=report/exec_report&params={' +
                    '"reportResourceId":"16278637",'+
                    '"reportTemplateId":"1",' + // Message Tracing
                    '"reportObjectId":'+reportObjectId+',' +
                    '"reportObjectSecId":"0",'+
                    '"interval":{' +
                      '"flags":0,'+
                      '"from":'+newFromDateVal+','+
                      '"to":'+newEndDateVal+
                    '}'+
                  '}&sid='+eid

                  // console.log('newFromDateVal' + ' - ' + 'newEndDateVal')
                  // console.log('1581105600 - 1581142500')
                  // console.log(newFromDateVal + ' - ' + newEndDateVal + '\n')

                  // console.log(url4_2)

        let response = ''

      try {
        response = await axios.get(url4_2, {
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
                  '"tableIndex":'+config.TABLE_INDEX+',' + // tableIndex: 0 -- Message Tracing
                  '"config":{' +
                  '"type":"'+config.TYPE+'",' +
                  '"data":{"from":0,"to":1000,"level":7}' +
                  '}}&sid='+eid;

    let response = ''
    try {
      response = await axios.get(url5, {
        headers: {
            Authorization: nimbus_token
        }
      })

      // setTimeout(async () => {
        await processforURL5(response)
      // }, 2000)


    } catch(ex) {
      console.log('in getURLFiveData() method')
      console.log(ex)
    }

  }



  let getURLFiveData_2 = async () => {
      let url5_2 = 'https://hst-api.wialon.com/wialon/ajax.html?svc=report/select_result_rows&params={' +
                      '"tableIndex":'+config.TABLE_INDEX+',' + // tableIndex: 0 -- Message Tracing
                      '"config":{' +
                      '"type":"'+config.TYPE+'",' +
                      '"data":{"from":0,"to":1000,"level":7}' +
                      '}}&sid='+eid;

      let response = ''
      try {
        response = await axios.get(url5_2, {
          headers: {
              Authorization: nimbus_token
          }
        })

          await processforURL5_2(response)
          // console.log()

      } catch(ex) {
        console.log('in getURLFiveData() method')
        console.log(ex)
      }

    }






  let getAllDataFromNimbus = async () => {

    let nimbusAPIOneURL = 'https://nimbus.wialon.com/api/depots';

    await callNimbusDepotAPI(nimbusAPIOneURL);

    let sample = 'https://nimbus.wialon.com/api/depot/2097/report/avl_unit_group/19194735?df='+theDateForNimbus+'&dt='+theDateForNimbus+'&sort=timetable'

    setTimeout( () => {}, 2000)
    let resp01 =  '';

    try{
        resp01 = await callNimbusAPI(sample);
    } catch(err) {
        console.log('** err' + err)
    }

    console.log('...1...')

    try {
        if(resp01 != undefined) {
            // let response = resp01;
            let resp02 = resp01.data.report_data;


            let resp03 = resp02.rows

            for(let jj=0; jj<resp03.length; jj++) {

              let resp04_col = resp03[jj].cols

              let unit = resp04_col[1].t
              let date = resp04_col[0].v

              let resp04_rows = resp03[jj].rows

              for(let kk=0; kk<resp04_rows.length; kk++) {
                let unit_trip_dat = []

                let resp05 = resp04_rows[kk];

                let obj = {}

                let route_id = resp05[2].t

                route_id = route_id.split(' ')[0]

                let route = route_id
                //route = route.substring(0, 2)
                console.log('\n\n' + route)
                let rGroup =  route.match(/[a-zA-Z]+/g)
                route = rGroup[0]
                console.log(route + '\n\n')

                let route_name = resp05[2].t

                let routename_global = route_name

                let routetype =  ''
                route_name = route_name.split(' ')
                let temp = ''
                for(let i=1; i<route_name.length; i++) {

                  temp += route_name[i] + ' '

                }



                route_name = temp
                // let text = route_name[route_name-1]
                route_name = route_name.split(' ').slice(1).join(' ');

                let text = ''
                try {
                text = route_name.match(/\(([^)]*)\)[^(]*$/)[1];

                  text    =   text.toLowerCase();

                if ( /in|inbound|in bound/.test( text )) {
                    routetype = 'inbound';
                }
                else if ( /out|outbound|out bound/.test( text )) {
                    routetype = 'outbound';
                }
              } catch(ex) {
                console.log(ex)
              }


                let schedule = resp05[4].t

                let route_group = route_id.substring(0, 2) // GD, GK, GE

                let result = resp05[12].t

                // nimbus data
                let sch = resp05[3].t
                let beg = resp05[4].t
                let end = resp05[5].t
                let dur = resp05[6].t
                let avg_dev = resp05[7].t
                let max_hurry = resp05[8].t
                let max_delay = resp05[9].t
                let stops = resp05[10].t



                let tempSch = resp05[4].t
                let beg01 = tempSch.split(' - ')[0]
                let end01 = tempSch.split(' - ')[1]
                //
                beg01 = date + ' ' + beg01
                end01 = date + ' ' + end01

                obj.beg01 = beg01
                obj.end01 = end01

                obj.unit = unit,
                obj.route = route,
                obj.routeid = route_id,
                obj.routename = temp,
                obj.theDate = date
                obj.schedule = resp05[4].t,
                obj.beginning = resp05[5].t,
                obj.end = resp05[6].t,
                obj.driver_name = '',
                obj.duration = resp05[7].t,
                obj.ave_deviation = resp05[8].t,
                obj.max_hurry = resp05[9].t,
                obj.max_delay = resp05[10].t,
                obj.stops = resp05[11].t,
                obj.route_result = result,
                obj.routename_global = routename_global

                // TODO
                // if(unit == 'F69874') {
                  nimbus_unit_array.push(obj)
                // }
                // console.log(unit + ' pushed... ')
              }

            }

        }
        else {
          console.log(' esponse.data.report_data.rows === undefined ----- >>>  Undefined');
        }


    } catch(err) {
        console.log('......>>>............  ' + err+'\n');
    }
  }



  let savingNimbusDataResponse = async function() {

        try {
          let letDriver = ''
          let lastName = ''
          let currName = ''
          // console.log(nimbus_unit_array.length)
            for(let gg=0; gg<nimbus_unit_array.length; gg++) {

                  let result = nimbus_unit_array[gg].route_result
                  let route = nimbus_unit_array[gg].route
                  let routeid = nimbus_unit_array[gg].routeid
                  let routename= nimbus_unit_array[gg].routename
                  let date= nimbus_unit_array[gg].theDate
                  let sch= nimbus_unit_array[gg].schedule
                  let beg= nimbus_unit_array[gg].beginning
                  let end= nimbus_unit_array[gg].end
                  let driver= nimbus_unit_array[gg].driver_name
                  let dur= nimbus_unit_array[gg].duration
                  let avg_dev= nimbus_unit_array[gg].ave_deviation
                  let max_hurry= nimbus_unit_array[gg].max_hurry
                  let max_delay= nimbus_unit_array[gg].max_delay
                  let stops= nimbus_unit_array[gg].stops
                  // let result= nimbus_unit_array[gg].result

                  let routename_global = nimbus_unit_array[gg].routename_global

                  let letUnit = nimbus_unit_array[gg].unit



                  // **
                  let ini_loc = routename.split('—')[0]
                  let final_loc = routename.split('—')[1]

                  
                  routename = routename.split(' ').slice(1).join(' ');
                  let text = ''
                  try {
                  text = routename.match(/\(([^)]*)\)[^(]*$/)[1];
                    text    =   text.toLowerCase();
                  if ( /in|inbound|in bound/.test( text )) {
                      routetype = 'inbound';
                  }
                  else if ( /out|outbound|out bound/.test( text )) {
                      routetype = 'outbound';
                  }
                } catch(ex) {
                  console.log(ex)
                }

                  if(ini_loc.indexOf('(') != -1) {
                      ini_loc = ini_loc.split('(')[0]
                  }

                  final_loc = final_loc.split('(')[0]

                  let unit = nimbus_unit_array[gg].unit

                  // **


                  date = new Date(theDateForNimbus)

                  let nimBegg = sch.split(' - ')[0]
                  let nimEndd = sch.split(' - ')[1]
                  nimBegg = res + nimBegg
                  nimEndd = res + nimEndd

                  let nimBegg_presentation = beg
                  let nimEndd_presentation = end

                  if(beg != '—') {
                      nimBegg_presentation = res + beg.split(' ')[1] + ':00'
                  } else {
                    nimBegg_presentation = res + ' -'
                  }

                  if(end != '—') {
                    nimEndd_presentation = res + end.split(' ')[1] + ':00'
                  } else {
                    nimEndd_presentation = res + ' -'
                  }




                  // here ---
                  // if(unit == 'F69874') {
                      await display(unit, nimBegg, nimEndd);
                  // }

                  console.log(' ----- x ----- \n\n')


                    /// we got all data
                  let post = {
                    unit: nimbus_unit_array[gg].unit,

                    beginning: nimBegg_presentation,
                    end: nimEndd_presentation,

                    initial_location: ini_loc,
                    final_location: final_loc,

                    driver_name: driver_Name_Global,
                    duration: dur,

                    routegroup: route,
                    routeid: routeid,
                    routename: routename_global,
                    routetime: sch,
                    routetype: routetype
                  }

                  let sql = 'insert into '+database+' set ?';
                  let query = db.query(sql, post, (err, result) => {
                      if(err) console.log('erro while inserting the record. '+err);
                  });
              }

        } catch(ex) {
            console.log(ex)
        }

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



  server.listen(3005, async () => {
    console.log('server running ...');
    
    await getDBConnection()
    await runOnStart()
    await closeDBConnection()
    

    
    // let job = schedule.scheduleJob('05 00 * * *', async function() {
    //  // runOnStart()
    //  await getDBConnection()
    //   await runOnStart()
    //   await closeDBConnection()
    // })
    

  })

