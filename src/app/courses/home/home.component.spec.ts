import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesService} from '../services/courses.service';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Course} from '../model/course';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;
    let debugElement: DebugElement;
    let coursesService: any;

    const beginnerCourses: Course[] = setupCourses().filter(course => course.category === 'BEGINNER');
    const advancedCourses: Course[] = setupCourses().filter(course => course.category === 'ADVANCED');

    // async covers block in Test Zone
    // we use async() instead of fakeAsync() here, because configureTestingModule makes real http calls for BE to get templates and other resources
    beforeEach(async(() => {
        const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

        // The default test module is pre-configured with something like the BrowserModule from @angular/platform-browser
        TestBed.configureTestingModule({
            imports: [
                CoursesModule,
                NoopAnimationsModule // we want to disable animation for Ang Material components
            ],
            providers: [
                {provide: CoursesService, useValue: coursesServiceSpy}
            ]
        }).compileComponents(); // compile template and css
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        // createComponent()  f() freezes the current TestBed definition
        // Angular guide makes component with debugElement: component = fixture.debugElement.componentInstance
        component = fixture.componentInstance; // creates an instance of the class 'HomeComponent'
        // DebugElement is a wrapper across native elements and tested component allowing test to run on all supported platforms
        debugElement = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService); // points to spy f()
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    fit('should display only beginner courses', () => {
        // of(): creates Observable => immediately emits its value => completes. All these steps are synchronous
        coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
        fixture.detectChanges();

        const tabs = debugElement.queryAll(By.css('.mat-tab-label'));
        expect(tabs.length).toBe(1, 'Unexpected number of tabs');
    });

    it('should display only advanced courses', () => {
        coursesService.findAllCourses.and.returnValue(of(advancedCourses));
        fixture.detectChanges();

        const tabs = debugElement.queryAll(By.css('.mat-tab-label'));
        expect(tabs.length).toBe(1, 'Unexpected number of tabs');
    });

    it('should display both tabs', () => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();

        const tabs = debugElement.queryAll(By.css('.mat-tab-label'));
        expect(tabs.length).toBe(2, 'Expected to find 2 tabs');
    });

    // done cb - tells Jasmine that it'll be an async test
    it('should display advanced courses when tab clicked - with done()', (done) => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();

        const tabs = debugElement.queryAll(By.css('.mat-tab-label'));
        tabs[1].nativeElement.click();
        // OR to use: click(tabs[1]);
        fixture.detectChanges();

        // we need timeout because of AngularMaterial tabs RequestAnimationFrame - animation for changing tab s
        setTimeout(() => {
            const cardsTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
            expect(cardsTitles.length).toBeGreaterThan(0, 'Could not find card titles');
            expect(cardsTitles[0].nativeElement.textContent)
                .toContain('Angular Security Course', 'Incorrect course title');

            done();
        }, 500);
    });

    // fakeAsync() - is better then async(), because:
    // 1. Control over time
    // 2. sync looking way of writing expectations
    // 3. control on clearing micro- and macrotasks
    it('should display advanced courses when tab clicked - with fakeAsync', fakeAsync(() => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();

        const tabs = debugElement.queryAll(By.css('.mat-tab-label'));
        tabs[1].nativeElement.click();
        fixture.detectChanges();

        flush(); // will empty the tasks queue (macrotasks)
        // tick(500);  // ms for RequestAnimationFrame to finish

        const cardsTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
        expect(cardsTitles.length).toBeGreaterThan(0, 'Could not find card titles');
        expect(cardsTitles[0].nativeElement.textContent)
            .toContain('Angular Security Course', 'Incorrect course title');
    }));

    // benefits of async() over fakeAsync() - it supports actual http requests (e.g - for integration T, that make real http requests)
    it('should display advanced courses when tab clicked - with async', async(() => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();

        const tabs = debugElement.queryAll(By.css('.mat-tab-label'));
        tabs[1].nativeElement.click();
        fixture.detectChanges();

        // whenStable() - cb f(), that async() f() will call when all async operations, that TestZone has detected, are completed
        // async deals both: with micro- and macrotasks (Promises, Timeouts)
        fixture.whenStable().then(() => {
            console.log('Called whenStable()');
            const cardsTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
            expect(cardsTitles.length).toBeGreaterThan(0, 'Could not find card titles');
            expect(cardsTitles[0].nativeElement.textContent)
                .toContain('Angular Security Course', 'Incorrect course title');
        });
    }));
});

// const bannerElement: HTMLElement = fixture.nativeElement;
// This is actually a convenience method, implemented as fixture.debugElement.nativeElement.
