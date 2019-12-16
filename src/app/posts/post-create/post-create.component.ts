import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  rowSize = '1';

  enteredTitle = '';
  enteredContent = '';
  postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post: Post = {
      id: this.getRandomId(),
      title: form.value.title,
      content: form.value.content
    };
    this.postsService.addPosts(post);
    form.resetForm();
  }

  getRandomId() {
    return String(Math.floor(Math.random() * 100000) + 1);
  }
}
