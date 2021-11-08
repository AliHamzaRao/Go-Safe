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
export class Data {
  public History: History[];
  public geofence: object[];
  public History_Period: string;
  public ErrorMessage: string;
  public Count: number;
}