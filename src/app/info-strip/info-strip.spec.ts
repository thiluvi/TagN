import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoStrip } from './info-strip';

describe('InfoStrip', () => {
  let component: InfoStrip;
  let fixture: ComponentFixture<InfoStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
