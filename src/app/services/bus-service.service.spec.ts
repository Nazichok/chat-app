import { TestBed } from '@angular/core/testing';
import { EventBusService, EventData } from './bus-service.service';

describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit event', () => {
    const eventName = 'testEvent';
    const eventValue = 'testValue';
    const event = new EventData(eventName, eventValue);

    let emittedEvent: EventData | undefined;
    service.on(eventName, (event: EventData) => {
      emittedEvent = event;
    });

    service.emit(event);

    expect(emittedEvent).toEqual(event.value);
  });

  it('should not emit event with different name', () => {
    const eventName = 'testEvent';
    const eventValue = 'testValue';
    const event = new EventData(eventName, eventValue);

    let emittedEvent: EventData | undefined;
    service.on('differentEvent', (event: EventData) => {
      emittedEvent = event;
    });

    service.emit(event);

    expect(emittedEvent).toBeUndefined();
  });

  it('should unsubscribe from event', () => {
    const eventName = 'testEvent';
    const eventValue = 'testValue';
    const event = new EventData(eventName, eventValue);

    let emittedEvent: EventData | undefined;
    const subscription = service.on(eventName, (event: EventData) => {
      emittedEvent = event;
    });

    subscription.unsubscribe();

    service.emit(event);

    expect(emittedEvent).toBeUndefined();
  });
});