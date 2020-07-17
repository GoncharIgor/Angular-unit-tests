import { Component, OnInit } from '@angular/core';
import {UserTestCompServic} from "./shared/user-test-comp.servic";
import {DataServic} from "./shared/data.servic";

@Component({
  selector: 'app-user-unit-testing',
  templateUrl: './user-unit-testing.componen.html',
  styleUrls: ['./user-unit-testing.componen.css'],
  providers: [UserTestCompServic, DataServic]
})
export class UserUnitTestingComponen implements OnInit {
  user: { name: string};
  isLoggedIn = false;
  data: string;

  constructor(private userTestCompService: UserTestCompServic,
              private dataService: DataServic) {
  }

  ngOnInit(): void {
    this.user = this.userTestCompService.user;
    this.dataService.getDetails().then(data => this.data = data);
  }

}
