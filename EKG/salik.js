

// Driver_Trip_Report_01_exp.js


const http = require('http');
const mysql = require('mysql');

const axios = require('axios');

var schedule = require('node-schedule');


var config = require('./config/config')

const fs = require('fs');
const fastcsv = require("fast-csv");

let intrackMap = new Map();
let nimbusMap = new Map();

let unit_object = {}
let nimbus_unit_array = []

let intrack_unit_object = {}
let intrack_unit_array = []

var fromDateVal = '';
var toDateVal =   '';

let eid = ''


var title = 'API-CLETEKG Trips Salik'

var theDateForNimbus = ''
var res = ''
//var database = 'new_reports.driver_trip_revenue_trial_2'

var token = config.TOKEN

var intervalBeginning = 5
var intervalEnd = 5

var nimbus_token = config.NIMBUS_TOKEN

var db = ''

const DATABASE = config.SALIK.DATABASE
const DB_TABLE = config.SALIK.TABLE

const database = DATABASE + '.' + DB_TABLE

  


  var vehicleData = [];
  var vehicleDataReverse = [];

  const server = http.createServer((req, res) => {});

  let runOnStart = async () => {

      var date = new Date();
      date.setDate(date.getDate() - 1)
      day = date.getDate();
      mon = date.getMonth() + 1;
      yr = date.getFullYear();
      
      theDateForNimbus = yr+'-'+('0'+mon).slice(-2)+'-'+('0'+day).slice(-2);
      //theDateForNimbus = '2021-12-29'
      res = theDateForNimbus + ' '
      //var database = 'fortrips.trip_km_27oct_iv_3'


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






      //getAllUnitsData()

      //await getAllVehicles()

      await getAllDataFromNimbus()
       //await savingNimbusDataResponse()

  await processIntrackData()

     // await generateCSV()

      //await sendEmail()

      console.log(' ... process completed ...')

}


