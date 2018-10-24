import { Component, OnInit } from '@angular/core';

import { FOService } from 'src/app/core/services/fo.service';

@Component({
    selector: 'fo-view-pdf',
    templateUrl: './fo-view-pdf.component.html',
    styleUrls: ['./fo-view-pdf.component.css']
})

export class FOViewPDFComponent implements OnInit {

    loading = false;
    page: number = 2;
    pdfSrc: string;

    constructor(
        private foService: FOService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.pdfSrc = this.foService.pdfUrl;
        this.loading = false;
    }

}
