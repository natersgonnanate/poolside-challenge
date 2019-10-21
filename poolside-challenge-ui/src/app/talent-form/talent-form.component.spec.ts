import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentFormComponent } from './talent-form.component';

describe('TalentFormComponent', () => {
  let component: TalentFormComponent;
  let fixture: ComponentFixture<TalentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
