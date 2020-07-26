import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { error } from 'protractor';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  baseUrl = environment.apiUrl;
  uploader: FileUploader;
  currentMain: Photo;
  hasBaseDropZoneOver = false;

  constructor(private authService: AuthService, private userService: UserService , private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res: Photo = JSON.parse(response);
      const photo = {
       id: res.id,
       description: res.description,
       url: res.url,
       ismain: res.ismain,
       dateadded: res.dateadded
      };
      this.photos.push(photo);
    };
  }

  setMainPhoto(photo: Photo)
  {
    const userId = this.authService.decodedToken.nameid;
    return this.userService.updateMainPhoto(userId, photo.id).subscribe(() => {
      // this.currentMain = this.photos.filter(p => p.ismain === true)[0];
      // this.currentMain.ismain = false;
      // photo.ismain = true;
      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }

  deletePhoto(photoid: number){
  const userId = this.authService.decodedToken.nameid;
  this.alertify.confirm('Are you sure you want to delete this photo', () => {
     this.userService.deletePhoto( userId,photoid).subscribe(() => {
       // remove the photo from the array
       this.photos.splice(this.photos.findIndex(p => p.id === photoid), 1);
       this.alertify.success('Photo deleted Successfully ');
     }, error => {
       this.alertify.error(error);
     });
   });
  }

}
