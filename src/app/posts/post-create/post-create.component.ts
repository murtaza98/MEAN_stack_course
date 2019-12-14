import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent {
  newPost = '';
  rowSize = '10';
  onAddPost() {
    this.newPost = 'Some new Content';
  }
}
