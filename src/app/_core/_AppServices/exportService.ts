import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf"
import "jspdf-autotable"

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.csv';

@Injectable({
    providedIn: "root"
})
export class ExportService {
    public tableHead: string[] = [
        "ACC",
        "Alarm",
        "Dir",
        "Distance",
        "GPSDateTime",
        "Index",
        "Latitude",
        "Location",
        "Longitude",
        "RECDateTime",
        "RPM",
        "Speed",
        "Status"
    ];
    constructor() { }
    downloadExcelFile(data, title: string) {
        let csvData = this.ConvertToCSV(data, this.tableHead);
        let blob = new Blob(["\ufeff" + csvData], {
            type: EXCEL_TYPE,
        });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser =
            navigator.userAgent.indexOf("Safari") != -1 &&
            navigator.userAgent.indexOf("Chrome") == -1;
        if (isSafariBrowser) {
            //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", title + "_" + Date.now() + EXCEL_EXTENSION);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }

    ConvertToCSV(objArray, headerList) {
        let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
        let str = "";
        let row = "S.No,";

        for (let index in headerList) {
            row += headerList[index] + ",";
        }
        row = row.slice(0, -1);
        str += row + "\r\n";
        for (let i = 0; i < array.length; i++) {
            let line = i + 1 + "";
            for (let index in headerList) {
                ``
                let head = headerList[index];

                line += "," + array[i][head];
            }
            str += line + "\r\n";
        }
        return str;
    }
    downloadPDF(data: any[], title: string) {
        let head = this.tableHead;
        let doc = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: "legal",
        });
        // let doc = document;
        // let body = [];
        // data.forEach(element => {
        //     var temp = [
        //         element.ACC,
        //         element.Alarm,
        //         element.Dir,
        //         element.Distance,
        //         element.GPSDateTime,
        //         element.Index,
        //         element.Latitude,
        //         element.Location,
        //         element.Longitude,
        //         element.RECDateTime,
        //         element.RPM,
        //         element.Speed,
        //         element.Status];
        //     body.push(temp);
        // });
        // var rows = [];
        doc.text(`History for device ${title}`, 0, 0, { align: 'center' })
        doc.table(0, 0, data, head, { padding: 1, fontSize: 8, headerBackgroundColor: "yellow", headerTextColor: "black" ,margins:10})
        doc.save(title + "_" + Date.now() + ".pdf")
    }
}