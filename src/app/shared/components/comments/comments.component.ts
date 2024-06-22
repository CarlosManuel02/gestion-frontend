import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCommentAvatarDirective, NzCommentComponent, NzCommentContentDirective} from "ng-zorro-antd/comment";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzListComponent} from "ng-zorro-antd/list";
import {NzRowDirective} from "ng-zorro-antd/grid";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommentsService} from "../../services/comments.service";
import {UserDisplayComponent} from "../../../protected/components/user-display/user-display.component";

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
    UserDisplayComponent
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements AfterViewInit, OnChanges {

  inputValue: any;
  loading: boolean = false;

  @Input() taskId: string = '';
  @Input() active: boolean = false;

  get comments() {
    return this.commentService.comments;
  }

  constructor(private commentService: CommentsService) {}

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
    console.log(this.active);
  }

  private async getComments() {
    this.loading = true;
    console.log(this.taskId);
    try {
      const data = await this.commentService.getComments(this.taskId);
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
}
