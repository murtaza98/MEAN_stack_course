import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];     // spread operator for clonning
  }

  addPosts(post: Post) {
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }
}
