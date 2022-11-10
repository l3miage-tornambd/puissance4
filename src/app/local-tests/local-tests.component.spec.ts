import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalTestsComponent } from './local-tests.component';

describe('LocalTestsComponent', () => {
  let component: LocalTestsComponent;
  let fixture: ComponentFixture<LocalTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalTestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
