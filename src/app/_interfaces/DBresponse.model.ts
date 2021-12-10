export class Response {
  code: number;
  status: boolean;
  message: string;
  data: Data;
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

export class Root {
  public version: Version;
  public network_config: NetworkConfig[];
}
