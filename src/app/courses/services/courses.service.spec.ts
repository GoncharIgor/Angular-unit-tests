import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES, findLessonsForCourse, LESSONS} from '../../../../server/db-data';
import {Course} from '../model/course';
import {HttpErrorResponse} from '@angular/common/http';

describe('CoursesService', () => {
    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // instead og HttpClient module service
            // HttpClientTestingModule - instead of making real server requests, will return mocked data
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        });

        // ??? - is the same: coursesService = TestBed.get(CoursesService);
        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {
        coursesService.findAllCourses().subscribe(courses => {
            expect(courses).toBeTruthy('No courses were returned');
            expect(courses.length).toBe(12, 'Incorrect number of courses');

            // test that data in course objects is correct:
            const course = courses.find(singleCourse => singleCourse.id === 12);
            expect(course.titles.description).toBe('Angular Testing Course');
        });

        const req = httpTestingController.expectOne('/api/courses'); // only 1 http request was made by http module to '/api/courses'
        expect(req.request.method).toEqual('GET');

        req.flush({ // we set the mock data, that will be send as response for the call on '/api/courses'
            payload: Object.values(COURSES)
        });
    });

    it('should find a course by ID', () => {
        coursesService.findCourseById(12).subscribe(course => {
            expect(course).toBeTruthy('Course was not found');
            expect(course.id).toBe(12, 'Incorrect course id');
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');

        req.flush(COURSES[12]); // returns course with id 12
    });

    it('should save the course data', () => {
        const updatedCourse: Partial<Course> = {titles: {description: 'Testing course'}};

        coursesService.saveCourse(12, updatedCourse).subscribe(course => {
            // the updated course will be sent as a response from server

            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        expect(req.request.body.titles.description).toEqual(updatedCourse.titles.description);

        req.flush(
            {
                ...COURSES[12],
                ...updatedCourse // overriding the COURSES[12] object with updatedCourse properties
            },
        );
    });

    it('should give an error if saveCourse() fails', () => {
        const updatedCourse: Partial<Course> = {titles: {description: 'Testing course'}};

        coursesService.saveCourse(12, updatedCourse).subscribe(() => {
            // we expecting this test case not to be successful, so if it reaches subscribe() data f(), then we fail it
            return fail('The save course should fail');
        }, (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        req.flush('Save course failed', {
            status: 500,
            statusText: 'Internal Server Error'
        });
    });

    it('should find a list of lessons', () => {
        coursesService.findLessons(12).subscribe((lessons) => {
            expect(lessons).toBeTruthy();
            expect(lessons.length).toBe(3, 'Incorrect amount of lessons in response');
        });

        const req = httpTestingController.expectOne(req => req.url === '/api/lessons'); // checking url, but without query parameters
        expect(req.request.method).toEqual('GET');

        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush(
            {
                payload: findLessonsForCourse(12).slice(0, 3) // taking first 3 elems, to correspond pageSize param === 3
            },
        );
    });

    afterEach(() => {
        httpTestingController.verify(); // checks that only requests, that are indicated in expect f()s (e.g. expectOne() ), are executed
    });

});

// toBe vs toEqual:
// For primitive types  there is no difference
// toEqual - for deep Objects comparison
