/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HistorymembersComponent } from './historymembers.component';

describe('HistorymembersComponent', () => {
  let component: HistorymembersComponent;
  let fixture: ComponentFixture<HistorymembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorymembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorymembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
