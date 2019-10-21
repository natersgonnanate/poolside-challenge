import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAvailabilityFormComponent } from './new-availability-form.component';

describe('NewAvailabilityFormComponent', () => {
  let component: NewAvailabilityFormComponent;
  let fixture: ComponentFixture<NewAvailabilityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAvailabilityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAvailabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
