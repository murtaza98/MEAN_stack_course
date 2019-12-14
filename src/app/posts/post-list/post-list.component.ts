import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];
  postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
  }
}