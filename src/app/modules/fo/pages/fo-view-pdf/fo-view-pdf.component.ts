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

        this.loading = false;
    }

    openPDF() {
        this.foService.retrievePdf().subscribe((res: any) => {
            let blob = new Blob([res], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(blob);
            let pwa = window.open(url + "#page=" + this.page);
            if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
                alert('Please disable your pop-up blocker and try again.');
            }
        });
    }
}
