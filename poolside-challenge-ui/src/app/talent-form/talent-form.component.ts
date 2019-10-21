import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Talent } from "../models/Talent";

@Component({
  selector: 'app-talent-form',
  templateUrl: './talent-form.component.html',
  styleUrls: ['./talent-form.component.sass']
})
export class TalentFormComponent implements OnInit {
  @Output() talentOutput = new EventEmitter<Talent>();

  model = new Talent();

  constructor() { }

  ngOnInit() {
  }

  startTalentSubmit(input): void {
    this.talentOutput.emit(input);
  }
}
