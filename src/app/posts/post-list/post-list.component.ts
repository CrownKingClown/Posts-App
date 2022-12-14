import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts= 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated: boolean;

  constructor(public postsService: PostsService, private authService:AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,1);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postsCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postsCount;
        this.posts = postData.posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
      );
    }

  onDelete(postId: string) {
    this.isLoading = true;

    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage,1);
    })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;

    this.postsService.getPosts(pageData.pageSize,pageData.pageIndex + 1);
  }
}
