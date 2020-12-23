import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {UserUnitTestingComponen} from './user-unit-testing.componen';
import {UserTestCompServic} from './shared/user-test-comp.servic';
import {DataServic} from './shared/data.servic';

// TestBed is the main entry to all of Angular’s testing interface

describe('UserUnitTestingComponent', () => {
    let component: UserUnitTestingComponen;
    let fixture: ComponentFixture<UserUnitTestingComponen>;

    // async beforeEach block
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserUnitTestingComponen]
        })
            .compileComponents(); // compileComponents() is not needed only when you are using Webpack
    }));

    beforeEach(() => {
        // The createComponent method actually returns a ComponentFixture
        fixture = TestBed.createComponent(UserUnitTestingComponen); // create component in testing environment (TedtBed)
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should use user name from the shared', () => {
        // to inject shared to testing component
        // TestBed.inject() is the same, but service has to be provided in 'root'
        const userService = fixture.debugElement.injector.get(UserTestCompServic);
        fixture.detectChanges();
        expect(userService.user.name).toEqual('Igor');
        expect(userService.user.name).toEqual(component.user.name);
    });

    it('should display the user name if user is logged in', () => {
        component.isLoggedIn = true;
        fixture.detectChanges(); // we need to put it every time, when we change the component from its initial state to a new one
        const compiledComponentTemplate = fixture.nativeElement;
        expect(compiledComponentTemplate.querySelector('p').textContent).toContain(component.user.name);
    });

    it('should not display the user name if user is not logged in', () => {
        fixture.detectChanges(); // we need to put it every time, when we change the component from its initial state to a new one
        const compiledComponentTemplate = fixture.nativeElement;
        expect(compiledComponentTemplate.querySelector('p').textContent).not.toContain(component.user.name);
    });

    it('should not fetch data if not called asynchronously', () => {
        const dataService = fixture.debugElement.injector.get(DataServic);
        // we spy on getDetails() f() of dataService.
        // Means - we get informed whe f() is being executed and then, we return mock data
        let spy = spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'));
        fixture.detectChanges();
        // undefined - because it's not called asynchronously
        expect(component.data).toBe(undefined);
    });

    it('should fetch data if is called asynchronously', async(() => {
        const dataService = fixture.debugElement.injector.get(DataServic);
        let spy = spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'));
        fixture.detectChanges();
        // behaves more like a real async test
        fixture.whenStable().then(() => { // whenStable - allows to react on all async tasks when they are finished
            expect(component.data).toBe('Data');
        });

    }));

    it('should fetch data if is called asynchronously, but without whenStable() f()', fakeAsync(() => {
        const dataService = fixture.debugElement.injector.get(DataServic);
        let spy = spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'));
        fixture.detectChanges();
        tick(); // tick - finishes all async tasks immediately; You need to pass time as argument
        expect(component.data).toBe('Data');
    }));

    it('A pending test', () => {
        pending('With some reason');
        // if to disable with 'xit', then it aslo will be pending, but with message:
        // PENDING WITH MESSAGE: Temporarily disabled with xit
    });
});

// ng test --no-watch - to run not in hot mode, but run and exit

// useful methods:
//
// component.ngOnInit();
// expect(component.formGroup instanceof FormGroup).toBe(true);
//
// fail()
