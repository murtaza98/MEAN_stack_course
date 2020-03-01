import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
            id: post._id,
            imagePath: post.imagePath
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
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPosts(post: Post, image: File) {

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);

    this.httpClient.post<{message: string, post: any}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        console.log(responseData.message);
        post.id = responseData.post.id;
        post.imagePath = responseData.post.imagePath;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, post: Post, image: File | string) {
    if (typeof(image) === 'object') {
      // FILE
      const postData = new FormData();
      postData.append('id', id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
      postData.forEach((value, key) => {
            console.log(key + '  ' + value);
      });
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.httpClient.put<{message: string}>('http://localhost:3000/api/posts/' + id, postData, {headers: headers})
      .subscribe(responseData => {
        console.log(responseData);
        const updatedPosts = this.posts.filter(p => p.id !== id);

        // update image path url
        // post.imagePath = responseData.imagePath;

        updatedPosts.push(post);

        this.posts = updatedPosts;
        this.postUpdated.next(updatedPosts);

        this.router.navigate(['/']);
      });
    } else {
      // string
      const postData = {
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: image
      };
      this.httpClient.put<{message: string}>('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(responseData => {
        console.log(responseData);
        const updatedPosts = this.posts.filter(p => p.id !== id);

        // update image path url
        // post.imagePath = responseData.imagePath;

        updatedPosts.push(post);

        this.posts = updatedPosts;
        this.postUpdated.next(updatedPosts);

        this.router.navigate(['/']);
      });
    }


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
