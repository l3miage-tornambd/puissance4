import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerTestsComponent } from './server-tests.component';

describe('ServerTestsComponent', () => {
  let component: ServerTestsComponent;
  let fixture: ComponentFixture<ServerTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerTestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
