import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MapInfo } from "./mapInfo.model";

@Injectable({
  providedIn:'root'
})
export class mapInforProviderService {

  constructor(private info: MapInfo){}

  public markersArray :BehaviorSubject<any> = new BehaviorSubject<any>([]);

  // currentData = this.message.asObservable();
storeMarkers(markersArray: []){
this.markersArray.next(markersArray)
}  
// retriveData(){
//   console.log(this.markersArray)
// }


};