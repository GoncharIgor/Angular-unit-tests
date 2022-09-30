import {fakeAsync, flush, flushMicrotasks, tick} from '@angular/core/testing';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

describe('Async Testing Example', () => {

    // done cb - tells Jasmine that it'll be an async test
    it('Async test example - Jasmine done()', (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
            console.log('Running async assertions');

            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000);
    });

    // fakeAsync - allows to simulate the passage of time
    it('Async test example - setTimeout()', fakeAsync(() => {
        let test = false;

        setTimeout(() => {
        });

        // fakeAsync zone will replace the default browser's setTimeout with its own f()
        setTimeout(() => {
            console.log('Running async assertions for setTimeout()');
            test = true;
        }, 1000);

        // can be called only inside fakeAsync zone
        tick(1000);

        // OR:
        // flush(); // finishes all the pending timeouts or async operations in 1 step
        expect(test).toBeTruthy(); // this will success in outer block from setTimeout, unlike the first it()
    }));

    it('Async test example - plain Promise', fakeAsync(() => {
        let test = false;

        console.log('Creating Promise');
        Promise.resolve().then(() => { // immediately resolved promise
            console.log('1-st Promise was resolved');
            test = true;
            return Promise.resolve();
        }).then(() => {
            console.log('2-nd chained Promise was resolved');
        });

        flushMicrotasks();

        console.log('Running test assertion');
        expect(test).toBeTruthy();
    }));

    it('Async test example - Promises + setTimeout()', fakeAsync(() => {
        let counter = 0;

        Promise.resolve().then(() => {
            counter += 10;

            setTimeout(() => {
                counter += 1;
            }, 1000);

        });

        expect(counter).toBe(0);

        flushMicrotasks(); // will only resolve Promises
        expect(counter).toBe(10);

        tick(500);
        expect(counter).toBe(10);

        tick(500);
        expect(counter).toBe(11);
    }));

    it('Async test example - sync Observables', () => {
        let test = false;

        console.log('Creating observable');
        const test$ = of(test);

        // this code is synchronous, thus no need to use fakeAsync()
        // Observables can be either synchronous or asynchronous.
        // Observable is asynchronous if it wraps an http call
        // in this case, with usage "of", Observable is sync
        test$.subscribe(() => {
            test = true;
        });

        console.log('Running test assertion');
        expect(test).toBeTruthy();
    });

    it('Async test example - async Observables', fakeAsync(() => {
        let test = false;

        console.log('Creating observable');
        // delay - internally calls setTimeout and delays the emission of value
        const test$ = of(test).pipe(delay(1000));

        // async: this code will be executed after 1 sec of delay
        test$.subscribe(() => {
            test = true;

        });

        tick(1000); // move time forward for 1 sec
        console.log('Running test assertion');
        expect(test).toBeTruthy();
    }));
});

// Zone - a wrapper above Ang app, that knows when async operations finish and then the changeDetecion may be triggered
// fakeAsync - wraps test execution in an Angular Zone
