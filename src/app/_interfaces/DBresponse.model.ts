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
  data: any[];
}
export class History {
  public GPSDateTime: string;
  public Speed: string
  public RPM: string
  public ACC: string
  public Alarm: string
  public Status: string
  public Dir: string
  public Distance: string
  public Latitude: string
  public Longitude: string
  public Location: string
  public RECDateTime: string;
  public Index: number;
}
// export class GeoFencePost {
//   public cust_id: number;
//   public gf_name: string;
//   public gf_type: string;
//   public gf_type_name: string;
//   public cnt_id: number;
//   public cty_id: number;
//   public FenceParam: string;
//   public gf_diff: number;
//   public CityNCountry: string;
// }
export class GeoFence {
  public gf_id: number;
  public gf_name: string;
  public gf_type: string;
  public cnt_id: number;
  public cty_id: number;
  public FenceParam: string;
  public gf_diff: number;
}
export class Data {

  public History: History[];
  public GeoFence: GeoFence[];
  public History_Period: string;
  public ErrorMessage: string;
  public Count: number;
}

export class RecordsInterval {
  public start_date: string;
  public end_date: string;
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
  public src: string
}
export class Root {
  public version: Version;
  public network_config: NetworkConfig[];
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
  SubMenu: object[];
  speed: string;
  veh_status: string;
}