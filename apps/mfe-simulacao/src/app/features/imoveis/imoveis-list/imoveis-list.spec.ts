import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ImoveisList } from './imoveis-list';

describe('ImoveisList', () => {
  let component: ImoveisList;
  let fixture: ComponentFixture<ImoveisList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImoveisList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ImoveisList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
