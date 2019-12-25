import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

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
  isLoading = false;    // to control spinner

  form: FormGroup;
  imagePreview: string;   // store preview image url


  constructor(postsService: PostsService, public route: ActivatedRoute) {
    this.postsService = postsService;
  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content};
            this.form.setValue({'title': this.post.title, 'content': this.post.content});
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    switch (this.mode) {
      case 'create':
        const newPost: Post = {
          id: this.getRandomId(),
          title: this.form.value.title,
          content: this.form.value.content
        };
        this.isLoading = true;
        this.postsService.addPosts(newPost);
        this.form.reset();
        break;
      case 'edit':
        this.post.title = this.form.value.title;
        this.post.content = this.form.value.content;
        this.isLoading = true;
        this.postsService.updatePost(this.postId, this.post);
        this.form.reset();
        break;
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  getRandomId() {
    return String(Math.floor(Math.random() * 100000) + 1);
  }
}
