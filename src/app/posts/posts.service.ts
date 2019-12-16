import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getPosts() {
    this.httpClient.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postUpdated.next([...this.posts]);
      });
  }

  addPosts(post: Post) {
    this.httpClient.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
}
