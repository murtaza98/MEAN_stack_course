import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getPosts() {
    this.httpClient
      .get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      // mapping _id from backend to id in frontend
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPost(id: string){
    return {...this.posts.find(p => p.id === id)};
  }

  addPosts(post: Post) {
    this.httpClient.post<{message: string, addedPostId: any}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        post.id = responseData.addedPostId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  deletePost(id: string){
    this.httpClient.delete('http://localhost:3000/api/posts/' + id)
      .subscribe((responseData: any) => {
        console.log(responseData.message);
        // remove this post from frontend
        const updatedPost = this.posts.filter(post => post.id !== id);
        this.posts = updatedPost;
        this.postUpdated.next([...this.posts]);
      });
  }
}
