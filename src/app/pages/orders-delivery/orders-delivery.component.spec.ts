import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDeliveryComponent } from './orders-delivery.component';

describe('OrdersDeliveryComponent', () => {
  let component: OrdersDeliveryComponent;
  let fixture: ComponentFixture<OrdersDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersDeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
