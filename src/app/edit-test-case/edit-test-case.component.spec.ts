import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestCaseComponent } from './edit-test-case.component';

describe('EditTestCaseComponent', () => {
  let component: EditTestCaseComponent;
  let fixture: ComponentFixture<EditTestCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTestCaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
