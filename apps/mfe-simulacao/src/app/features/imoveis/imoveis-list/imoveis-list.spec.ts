import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ImoveisList } from './imoveis-list';
import { environment } from '../../../../environments/environment';

describe('ImoveisList', () => {
  let component: ImoveisList;
  let fixture: ComponentFixture<ImoveisList>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImoveisList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(ImoveisList);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTesting.expectOne(`${environment.apiUrl}/imoveis`).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
