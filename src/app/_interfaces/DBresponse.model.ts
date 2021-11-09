export class Response {
  code: number;
  status: boolean;
  message: string;
  data: Data;
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