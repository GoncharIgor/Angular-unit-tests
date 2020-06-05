import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AboutComponent} from '../about/about.component';
import {AppRoutingModule} from '../app-routing.module';
import {CourseComponent} from './course/course.component';
import {CourseDialogComponent} from './course-dialog/course-dialog.component';
import {CourseResolver} from './services/course.resolver';
import {CoursesCardListComponent} from './courses-card-list/courses-card-list.component';
import {CoursesService} from './services/courses.service';
import {HomeComponent} from './home/home.component';
import {MaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    CourseComponent,
    CoursesCardListComponent,
    CourseDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
  ],
  exports: [
    HomeComponent,
    AboutComponent,
    CourseComponent,
    CoursesCardListComponent,
    CourseDialogComponent
  ],
  providers: [
    CoursesService,
    CourseResolver
  ],
  entryComponents: [CourseDialogComponent]
})
export class CoursesModule {
}
