import { PacketParser } from "../Components/dashboard/PacketParser";
export class Response {
  code: number;
  status: boolean;
  message: string;
  data: Data;
}
export class VehicleResponse {
  code: number;
  status: boolean;
  message: string;
  data: Vehicles[];
}
export class AlarmsResponse {
  code: number;
  status: boolean;
  message: string;
  data: Alarm[];
}
export class Alarm {
  Alarm_Detail: string;
  GPS: string;
  GPS_Time: Date;
  ID: number;
  Location: string;
  Mode: string;
  Rec_Time: string;
  Speed: number;
  alarm: string;
  alm_id: number;
  device_id: string;
  dir_angle: number;
  gps_datetime: string;
  lat: number;
  lng: number;
  loc_status: string;
  packet_no: string;
  popup: string;
  rec_datetime: string;
  ref_dist: number;
  sms: string;
  veh_id: number;
  veh_reg_no: string;
  veh_status: string;
}
export class History {
  public GPSDateTime: string;
  public Speed: string;
  public RPM: string;
  public ACC: string;
  public Alarm: string;
  public Status: string;
  public Dir: string;
  public Distance: string;
  public Latitude: string;
  public Longitude: string;
  public Location: string;
  public RECDateTime: string;
  public Index: number;
}
export class GeoFence {
  public gf_id: number;
  public gf_name: string;
  public gf_type: string;
  public cnt_id: number;
  public cty_id: number;
  public FenceParam: string;
  public gf_diff: number;
}
export class cords {
  public lat: number;
  public lng: number;
}
export class GeoFenceVM {
  public gf_type: string = "";
  public fenceParam: cords[] = [{ lat: 31, lng: 74 }];
  public gf_diff?: string = "";
}
export class Data {
  public History?: History[];
  public GeoFence?: GeoFence[];
  public History_Period: string;
  public ErrorMessage: string;
  public Count: number;
}

export class RecordsInterval {
  public start_date: string;
  public end_date: string;
}
export class GeoFenceResponse {
  code: number;
  status: boolean;
  message: string;
  data: GeoFence[];
}
export class Version {
  public producer: string;
  public remarks: string;
  public stats_version: string;
  public UTC_offset: string;
  public production_date: string;
  public records_interval: RecordsInterval;
}

export class NetworkConfig {
  public cmp_code: string;
  public cmp_image: string;
  public address: string;
  public port: string;
}
export class img {
  public src: string;
}
export class Root {
  public version: Version;
  public network_config: NetworkConfig[];
}
export class CurrentStateResponse {
  code: number;
  status: boolean;
  message: string;
  data: CurrentState[];
}
export class CurrentState {
  vehicleId: number;
  lat: string;
  long: string;
  timestamp: Date;
  speed: string;
  engineStatus: string;
  Location_name: string;
}
export class Vehicles {
  grp_id: number;
  datatrack: string;
  device_id: string;
  pmd: object;
  vrn: object;
  parent_grp_id: number;
  grp_name: string;
  grp_level: object;
  grp_trk_id: object;
  parent_grp_trk_id: object;
  grp_sub_station: object;
  Status: object;
  usr_id: number;
  SubMenu: Vehicles[];
  speed: string;
  veh_status: string;
  OnlineDevice: PacketParser[];
}
export class CommandResponse {
  code: number;
  status: boolean;
  message: string;
  data: Command[];
}
export class Command {
  check_status: boolean;
  fb_id: number;
  p_cmd_id: number;
  Name: string;
  _picQ: string;
  camera_channel: string;
  p_cell_no: string;
  p_dev_id: number;
  channel: string;
}
export class SettingsResponse {
  code: number;
  status: boolean;
  message: string;
  data: Setting[];
}
export class Setting {
  check_status: boolean;
  fb_id: number;
  p_cmd_id: number;
  Name: string;
  p_cell_no: string;
  p_IpAddress: string;
  p_tcp_port: string;
  url: string;
  apn: string;
  user_name: string;
  pwd: string;
  mileage: string;
  cmd_type: string;
  p_dev_id: string;
  channel: string;
}
export class commandPostResponse {
  _object: {
    Message: number;
    code: number;
    _data: string;
  };
}
