import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'cm-faq-synonym',
  templateUrl: './cm-faq-synonym.component.html',
  styleUrls: ['./cm-faq-synonym.component.css']
})

export class CMFaqSynonymComponent implements OnInit {

  // UI Control
  loading = false;

  // UI Components
  synonyms = [];
  keys = [];
  synonymForm: FormGroup;

  // Paginator Controls
  numSynonyms: number;
  firstIndex: number;
  lastIndex: number;
  pageNumber: number;

  constructor(
    private cmService: CMService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.firstIndex = 0;
    this.lastIndex = 10;
    this.retrieveSynonyms();
  }

  retrieveSynonyms() {
    this.cmService.retrieveSynonyms().subscribe(res => {
      if (res.error) {
        this.messageService.add({ 
          key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
        });
        this.loading = false;
        return;
      }

      if (res.results) {
        this.keys = Object.keys(res.results);
        this.keys.forEach(key => {
          let values = []
          let objValues = res.results[key];
          this.synonyms.push({
            value: key,
            synonyms: objValues,
          })
        })
        this.createForm();
      }
      this.numSynonyms = this.synonyms.length;
      this.loading = false;
    }, error => {
      this.messageService.add({ 
        key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
      });
      this.loading = false;
    });
  }

  createForm() {
    this.synonymForm = this.fb.group({
      form: this.fb.array([])
    });

    let synControl = <FormArray>this.synonymForm['controls'].form;

    for (let i = 0; i < this.synonyms.length; i++) {
      synControl.push(
        this.fb.group({
          value: new FormControl(this.synonyms[i].value, Validators.required),
          synonyms: new FormControl(this.synonyms[i].synonyms, Validators.required)
        })
      );
    }
    this.loading = false;
  };

  updateSynonyms() {
    let synonymsDict = {};
    let synControl = <FormArray>this.synonymForm['controls'].form;

    for (let i = 0; i < synControl.length; i++) {
      synControl.get(i + '').get('value').markAsDirty();
      synControl.get(i + '').get('synonyms').markAsDirty();
      let value = synControl.get(i + '').get('value').value.trim();
      if (synControl.get(i + '').get('value').invalid || synControl.get(i + '').get('synonyms').invalid) {
        if (value != "") {
          this.messageService.add({ 
            key: 'msgs', severity: 'error', summary: 'Missing fields', detail: "Please ensure that " + value + "'s fields are filled."
          });
          return;
        } else {
          this.messageService.add({ 
            key: 'msgs', severity: 'error', summary: 'Missing fields', detail: "Please ensure that all fields are filled."
          });
          return;
        }
      }
      synonymsDict[synControl.get(i + '').get('value').value] = synControl.get(i + '').get('synonyms').value;
    };

    this.cmService.updateSynonyms(synonymsDict).subscribe(res => {
      if (res.error) {
        this.messageService.add({ 
          key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
        });
        return;
      }

      if (res.results) {
        this.messageService.add({ 
          key: 'msgs', severity: 'success', summary: 'Success', detail: "All synonyms have been updated."
        });
      }
    }, error => {
      this.messageService.add({ 
        key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
      });
      this.loading = false;
    });
  }

  paginate(event) {
    //First index of the FormArray that will appear on the page  
    this.firstIndex = event.first;

    //Last index of the FormArray that will appears on the page  
    this.lastIndex = this.firstIndex + 10;
  }
}