let generateCSV = () => {
  ws = fs.createWriteStream(config.SALIK.CSV_PATH + config.SALIK.CSV_FILE_NAME + theDateForNimbus + '.csv');
  
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
      // host: 'mail.inbound.com',
      // port: 587,
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'support@inbound.ae',
        pass: 'P@ssw0rd@inbound'
          // user: 'support@inbound.ae', // generated ethereal user
          // pass: 'P@ssw0rd@123'  // generated ethereal password
      }
      // tls:{
      // rejectUnauthorized: true
      // }
  })


  //let listOfaddresses = 'SosappanTD@et.ae, shafirk@et.ae, bijoybp@et.ae, rajdeep.pratap@emirates.com, ahmed.shokri@emirates.com, ekgstafftran@emirates.com, ashwin.nayar@emirates.com';
  let listOfaddresses = 'SosappanTD@et.ae,'+
                          'shafirk@et.ae,'+
                          'bijoybp@et.ae,'+
                          //'rajdeep.pratap@emirates.com,'+
                          //'ahmed.shokri@emirates.com,'+
                          'ekgstafftran@emirates.com,'+
                          'ashwin.nayar@emirates.com';

  let cclist = 'walied@inbound.ae';




 



  //let theDate = '2021-04-30'

  let theDate = yr + '-' + ('0'+mon).slice(-2) + '-' + ('0'+day).slice(-2); 
  //let filename = 'Realtime_Report_'+theDate;

  
  let fileName = 'Salik_'+theDate+'.csv';
  let subject_line = 'Daily Salik Report'


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


  let processIntrackData = async () => {

    //await getURLOneData()

    //await getAllVehicles()

    await getURLTwoData()

    await getAllVehicles()

    await getURLThreeData()

    await getURLFourData()

    await getURLFiveData()

  }




  // ======================= others =======================



    let processforURL5_old = async (response) => {
      console.log('\n\n  processforURL5 \n\n')
      try {
        let grouping = ''
        let driver_name = ''

        if(response.data !== undefined) {
          let coreData = response.data;

          let vehicle = '';

          // saving intrack data
          for(let ii=0; ii<coreData.length; ii++) {
          // for(let ii=0; ii<1; ii++) {
            let unit = coreData[ii].c[1]

            let subCoreData = coreData[ii].r

            for(let jj=0; jj<subCoreData.length; jj++) {


              let tempDate = subCoreData[jj].c[2].t
              // console.log(tempDate)
              if(tempDate != undefined) {
                  tempDate = tempDate.split(' ')[0]
              }


              //console.log(subCoreData[jj])

              // if('2019-11-17' == tempDate) {
                // if(unit == 'F21826') {
                // console.log(res + '   ' + tempDate)
                let intrackObject = {}

                intrackObject.unit = unit
                intrackObject.beginning = res + subCoreData[jj].c[2].t

                intrackObject.initial_location = subCoreData[jj].c[3].t
                intrackObject.end = res + subCoreData[jj].c[4].t
                intrackObject.final_location = subCoreData[jj].c[5].t
                intrackObject.driver_name = subCoreData[jj].c[10]
                intrackObject.crossing = subCoreData[jj].c[12]
                intrackObject.salik_cost = subCoreData[jj].c[12]
                intrackObject.duration = subCoreData[jj].c[6]

                intrack_unit_array.push(intrackObject)
                // } // unit == 'W31445'
            // } // '2019-11-17' == tempDate

            }

            // if(unit == 'F21826') {
                intrackMap.set(unit, intrack_unit_array)
                intrack_unit_array = []
            // }

            // console.log(unit + '  ' + intrack_unit_array.length)
          }


          console.log(intrackMap.size)
          //console.log(intrackMap)


          //saveIntrackData()
         await process()



        }
      } catch(err) {
          console.log(' ++++++++++ err ++++++++    '+err);
      }
    }



    let processforURL5 = async (response) => {
      console.log('\n\n  processforURL5 \n\n')
      try {
        let grouping = ''
        let driver_name = ''

        if(response.data !== undefined) {
          let coreData = response.data;

          let vehicle = '';

          // saving intrack data
          for(let ii=0; ii<coreData.length; ii++) {
           //for(let ii=0; ii<5; ii++) {
            let unit = coreData[ii].c[1]

            let subCoreData_01 = coreData[ii].r

            for(let jj=0; jj<subCoreData_01.length; jj++) {

              let subCoreData = subCoreData_01[jj].r

              //console.log(subCoreData)
               
              for(let kk=0; kk<subCoreData.length; kk++) {

                console.log(subCoreData[kk])

              let tempDate = subCoreData[kk].c[2].t
               console.log(tempDate)
              if(tempDate != undefined) {
                  tempDate = tempDate.split(' ')[0]
              }


              //console.log(subCoreData[jj])

              // if('2019-11-17' == tempDate) {
                // if(unit == 'F21826') {
                // console.log(res + '   ' + tempDate)
                let intrackObject = {}

                intrackObject.unit = unit
                intrackObject.beginning = res + subCoreData[kk].c[2].t

                intrackObject.initial_location = subCoreData[kk].c[3].t
                intrackObject.end = res + subCoreData[kk].c[4].t
                intrackObject.final_location = subCoreData[kk].c[5].t
                intrackObject.driver_name = subCoreData[kk].c[10]
                intrackObject.crossing = subCoreData[kk].c[12]
                intrackObject.salik_cost = subCoreData[kk].c[12]
                intrackObject.duration = subCoreData[kk].c[6]

                intrack_unit_array.push(intrackObject)
                // } // unit == 'W31445'
            // } // '2019-11-17' == tempDate
              }
              
            }

            // if(unit == 'F21826') {
                intrackMap.set(unit, intrack_unit_array)
                intrack_unit_array = []
            // }

            // console.log(unit + '  ' + intrack_unit_array.length)
          }


          console.log(intrackMap.size)
          //console.log(intrackMap)


          //saveIntrackData()
         await process()



        }
      } catch(err) {
          console.log(' ++++++++++ err ++++++++    '+err);
      }
    }


