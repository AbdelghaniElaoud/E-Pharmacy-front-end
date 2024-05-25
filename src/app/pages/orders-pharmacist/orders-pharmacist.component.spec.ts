import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPharmacistComponent } from './orders-pharmacist.component';

describe('OrdersPharmacistComponent', () => {
  let component: OrdersPharmacistComponent;
  let fixture: ComponentFixture<OrdersPharmacistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPharmacistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersPharmacistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
