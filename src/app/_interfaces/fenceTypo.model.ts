export class fenceTypo {

    public gf_type: string;
    public fenceParam: cords[];
    constructor(Data: any) {
        this.gf_type = Data.gf_type;
        this.fenceParam = Data.fenceParam
    }
}
export class cords {
    public lat: any;
    public lng: any;
}