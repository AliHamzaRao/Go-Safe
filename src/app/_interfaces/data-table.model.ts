export class DataTable{
    
}
export class DataTablesResponse{
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}
export interface SearchCriteria{
    isPageLoad:boolean;
    filter:string;
}
