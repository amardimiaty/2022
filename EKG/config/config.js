const config = {
    //TOKEN: 'a5570630fd5da54dcfc932bdccf9be449EDB02657F6C0039640C583D42D2EE31D5BBE1A9',
    TOKEN: 'a5570630fd5da54dcfc932bdccf9be4476EF3EDDAE3B15E1CA18D585590E88D0C6FAD83E',
   //TOKEN: 'a5570630fd5da54dcfc932bdccf9be4461F32FC60987C2277B4A949262244DA681F10521',
   // NIMBUS_TOKEN: 'Token fe6193fd6c2d4d3eb7d3513e4dd97d0f',
    NIMBUS_TOKEN: 'Token 577ea4255ee94c499e3e070c2cb6feb8',    
    HOST: 'localhost',
    USER: 'root',
    PASS: 'P@ssw0rd@123',
    
    //
    ITEMS_TYPE: 'avl_unit',
    PROP_NAME: 'sys_name',
    PROP_VALUE_MASK: '*',
    SORT_TYPE: 'sys_name',
    FORCE: '1',
    FLAG: '1',
    FLAG_2: '8193',
    FLAG_40961: '40961',
    FLAG_16777216: '16777216',
    
    // BUS GROUP
    REPORT_RESOURCE_ID: 16278637,
    REPORT_OBJECT_ID: 19194735,
    REPORT_OBECT_SEC_ID: 0,

    // DRIVER GROUP


    // URL5
    TABLE_INDEX: 0,
    TYPE: 'range',

    NIMBUS_REPORT_ID: 2097,
    
    PASSENGERS: {
        DATABASE: 'EKG_2022', 
        TABLE: 'passengers',
        //TABLE: 'test_pass',
        //DATABASE: 'forpassengers',
        //TABLE: 'pass_trial_2',
        REPORT_TEMPLATE_ID: 20
    },
    OTP: {
        DATABASE: 'EKG_2022',
        TABLE: 'otp'
    },
    SALIK: {
        DATABASE: 'EKG_2022', 
        TABLE: 'salik_nimbus_2021',
        //TABLE: 'salik_nimbus__test', 
        REPORT_TEMPLATE_ID: 2,    // API - V2 GUI-CLETEKG  Trips Salik
        CSV_FILE_NAME: 'Salik_',
        CSV_PATH: '/home/inbound/Documents/All_Reports_Files/EKG/2021/'
    },
    RTR: {
        DATABASE: 'EKG_2022', 
        TABLE: 'rtr',
        //TABLE: 'rtr__test',
        REPORT_TEMPLATE_ID: 27,
        CSV_FILE_NAME: 'Realtime_Report_',
        CSV_PATH: '/home/inbound/Documents/All_Reports_Files/EKG/2021/'
    },
    API_DRIVER_UTIL: {
        DATABASE: 'EKG_2022', 
        TABLE: 'driver_util',
        //TABLE: 'rtr__test',
        REPORT_TEMPLATE_ID: 94,
        CSV_FILE_NAME: 'Realtime_Report_',
        CSV_PATH: '/home/inbound/Documents/All_Reports_Files/EKG/2021/'
    },
    DRIVER_UTIL: {
        DATABASE: 'EKG_2022', 
       //TABLE: 'driver_trip_revenue__test',
       TABLE: 'driver_trip_revenue',
       //TABLE ; 'driver_trip_revenue_nov',
        REPORT_TEMPLATE_ID: 1,
        REPORT_TEMPLATE_ID_MESSAGE_TRACING: 1,
        REPORT_OBJECT_SEC_ID: 0,
        CSV_FILE_NAME: 'Driver_Revenue_Trips_',
        CSV_PATH: '/home/inbound/Documents/All_Reports_Files/EKG/2021/'
    },
    NEW_ECODRIVING: {
        DATABASE: '',
        TABLE: '',
        REPORT_TEMPLATE_ID: '89',
    },
    NIMBUS_BUS_DELAY: {
        DATABASE: 'EKG_2022',
        TABLE: 'nimbus_bus_delay',
        CSV_FILE_NAME: 'delay',
        CSV_PATH: 'D:\EKG Reports',
        EMAI_LIST: ''
    }
}

module.exports = config