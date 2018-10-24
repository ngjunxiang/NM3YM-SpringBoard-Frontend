import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-cm-faq-synonym',
  templateUrl: './cm-faq-synonym.component.html',
  styleUrls: ['./cm-faq-synonym.component.css']
})

export class CmFaqSynonymComponent implements OnInit {

  // UI Control
  loading = false;
  msgs: Message[] = [];


  // UI Components
  synonyms = [];
  keys = [];
  synonymForm: FormGroup;

  constructor(
    private cmService: CMService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.retrieveSynonyms();
  }

  retrieveSynonyms() {
    this.cmService.retriveSynonyms().subscribe(res => {
      if (res.error) {
        this.msgs.push({
          severity: 'error', summary: 'Error', detail: res.error
        });
        this.loading = false;
        return;
      }

      if (res.results) {
        this.keys = Object.keys(res.results);
        this.keys.forEach(key => {
          let values = []
          let objValues = res.results[key];
          objValues.forEach(value => {
            values.push(value)
          })
          this.synonyms.push({
            value: key,
            synonyms: values,
          })
        })

        console.log(this.synonyms)
        this.createForm();
      }

      this.loading = false;
    }, error => {
      this.msgs.push({
        severity: 'error', summary: 'Server Error', detail: error
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
          synonyms: new FormControl(this.synonyms[i].synonyms, Validators.required )
        })
      );
    }
    console.log(this.synonymForm)
    this.loading = false;
  };
}

