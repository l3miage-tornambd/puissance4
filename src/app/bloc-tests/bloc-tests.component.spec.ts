import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocTestsComponent } from './bloc-tests.component';

describe('BlocTestsComponent', () => {
  let component: BlocTestsComponent;
  let fixture: ComponentFixture<BlocTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocTestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
