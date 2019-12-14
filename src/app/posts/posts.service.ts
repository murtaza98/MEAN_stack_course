import { Post } from './post.model'
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];

  getPosts() {
    return [...this.posts];     // spread operator for clonning
  }

  addPosts(post: Post) {
    this.posts.push(post);
  }
}
