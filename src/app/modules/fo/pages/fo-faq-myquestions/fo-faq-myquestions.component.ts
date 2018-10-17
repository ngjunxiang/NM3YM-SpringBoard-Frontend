import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-faq-myquestions',
    templateUrl: './fo-faq-myquestions.component.html',
    styleUrls: ['./fo-faq-myquestions.component.css']
})
export class FOFaqMyQuestionsComponent implements OnInit {

   // UI Control
   loading = false;
   msgs: Message[] = [];
   answerDialog = false;
   currentQuestion: string;
   currentAnswer: string;

   // UI Components
   faqs: any[];
   displayFAQs: any[];

   constructor(
       private foService: FOService,
       private route: ActivatedRoute,
       private router: Router
   ) { }

   ngOnInit() {
       this.loading = true;

       this.retrieveFAQ();
   }

   retrieveFAQ() {
       this.faqs = [];

       this.foService.retrieveAllFaq().subscribe(res => {
           if (res.error) {
               this.msgs.push({
                   severity: 'error', summary: 'Error', detail: res.error
               });
               this.loading = false;
               return;
           }

           if (res.results) {
               this.faqs = res.results;
           }

           this.loading = false;
       }, error => {
           this.msgs.push({
               severity: 'error', summary: 'Error', detail: error
           });

           this.loading = false;
       });
   }

   showAnswerDialog(qnID, qns, ans) {
       this.currentAnswer = ans
       this.currentQuestion = qns
       this.answerDialog = true;
       console.log(qnID)

       /*
        this.foService.increaseView().subscribe(res => {
           if (res.error) {
               this.msgs.push({
                   severity: 'error', summary: 'Error', detail: res.error
               });
               return;
           }

       }, error => {
           this.msgs.push({
               severity: 'error', summary: 'Error', detail: error
           });
       });
       */
   }
}
