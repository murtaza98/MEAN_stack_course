import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient, private router: Router) {
    this.httpClient = httpClient;
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      // mapping _id from backend to id in frontend
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
            }),
            maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPostData) => {
        console.log(transformedPostData.posts);
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPost(id: string) {
    // return an observable, which the calling component can subscribe
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPosts(post: Post, image: File) {

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);

    this.httpClient.post<{message: string, post: any}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        console.log(responseData.message);
        // no need to add posts in posts array, since if we navigate to index page, the ngOnInit will
        // automatically reload all posts
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
        // no need to update post in posts array, since if we navigate to index page, the ngOnInit will
        // automatically reload all posts
        this.router.navigate(['/']);
      });
    } else {
      // string
      const postData: Post = {
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: image,
          creator: null
      };
      this.httpClient.put<{message: string}>('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(responseData => {
        console.log(responseData);
        // no need to update post in posts array, since if we navigate to index page, the ngOnInit will
        // automatically reload all posts
        this.router.navigate(['/']);
      });
    }


  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  deletePost(id: string){
    return this.httpClient.delete('http://localhost:3000/api/posts/' + id);
  }
}
