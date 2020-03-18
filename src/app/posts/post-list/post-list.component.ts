import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postsService: PostsService;
  private postsSubs: Subscription;

  isLoading = false;      // to control spinner

  // Pagination settings
  totalPost = 10;
  postsPerPage = 5;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.isLoading = true;
    this.postsSubs = this.postsService.getPostUpdateListener().subscribe(
      (posts) => {
        this.posts = posts;
        this.isLoading = false;
      }
    );
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  ngOnDestroy() {
    this.postsSubs.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
  }
}
