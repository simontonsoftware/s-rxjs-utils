import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SRxjsUtilsComponent} from './s-rxjs-utils.component';

describe('SRxjsUtilsComponent', () => {
  let component: SRxjsUtilsComponent;
  let fixture: ComponentFixture<SRxjsUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SRxjsUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SRxjsUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
