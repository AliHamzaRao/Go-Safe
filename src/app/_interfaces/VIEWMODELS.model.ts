import { Data, GeoFence, History } from './DBresponse.model';

export class Globalprops{
    public L: any;
    public map:any;
    public el;
    public reg_no:string;
    public mapType: string;
    public rect:any;
    public circle:any;
    public plgn:any;
    public polyline: any;
    public marker:any;
    public device_id:string;
}

export class Headerprops{
    public username: string;
    public logo: string;
    public currentMap: string = new Globalprops().map;
}

export class Geofenceprops{
public geoFences: GeoFence[];
public searchedFences:GeoFence[]=[];
public fenceType: any;
public rectMarkers: any[] = [];
public polyMarkers: any[] = [];
public rectangle: any;
public polygon: any;
public circleRadius: any;
public FenceParam: any;
public cityName: any; ;
public countryName: any;
public fenceName: any;
public circleMarkers: any[] = [];
public newCircle: any;
public fenceListLoaded: boolean = false;
public isgeofence: boolean = false;
}

export class Historyprops{
interval: number = 1000;
markerData = [];
markersData = [];
currentState: number = 0;
setTime: any;
marker: any;
historyInfo: History;
isHistory: boolean = false;
}

export class Mapprops{ 
public latitude: number; // marker for leaflet map
public longitude: number; // marker for leaflet map
public AllMarkers: any[] = []; // for map
public CarMarker: any = new Globalprops().L.icon({
iconUrl: './assets/img/vendor/google-maps/car-marker.png',
// iconSize: [38, 95], 
// iconAnchor: [22, 94], 
popupAnchor:[-3, -76] 
});
markers: any[] = []; // maps(Google and Leaflet)
mapBounds: any = []; // leafletmap
lat:number = 31.4884152; //map
lng: number = 74.3704655; //map
zoom:number = 2; //map
}