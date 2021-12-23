// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
// class SubMenu3 {
//   grp_id: number;
//   datatrack: string;
//   device_id: string;
//   pmd: string;
//   vrn: string;
//   parent_grp_id: number;
//   grp_name: string;
//   grp_level: object;
//   grp_trk_id: object;
//   parent_grp_trk_id: object;
//   grp_sub_station: object;
//   Status: object;
//   usr_id: number;
//   SubMenu: object[];
// }

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
