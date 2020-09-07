import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  photoUrl: string;
  @ViewChild('editForm', {static: true})editForm: NgForm // getting access to html elemets in ts.
  user: User;
  @HostListener('window: beforeunload', ['$event']) // event listener for browser.
  unloadNotification($event: any){
    if (this.editForm.dirty)
    {
      return $event.returnValue = true;
    }
  }
  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private userService: UserService,
              private authService: AuthService ) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser()
  {
    // getting the userID from userid part of the decoded token.
    return this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Record successfully updated');
      this.editForm.reset(this.user); // to keep user data after reset pass in this.user
    }, error => {
      this.alertify.error(error);
    });
  }
  // receiving output from childComponent to update main photo
  updateMainPhoto(photoUrl)
  {
    this.user.photoUrl = photoUrl;
  }

}
