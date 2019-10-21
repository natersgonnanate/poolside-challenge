import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Availability } from '../models/Availability';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-new-availability-form',
  templateUrl: './new-availability-form.component.html',
  styleUrls: ['./new-availability-form.component.scss']
})
export class NewAvailabilityFormComponent implements OnInit {
  @Output() availabilityCreated = new EventEmitter<Availability>();

  model = new Availability();

  constructor(private availabilityService: AvailabilityService) { }

  ngOnInit() {
  }

  save(input: Availability): void {
    this.availabilityService.createAvailability(input)
      .subscribe((availability) => {
        this.availabilityCreated.emit(availability);
      });
  }
}
