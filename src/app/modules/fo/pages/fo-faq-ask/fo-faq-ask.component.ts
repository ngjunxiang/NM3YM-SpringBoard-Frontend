import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-faq-ask',
    templateUrl: './fo-faq-ask.component.html',
    styleUrls: ['./fo-faq-ask.component.css']
})
export class FOFaqAskComponent implements OnInit {

    // UI Control
    loading = false;
    searched = false;
    showNewQnForm = false;
    answerDialog = false;
    currentQuestion: string;
    currentAnswer: string;

    // UI Components
    questionForm: FormGroup;
    newQuestionForm: FormGroup;
    faqs: any[];

    constructor(
        private foService: FOService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.questionForm = this.fb.group({
            question: new FormControl('', Validators.required)
        });

        this.loading = false;
    }

    retrieveFAQ() {
        this.questionForm.get('question').markAsDirty();

        if (this.questionForm.get('question').invalid) {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please ask a question'
            });
            return;
        }

        this.loading = true;

        this.faqs = [];

        this.foService.retrieveFaq(this.questionForm.get('question').value).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.faqs = res.results;
            }

            this.searched = true;
            this.loading = false;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });

            this.searched = true;
            this.loading = false;
        });
    }

    showNewFAQForm() {
        this.newQuestionForm = this.fb.group({
            newQuestion: new FormControl('')
        });

        this.showNewQnForm = true;
    }

    postNewQuestion() {
        let newQuestion = this.newQuestionForm.get('newQuestion').value;
        if (newQuestion !== '') {
            this.loading = true;
            this.foService.createUnansweredQuestion(newQuestion).subscribe(res => {
                if (res.error) {
                    this.messageService.add({ 
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    this.messageService.add({ 
                        key: 'msgs', severity: 'success', summary: 'Success', detail: 'Your question has been posted'
                    });
                }
                this.loading = false;
            }, error => {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: error
                });

                this.loading = false;
            });
            return;
        }

        this.messageService.add({ 
            key: 'msgs', severity: 'info', summary: 'Please fill in the question field', detail: ''
        });
    }
    
    showAnswerDialog(qnID, qns, ans) {
       this.currentAnswer = ans
       this.currentQuestion = qns
       this.answerDialog = true;


       /*
        this.foService.increaseView().subscribe(res => {
           if (res.error) {
               this.messageService.add({ 
                   key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
               });
               return;
           }

       }, error => {
           this.messageService.add({ 
               key: 'msgs', severity: 'error', summary: 'Error', detail: error
           });
       });
       */
   }
}
