import {CalculatorServic, LoggerService} from './calculator.servic';
import {TestBed} from '@angular/core/testing';

// TestBed allows to provide dependencies to our services by using Dependency Injection

describe('CalculatorService', () => {
    let calculatorService: CalculatorServic;
    let loggerSpy: jasmine.SpyObj<LoggerService>;

    beforeEach(() => {
        // if we need only 1 f() or Observable to mock, than we may create such obj:
        // const viewPropertiesSpy = jasmine.createSpy('viewPropertiesSpy')
        // name in brackets - just for easiness to debug
        // and then in it() test: component.viewProperties$.subscribe(viewPropertiesSpy);
        // const viewProperties = viewPropertiesSpy.calls.argsFor(0)[0];

        // createSpyObj - we create fake LoggerService, instead of having its real instance. In [] brackets - its f()s
        // if we wanted to return any value: loggerSpy.printLog.and.returnValue('Fake value that is returned after f() is called')
        const spy = jasmine.createSpyObj('LoggerService', ['printLog']);

        // const calculatorService = new CalculatorServic(loggerSpy);

        TestBed.configureTestingModule({
            providers: [
                CalculatorServic, // actual instance
                // instead of using another LoggerService instance, we replace it with provider:
                // useValue - provides a value, that will be used when we need LoggerService
                {provide: LoggerService, useValue: spy} // LoggerService - DI token - unique key
            ]
        });

        // the same as: calculatorService = TestBed.get(CalculatorServic), but more type safe
        // TestBed.inject() was added in Angular 9
        calculatorService = TestBed.inject(CalculatorServic);
        // Angular docs recommend to add dependency services too
        loggerSpy = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
    });

    it('should add 2 numbers', () => {
        const result = calculatorService.add(4, 3);

        expect(result).toBe(7);
        expect(loggerSpy.printLog).toHaveBeenCalledTimes(1); // how much f() was called
    });

    it('should subtract 2 numbers', () => {
        // 1 WAY
        // real LoggerService instance
        // const calculatorService =  new CalculatorServic(new LoggerService());

        // 2 WAY
        // real LoggerService instance
        // const logger = new LoggerService();
        // const calculatorService = new CalculatorServic(logger);

        // the original f() printLog() in the service instance will be replaced by Jasmine its implementation (wrapper)
        // spyOn(logger, 'printLog'); // spy on service f()

        const result = calculatorService.subtract(4, 3);

        expect(result).toBe(1, 'Unexpected subtraction result');
        expect(loggerSpy.printLog).toHaveBeenCalledTimes(1); // how much f() was called
    });
});
