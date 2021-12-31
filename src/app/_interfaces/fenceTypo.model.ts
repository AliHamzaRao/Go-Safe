export class fenceTypo {

    public gf_type: string;
    public fenceParam: cords[];
    public gf_diff: string;
    constructor(Data: any) {
        this.gf_type = Data.gf_type;
        this.fenceParam = Data.fenceParam
        this.gf_diff = Data.gf_diff
    }
}
export class cords {
    public lat: any;
    public lng: any;
}