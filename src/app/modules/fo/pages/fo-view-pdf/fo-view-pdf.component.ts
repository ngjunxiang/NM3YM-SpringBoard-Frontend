import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'fo-view-pdf',
    templateUrl: './fo-view-pdf.component.html',
    styleUrls: ['./fo-view-pdf.component.css']
})

export class FOViewPDFComponent implements OnInit {

    page: number = 2;
    pdfSrc: string = 'assets/pdf/reg51.pdf';

    constructor() { }

    ngOnInit() {
    }

}
