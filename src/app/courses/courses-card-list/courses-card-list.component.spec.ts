import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {
    let fixture: ComponentFixture<CoursesCardListComponent>; // gives us testing f() over component
    let component: CoursesCardListComponent;
    let debugElement: DebugElement;

    // async - to wait for compileComponents() promise to complete (or any other promises). By default - waits for 5 secs
    // when it completes, the further 'it' f() will go on
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CoursesModule],
        }).compileComponents()
            .then(() => {
                // or it can be declared in 2-nd beforeEach(), because we need to wait this promise to resolve
                fixture = TestBed.createComponent(CoursesCardListComponent);
                component = fixture.componentInstance;
                debugElement = fixture.debugElement;
            });
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the course list', () => {
        component.courses = setupCourses();

        // we need to trigger changes, because we assign value to a property of type @Input
        fixture.detectChanges();

        // print Html of whole component
        // the same as: fixture.nativeElement.outerHTML
        // console.log(debugElement.nativeElement.outerHTML);

        const cardsList = debugElement.queryAll(By.css('.course-card'));

        expect(cardsList).toBeTruthy('Could not find cards');
        expect(cardsList.length).toBe(12, 'Unexpected number of courses');
    });

    it('should display the first course', () => {
        component.courses = setupCourses();
        fixture.detectChanges();

        const firstCourse = component.courses[0];
        const card = debugElement.query(By.css('.course-card:first-child'));
        const cardTitle = card.query(By.css('mat-card-title'));
        const cardImage = card.query(By.css('img'));

        expect(card).toBeTruthy('Card was not displayed');
        expect(cardTitle.nativeElement.textContent).toBe(firstCourse.titles.description, 'Incorrect course title');
        expect(cardImage.nativeElement.src).toBe(firstCourse.iconUrl, 'Incorrect course image');
    });
});


// DebugElement is a wrapper across native elements and tested component allowing test to run on all supported platforms.
// fixture.nativeElement and fixture.debugElement.nativeElement are the same things.
// fixture.debugElement has other methods and properties that are useful in tests like By.css()
