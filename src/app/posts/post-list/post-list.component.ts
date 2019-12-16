import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postsService: PostsService;
  private postsSubs: Subscription;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSubs = this.postsService.getPostUpdateListener().subscribe(
      (posts) => {
        this.posts = posts;
      }
    );
  }

  ngOnDestroy() {
    this.postsSubs.unsubscribe();
  }
}
