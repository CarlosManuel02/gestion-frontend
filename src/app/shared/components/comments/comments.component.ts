import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {
  NzCommentActionComponent,
  NzCommentAvatarDirective,
  NzCommentComponent,
  NzCommentContentDirective
} from "ng-zorro-antd/comment";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzListComponent} from "ng-zorro-antd/list";
import {NzRowDirective} from "ng-zorro-antd/grid";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommentsService} from "../../services/comments.service";
import {UserDisplayComponent} from "../../../protected/components/user-display/user-display.component";
import {AuthService} from "../../services/auth.service";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NzAvatarComponent,
    NzButtonComponent,
    NzCommentAvatarDirective,
    NzCommentComponent,
    NzCommentContentDirective,
    NzInputDirective,
    NzListComponent,
    NzRowDirective,
    ReactiveFormsModule,
    FormsModule,
    UserDisplayComponent,
    NzTooltipDirective,
    NzIconDirective,
    NzCommentActionComponent,
    NzPopconfirmDirective
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements AfterViewInit, OnChanges {

  inputValue: any;
  loading: boolean = false;

  @Input() taskId: string = '';
  @Input() active: boolean = false;
  @Output() emitCommentsLength = new EventEmitter<number>();

  get user() {
    return this.authService.user;
  }

  get comments() {
    return this.commentService.comments;
  }

  set comments(value) {
    this.commentService.comments = value;
  }

  constructor(private commentService: CommentsService,
              private authService: AuthService
  ) {
  }

  ngAfterViewInit(): void {
    // Aquí puedes verificar si el taskId ya está disponible después de la vista se inicializa
    if (this.taskId) {
      this.innit();
    } else {
      console.error('taskId is undefined in ngAfterViewInit');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica si el taskId ha cambiado y si no es la primera vez que se inicializa
    if (changes['taskId'] && !changes['taskId'].isFirstChange() && this.taskId) {
      this.innit();
    }
  }

  handleSubmit() {
    const data = {
      task_id: this.taskId,
      user_id: this.user.id,
      comment: this.inputValue
    }

    this.commentService.addComment(data)
      .then(() => {
        this.inputValue = '';
        this.getComments()
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  }

  private async getComments() {
    this.loading = true;
    console.log(this.taskId);
    try {
      const data = await this.commentService.getComments(this.taskId);
      this.emitCommentsLength.emit(this.comments.length);
      console.log(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      this.loading = false;
    }
  }

  private innit() {
    this.getComments();
  }

  getDate(created_at: Date) {
    // HH:mm dd/MM/yyyy
    return new Date(created_at).toLocaleString();

  }

  handleDelete(id: string) {
    this.commentService.deleteComment(id)
      .then(() => {
        this.comments = this.comments.filter(comment => comment.id !== id);
      })
      .catch(error => {
        console.error('Error deleting comment:', error);
      });
  }

  handleEdit(id: string) {
    console.log('Edit comment:', id);
  }

  protected readonly confirm = confirm;
}