let process = () => {

              for(let [key, ent] of intrackMap.entries()) {
                // if(key == 'F22706') {

                  let  isMatched = false

                  for(let hh=0; hh<ent.length; hh++) {
                  // for(let hh=0; hh<9; hh++) {

                    let intBeg = ent[hh].beginning
                    let intEnd = ent[hh].end;
                    let fullYear = intBeg.split(' ')[0]

                      let intUnit = ent[hh].unit

                     

                    intBeg = new Date(intBeg)
                    intEnd = new Date(intEnd)


                    intBeg.setHours(intBeg.getHours() + 4)
                    intEnd.setHours(intEnd.getHours() + 4)

                   




                    let intIniLoc = '';
                    // let intEnd = ent[hh].end;
                    let intFinalLoc = '';
                    let intDriverName = '';
                    let intDuration = '';
                    let intMileage = '';

                    intIniLoc = ent[hh].initial_location;
                    intFinalLoc = ent[hh].final_location;
                    intDriverName = ent[hh].driver_name;
                    intDuration = ent[hh].duration;
                    crossing = ent[hh].crossing;
                    salik_cost = ent[hh].salik_cost;


                    // console.log('\n'+hh + ' intUnit: '+intUnit)
                      for(let gg=0; gg<nimbus_unit_array.length; gg++) {
                        isMatched = false
                    // for(let gg=0; gg<1; gg++) {
                        let nimUnit = nimbus_unit_array[gg].unit

                        if(key == nimUnit) {

                          // 17.11.2019 14:40
                          let nimBegDate = nimbus_unit_array[gg].beginning

                          // 17.11.2019 14:40
                          let nimEndDate = nimbus_unit_array[gg].end

                          nimBegDate = new Date(nimBegDate)
                          nimEndDate = new Date(nimEndDate)

                          nimBegDate.setMinutes(nimBegDate.getMinutes() - intervalBeginning) // 20
                          nimEndDate.setMinutes(nimEndDate.getMinutes() + intervalEnd) // 26

                          let routeid = ''
                          let route_name = ''
                          let routetype = ''
                          let routetime = ''
                          let routegroup = ''

                          //console.log('\n\n')
                          //console.log(intBeg.getDate() + ' ' + intBeg.getTime())
                          //console.log(nimBegDate.getDate() + ' ' + nimBegDate.getTime())
                           //if((intBeg <= nimBegDate) && (nimEndDate <= intEnd)) {
                           if((nimBegDate <= intBeg) && (intEnd <= nimEndDate)) {
                             isMatched = true
                             // console.log(' hit ' + '\n')


                             fullYear = intBeg.getFullYear()
                             let month = intBeg.getMonth()+1
                             let day = intBeg.getDate()

                             intBeg = fullYear + '-' + ('0'+month).slice(-2) +  '-' + ('0'+day).slice(-2) + ' ' + ('0'+intBeg.getHours()).slice(-2) + ':' + ('0'+intBeg.getMinutes()).slice(-2) + ':' + ('0'+intBeg.getSeconds()).slice(-2)



                             intEnd = fullYear + '-' + ('0'+month).slice(-2) +  '-' + ('0'+day).slice(-2) + ' ' + ('0'+intEnd.getHours()).slice(-2) + ':' + ('0'+intEnd.getMinutes()).slice(-2) + ':' + ('0'+intEnd.getSeconds()).slice(-2)



                             routeid = nimbus_unit_array[gg].route_id
                             route_name = nimbus_unit_array[gg].route_name
                             routetype = nimbus_unit_array[gg].routetype
                             routetime = nimbus_unit_array[gg].routetime
                             routegroup = nimbus_unit_array[gg].routegroup


                           // replacing all single apostrophe with double apostrophe, so that it can be save in mysql
                           intIniLoc = intIniLoc.replace(/\'/g, "\'\'");
                           intFinalLoc = intFinalLoc.replace(/\'/g, "\'\'");
                           route_name = route_name.replace(/\'/g, "\'\'");

                             let post = {
                               unit: intUnit,
                               beginning: intBeg,
                               initial_location: intIniLoc,
                               end: intEnd,
                               final_location: intFinalLoc,
                               duration: intDuration,
                               driver_name: intDriverName,
                               crossing: crossing,
                                routeid: routeid,
                                routename: route_name,
                                routetype: routetype,
                                routetime: routetime,
                                routegroup: routegroup
                            }

                            //console.log(post+'\n')

                             let sql = 'insert into '+database+' set ?';
                             let query = db.query(sql, post, (err, result) => {
                                 if(err) {
                                   console.log(post)
                                   console.log(sql)
                                    console.log('erro while inserting the record. '+err);
                                    console.log()
                                 }
                             });


                                                   break;
                           } // (intBeg <= nimBegDate) && (nimEndDate <= intEnd)



                        } // key == nimUnit


                      } // gg-nimbus

                      if(false == isMatched) {
                        intIniLoc = intIniLoc.replace(/\'/g, "\'\'");
                        intFinalLoc = intFinalLoc.replace(/\'/g, "\'\'");
                        // route_name = route_name.replace(/\'/g, "\'\'");

                        // intBeg = fullYear + ' ' + ('0'+intBeg.getHours()).slice(-2) + ':' + ('0'+intBeg.getMinutes()).slice(-2) + ':' + ('0'+intBeg.getSeconds()).slice(-2)
                        // intEnd = fullYear + ' ' + ('0'+intEnd.getHours()).slice(-2) + ':' + ('0'+intEnd.getMinutes()).slice(-2) + ':' + ('0'+intEnd.getSeconds()).slice(-2)

                        fullYear = intBeg.getFullYear()
                        let month = intBeg.getMonth()+1
                        let day = intBeg.getDate()

                        intBeg = fullYear + '-' + ('0'+month).slice(-2) +  '-' + ('0'+day).slice(-2) + ' ' + ('0'+intBeg.getHours()).slice(-2) + ':' + ('0'+intBeg.getMinutes()).slice(-2) + ':' + ('0'+intBeg.getSeconds()).slice(-2)

                        intEnd = fullYear + '-' + ('0'+month).slice(-2) +  '-' + ('0'+day).slice(-2) + ' ' + ('0'+intEnd.getHours()).slice(-2) + ':' + ('0'+intEnd.getMinutes()).slice(-2) + ':' + ('0'+intEnd.getSeconds()).slice(-2)




                        let post = {
                          unit: intUnit,
                          beginning: intBeg,
                          initial_location: intIniLoc,
                          end: intEnd,
                          final_location: intFinalLoc,
                          duration: intDuration,
                          driver_name: intDriverName,
                          crossing: crossing,
                           routeid: '',
                           routename: '',
                           routetype: '',
                           routetime: '',
                           routegroup: ''
                       }

                        let sql = 'insert into '+database+' set ?';
                        let query = db.query(sql, post, (err, result) => {
                            if(err) {
                                console.log('erro while inserting the record. '+err);
                            }
                        });


                      }



                    } // hh-intrack

                // } // if(key == 'W31445') {
              } // intrackMap.entries()

}

let saveIntrackData = () => {
  for(let [key, ent] of intrackMap.entries()) {

      for(let hh=0; hh<ent.length; hh++) {

        let intBeg = ent[hh].beginning
        let intEnd = ent[hh].end;
        intBeg = new Date(intBeg)
        intEnd = new Date(intEnd)
        intBeg.setHours(intBeg.getHours() + 4)
        intEnd.setHours(intEnd.getHours() + 4)

        let intUnit = ent[hh].unit

        let intIniLoc = '';
        let intFinalLoc = '';
        let intDriverName = '';
        let intDuration = '';
        let crossing = '';
        let salik_cost = '';

        intIniLoc = ent[hh].initial_location;
        intFinalLoc = ent[hh].final_location;
        intDriverName = ent[hh].driver_name;
        intDuration = ent[hh].duration;
        crossing = ent[hh].crossing;
        salik_cost = ent[hh].salik_cost;

        // console.log('\n'+hh + ' intUnit: '+intUnit)
        // intBeg = new Date(intBeg)
        // intEnd = new Date(intEnd)
        // intBeg.setHours(intBeg.getHours() + 4)
        // intEnd.setHours(intEnd.getHours() + 4)

       // replacing all single apostrophe with double apostrophe, so that it can be save in mysql
       intIniLoc = intIniLoc.replace(/\'/g, "\'\'");
       intFinalLoc = intFinalLoc.replace(/\'/g, "\'\'");
       intDriverName = intDriverName.replace(/\'/g, "\'\'");

       let post = {
        unit: intUnit,
        beginning: intBeg,
        initial_location: intIniLoc,
        end: intEnd,
        final_location: intFinalLoc,
        duration: intDuration,
        driver_name: intDriverName,
        crossing: crossing,
        salik_cost: salik_cost,
          routeid: '',
          routename: '',
          routetype: '',
          routetime: '',
          routegroup: ''
      }

       let sql = 'insert into '+database+' set ?';
       let query = db.query(sql, post, (err, result) => {
           if(err) {
               console.log('erro while inserting the record. '+err);
           }
       });




        } // hh-intrack



    // } // if(key == 'W31445') {
  } // intrackMap.entries()



} // saveIntrackData




  let getURLOneData = async () => {
    let url = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"'+token+'"}';

    let response = ''

    try{
        response = await axios.get(url);
    } catch(err) {
        console.log(err)
    }

    eid = response.data.eid;
    return response
  }

  let getAllVehicles = async () => {
    let url6 = 'https://hst-api.wialon.com/wialon/ajax.html?params= {'+
            '"spec": {'+
                '"itemsType":"'+config.ITEMS_TYPE+'",'+
                '"propName":"'+config.PROP_NAME+'",'+
                '"propValueMask":"'+config.PROP_VALUE_MASK+'",'+
                '"sortType":"'+config.SORT_TYPE+'"'+
            '},'+
            '"force":'+config.FORCE+','+
            '"flags": '+config.FLAG+','+
            '"from": 0,'+
            '"to": 4294967295'+
            '}&svc=core/search_items&sid='+eid;

            //console.log(url6)

     let resp = ''

     try {
       resp = await axios.get(url6);
     } catch(ex) {
       console.log(ex)
     }

    // console.log(resp)

     const data6 = resp.data.items;

//     console.log(data6)


     for(let j=0; j<data6.length; j++) {
         vehicleData[data6[j].nm] = data6[j].id;  // vehicleData[F21826] = 19099024
         vehicleDataReverse[data6[j].id] = data6[j].nm; // vehicleData[19099024] = F21826
     }
  }

  let getURLTwoData = async () => {
    let url = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"'+token+'"}';
    //var eid = '';

    let resp = ''
    try {
      resp = await axios.get(url)
      eid = resp.data.eid;
    } catch(ex) {
      console.log(ex)
    }
  }

  let getURLThreeData = async () => {
      
      let url3 = 'https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec": {' +
                        '"itemsType":"'+config.ITEMS_TYPE+'",' +
                        '"propName":"'+config.PROP_NAME+'",' +
                        '"propValueMask":"'+config.PROP_VALUE_MASK+'",' +
                        '"sortType":"' +config.SORT_TYPE+'"'+
                    '},' +
                    '"force": '+config.FORCE+',' +
                '"flags": "8193",' +
                    '"from": 0,' +
                    '"to": 0' +
            '}&sid='+eid;

      let response = ''

      try {
        response = await axios.get(url3)
      } catch(ex) {
        console.log(ex)
      }
  }


  let getURLFourData = async () => {
     
      let url4 = 'https://hst-api.wialon.com/wialon/ajax.html?svc=report/exec_report&params={' +
                  '"reportResourceId":'+config.REPORT_RESOURCE_ID+','+
                  '"reportTemplateId":'+config.SALIK.REPORT_TEMPLATE_ID+','+ // V2 GUI-CLETEKG  Trips Salik
                  '"reportObjectId":'+config.REPORT_OBJECT_ID+','+
                  '"reportObjectSecId":'+config.REPORT_OBECT_SEC_ID+','+
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
                 '"tableIndex":'+config.TABLE_INDEX+',' +
                 '"config":{' +
                 '"type":"'+config.TYPE+'",' +
                 '"data":{"from":0,"to":1000,"level":5}' +
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







  let getAllUnitsData = async () => {

    let url = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"'+token+'"}';

    const responseOne = await getURLOneData(url);
    eid = responseOne.data.eid;

    console.log(token)
    console.log(eid)

    let url6 = 'https://hst-api.wialon.com/wialon/ajax.html?params= {'+
        '"spec": {'+
            '"itemsType":"'+config.ITEMS_TYPE+'",'+
            '"propName":"'+config.PROP_NAME+'",'+
            '"propValueMask":"'+config.PROP_VALUE_MASK+'",'+
            '"sortType":"'+ config.SORT_TYPE +'"'+
        '},'+
        '"force":'+config.FORCE+','+
        '"flags":'+config.FLAG+','+
        '"from": 0,'+
        '"to": 4294967295'+
        '}&svc=core/search_items&sid='+eid;
       const data6 = await getAllVehicles(url6);

    }



  let getAllDataFromNimbus = async () => {

    let nimbusAPIOneURL = 'https://nimbus.wialon.com/api/depots';

    //const resp =  callNimbusDepotAPI(nimbusAPIOneURL);
    callNimbusDepotAPI(nimbusAPIOneURL);

    let sample = 'https://nimbus.wialon.com/api/depot/2097/report/avl_unit_group/19194735?df='+theDateForNimbus+'&dt='+theDateForNimbus+'&sort=timetable'
      // let sample = 'https://nimbus.wialon.com/api/depot/2097/report/avl_unit_group/19194735?df=1623009600&dt=1623009600&sort=timetable'
     console.log(sample)

    setTimeout( () => {}, 2000)
    let resp01 =  '';

    try {
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
              //console.log('...i...')
              let unit = resp04_col[1].t
              let date = resp04_col[0].v

              let resp04_rows = resp03[jj].rows



              for(let kk=0; kk<resp04_rows.length; kk++) {
                let unit_trip_dat = []

                let resp05 = resp04_rows[kk];

                let obj = {}

                let route_id = resp05[2].t

                route_id = route_id.split(' ')[0]
                let route_name = resp05[2].t
                let routetype =  ''

                route_name = route_name.split(' ')

                let temp = ''
                for(let i=1; i<route_name.length; i++) {

                  temp += route_name[i] + ' '

                }

                route_name = temp
                //console.log('...ii....')
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


                // nim data
                obj.unit = unit
                obj.route_id = route_id
                obj.route_name = route_name
                obj.routetype = routetype
                obj.routetime = schedule
                obj.routegroup = route_group

                let beg = schedule.split('-')[0]
                let end = schedule.split('-')[1]

                beg = date + ' ' + beg
                end = date + ' ' + end

                obj.beginning = beg
                obj.end = end

                // TODO
                // if(unit == 'F22706') {
                  nimbus_unit_array.push(obj)
                // }
                // nimbus_unit_array.push(obj)
                // console.log(unit + ' pushed... ')
              }

            }

        }
        else {
          console.log(' esponse.data.report_data.rows === undefined ----- >>>  Undefined');
        }

        // console.log(nimbusMap.get('W31445'))

    } catch(err) {
        console.log('......>>>............  ' + err+'\n');
    }
  }

  let savingNimbusDataResponse = async function() {

            try {
              // console.log(nimbus_unit_array.length)
                for(let gg=0; gg<nimbus_unit_array.length; gg++) {

                      let nimUnit = nimbus_unit_array[gg].unit

                      let route_id = nimbus_unit_array[gg].route_id

                      let route_name = nimbus_unit_array[gg].route_name

                      let route_type = nimbus_unit_array[gg].routetype

                      let route_time = nimbus_unit_array[gg].routetime

                      let route_group = nimbus_unit_array[gg].routegroup


                      let post = {
                        unit: nimUnit,
                        routeid: route_id,
                        routename: route_name,
                        routetype: route_type,
                        routetime: route_time,
                        routegroup: route_group
                      }



                        let sql = 'insert into '+database+' set ?';

                        let query = db.query(sql, post, (err, result) => {
                            if(err) {
                                console.log('erro while inserting the record. '+err);
                            }
                        });

                        // console

                  }

            } catch(ex) {
              console.log('---333---')
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

  let getConnection = () => {
    db = mysql.createConnection({
      host     : config.HOST,
      user     : config.USER,
      password : config.PASS,
      database : config.SALIK.DATABASE
    });

     // Connect
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



  server.listen(3869, async () => {
    // console.log('server running ...');
    
    await getConnection()
    await runOnStart();
    await closeConnection()
    
    // let job = schedule.scheduleJob('35 00 * * *', async function() {
    //  await getConnection()
    //  await runOnStart()
    //  await closeConnection()
    // })

    
    

  })
