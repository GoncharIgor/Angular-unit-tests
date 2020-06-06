import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import {Course} from '../model/course';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;
    let debugElement: DebugElement;
    let coursesService: any;

    const beginnerCourses: Course[] = setupCourses().filter(course => course.category === 'BEGINNER');
    const advancedCourses: Course[] = setupCourses().filter(course => course.category === 'ADVANCED');

    beforeEach(async(() => {
        const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

        TestBed.configureTestingModule({
            imports: [
                CoursesModule,
                NoopAnimationsModule // we want to disable animation for Ang Material components
            ],
            providers: [
                {provide: CoursesService, useValue: coursesServiceSpy}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        coursesService = TestBed.get(CoursesService); // points to spy f()
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display only beginner courses', () => {
        // of(): creates Observable => immediately emits its value => completes. All it - sync
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
    it('should display advanced courses when tab clicked', (done) => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();

        const tabs = debugElement.queryAll(By.css('.mat-tab-label'));
        tabs[1].nativeElement.click();
        // OR to use: click(tabs[1]);
        fixture.detectChanges();

        setTimeout(() => {
            fixture.detectChanges(); // to check why do I need to call it twice?
            const cardsTitles = debugElement.queryAll(By.css('.mat-card-title'));
            expect(cardsTitles.length).toBeGreaterThan(0, 'Could not find card titles');
            expect(cardsTitles[0].nativeElement.textContent)
                .toContain('Angular Security Course', 'Incorrect course title');

            done();
        }, 500);
    });
});
