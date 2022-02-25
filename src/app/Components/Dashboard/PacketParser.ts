
export class PacketParser {
    public constructor(p_data: string) {
        this.dataTrack = p_data;
        let header: string = "";
        let update: string = "";
        let alarms: string = "";
        let i: number = 0;
        let ArrData: string[] = p_data.split("<D>");
        if ((ArrData.length == 3)) {
            header = ArrData[0];
            update = ArrData[1];
            alarms = ArrData[2];
        }
        i = 0;
        if ((update != "")) {
            let ArrUpd: string[] = update.split("<#>");
            if ((ArrUpd.length > 51)) {
                this.group_id = ArrUpd[i++];
                this.cluster_id = ArrUpd[i++];
                this.proc_id = ArrUpd[i++];
                this.device_id = ArrUpd[i++];
                this.dev_type_id = ArrUpd[i++];
                this.dev_model_id = parseInt(ArrUpd[i++]);
                this.sim_no = ArrUpd[i++];
                this.veh_id = parseInt(ArrUpd[i++]);
                this.veh_reg_no = ArrUpd[i++];
                this.veh_type = parseInt(ArrUpd[i++]);
                this.cust_id = ArrUpd[i++];
                this.rec_datetime = new Date(ArrUpd[i++]).toDateString();
                this.gps_datetime = new Date(ArrUpd[i++]).toDateString();
                this.lat = ArrUpd[i++];
                this.lng = ArrUpd[i++];
                this.veh_status = ArrUpd[i++];
                this.loc_status = ArrUpd[i++];
                this.speed = ArrUpd[i++];
                this.dir_angle = ArrUpd[i++];
                this.ref_dist = ArrUpd[i++];
                this.ref_location = ArrUpd[i++];;
                this.lm_id = ArrUpd[i++];
                this.geo_status = ArrUpd[i++];
                this.gps_status = ArrUpd[i++];
                this.acc_status = ArrUpd[i++];
                this.Online = ArrUpd[i++];
                this.alarm_status = ArrUpd[i++];
                this.mileage_last_noted = ArrUpd[i++];
                this.mileage_cur_value = ArrUpd[i++];
                this.dev_status = ArrUpd[i++];
                this.fuel_level = ArrUpd[i++];
                this.ad_tt1 = ArrUpd[i++];
                this.ad_tt2 = ArrUpd[i++];
                this.ad_tt3 = ArrUpd[i++];
                this.rpm = ArrUpd[i++];
                this.engin_temp = ArrUpd[i++];
                this.fuel_consumed = ArrUpd[i++];
                this.error_code = ArrUpd[i++];
                this.error_desc = ArrUpd[i++];
                this.gps_satelite = ArrUpd[i++];
                this.gsm_signal = ArrUpd[i++];
                this.h_v_dop = ArrUpd[i++];
                this.recMode = ArrUpd[i++];
                this.track_no = parseInt(ArrUpd[i++]);
                this.ext_bat_voltage = ArrUpd[i++];
                this.int_bat_voltage = ArrUpd[i++];
                this.input_acc_data = ArrUpd[i++];
                this.dev_sync = ArrUpd[i++];
                this.mgt_sim_no = ArrUpd[i++];
                this.group_trk_id = ArrUpd[i++];
                this.driver = ArrUpd[i++];
                this.wh_id = ArrUpd[i++];
                if ((this.veh_id == 0)) {
                    this.veh_reg_no = this.device_id;
                }

            }

        }

        i = 0;
        this.alarm_status = "0";
        if ((this.veh_id > 0)) {
            if ((alarms != "")) {
                this.almPriority + "<#>" + this.almSrNo + "<#>" + new Date(this.almRecDateTime).toDateString() + "<#>" + new Date(this.almGpsDateTime).toDateString() + "<#>" + this.alarmDesc + "<#>" + this.almSpeed + "<#>" + this.almLocation + "<#>" + this.alarmID;
                let ArrAlm: any[] = alarms.split("<#>");
                if ((ArrAlm.length >= 8)) {
                    this.almPriority = ArrAlm[i++];
                    this.almSrNo = ArrAlm[i++];
                    this.almRecDateTime = ArrAlm[i++];
                    this.almGpsDateTime = ArrAlm[i++];
                    this.alarmDesc = ArrAlm[i++];
                    this.almSpeed = ArrAlm[i++];
                    this.almLocation = ArrAlm[i++];
                    this.alarmID = ArrAlm[i++];
                    this.alarm_status = "1";
                }

            }

        }

    }
    public dataTrack: string = "";
    public group_id: string = "";
    public cluster_id: string = "";
    public proc_id: string = "";
    public device_id: string = "";
    public dev_type_id: string = "";
    public dev_model_id: number = 0;
    public sim_no: string = "";
    public veh_id: number = 0;
    public veh_reg_no: string = "";
    public veh_type: number = 0;
    public cust_id: string = "";
    public rec_datetime: string;
    public gps_datetime: string;
    public lat: string = "";
    public lng: string = "";
    public veh_status: string = "";
    public loc_status: string = "";
    public speed: string = "";
    public dir_angle: string = "";
    public ref_dist: string = "";
    public ref_location: string = "";
    public lm_id: string = "";
    public geo_status: string = "";
    public gps_status: string = "";
    public acc_status: string = "";
    public Online: string = "";
    public alarm_status: string = "";
    public mileage_last_noted: string = "";
    public mileage_cur_value: string = "";
    public dev_status: string = "";
    public fuel_level: string = "";
    public ad_tt1: string = "";
    public ad_tt2: string = "";
    public ad_tt3: string = "";
    public rpm: string = "";
    public engin_temp: string = "";
    public fuel_consumed: string = "";
    public error_code: string = "";
    public error_desc: string = "";
    public gps_satelite: string = "";
    public gsm_signal: string = "";
    public h_v_dop: string = "";
    public recMode: string = "";
    public track_no: number = 0;
    public ext_bat_voltage: string = "";
    public int_bat_voltage: string = "";
    public input_acc_data: string = "";
    public dev_sync: string = "";
    public mgt_sim_no: string = "";
    public group_trk_id: string = "";
    public driver: string = "";
    public wh_id: string = "";
    public almPriority: number;
    public almSrNo: number;
    public almRecDateTime: string;
    public almGpsDateTime: string;
    public alarmDesc: string = "";
    public alarmID: string = "";
    public almSpeed: string = "";
    public almLocation: string = "";
}