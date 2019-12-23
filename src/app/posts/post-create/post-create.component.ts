import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  rowSize = '1';

  enteredTitle = '';
  enteredContent = '';
  postsService: PostsService;
  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(postsService: PostsService, public route: ActivatedRoute) {
    this.postsService = postsService;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.post = {id: postData._id, title: postData.title, content: postData.content};
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    switch(this.mode) {
      case 'create':
        const newPost: Post = {
          id: this.getRandomId(),
          title: form.value.title,
          content: form.value.content
        };
        this.postsService.addPosts(newPost);
        form.resetForm();
        break;
      case 'edit':
        this.post.title = form.value.title;
        this.post.content = form.value.content;
        this.postsService.updatePost(this.postId, this.post);
        form.resetForm();
        break;
    }
  }

  getRandomId() {
    return String(Math.floor(Math.random() * 100000) + 1);
  }
}
