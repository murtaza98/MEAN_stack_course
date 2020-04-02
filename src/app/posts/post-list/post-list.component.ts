import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postsService: PostsService;
  private postsSubs: Subscription;
  private authListenerSubs: Subscription;

  userIsAuthenticated = false;
  isLoading = false;      // to control spinner
  userId: string;

  // Pagination settings
  totalPost = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(postsService: PostsService, private authService: AuthService) {
    this.postsService = postsService;
  }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsSubs = this.postsService.getPostUpdateListener().subscribe(
      (postData: {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalPost = postData.postCount;
        this.isLoading = false;
      }
    );
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.currentPage = 1;
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSubs.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;    // +1 bcs in angular pages are 0th index while at backend it is 1 based indexed
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    // console.log(pageData);
  }
}
