import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient, private router: Router) {
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

  getPost(id: string) {
    // return an observable, which the calling component can subscribe
    return this.httpClient.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPosts(post: Post, image: File) {

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);

    this.httpClient.post<{message: string, addedPostId: any}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        console.log(responseData.message);
        post.id = responseData.addedPostId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, post: Post) {
    this.httpClient.put<{message: string}>('http://localhost:3000/api/posts/' + id, post)
      .subscribe(responseData => {
        console.log(responseData);
        const updatedPost = this.posts.filter(p => p.id !== id);
        updatedPost.push(post);

        this.posts = updatedPost;
        this.postUpdated.next(updatedPost);

        this.router.navigate(['/']);
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
