import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Observable, debounceTime, firstValueFrom, map } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import {
  UploadFile,
  UploadInput,
  UploadOutput,
  UploadStatus,
  UploaderOptions,
} from 'ngx-uploader';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { gfm } from '@milkdown/preset-gfm';
import { menu } from '@milkdown/plugin-menu';
import { nord } from '@milkdown/theme-nord';
import { tokyo } from '@milkdown/theme-tokyo';
import { slash } from '@milkdown/plugin-slash';
import { commonmark } from '@milkdown/preset-commonmark';
import {
  serializerCtx,
  Editor,
  editorViewCtx,
  rootCtx,
  defaultValueCtx,
} from '@milkdown/core';
import { listener, listenerCtx } from '@milkdown/plugin-listener';

import { TagService } from 'src/app/shared/services/tag.service';
import { ThemeService } from 'src/app/theme/theme.service';
import { GroupService } from 'src/app/shared/services/group.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { NotificationService } from 'src/app/notification/notification.service';

import { QueryState } from 'src/app/shared/enums/query-state.enum';
import { Theme } from 'src/app/theme/shared/theme.enum';

import type { Tag } from 'src/app/shared/models/tag.model';
import type { Group } from 'src/app/shared/models/group.model';
import type { SavingReview } from 'src/app/shared/models/review.model';

import type { ReviewDialogData } from '../shared/review-dailog-data.model';

@UntilDestroy()
@Component({
  selector: 'app-create-update-review-modal',
  templateUrl: './create-update-review-modal.component.html',
  styleUrls: ['./create-update-review-modal.component.scss'],
})
export class CreateUpdateReviewModalComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('editorRef') editorRef?: ElementRef;
  editor?: Editor;

  reviewForm = this.formBuilder.nonNullable.group({
    name: [this.data.name ?? '', [Validators.required]],
    group: [this.data.group?.name ?? '', [Validators.required]],
    piece: [this.data.piece?.name ?? '', [Validators.required]],
    grade: [this.data.grade ?? 1],
    content: ['', [Validators.required]],
    tags: this.formBuilder.nonNullable.array(
      [...(this.data.tags?.map((tag) => new FormControl(tag.name)) ?? [])],
      [Validators.required, Validators.minLength(1)]
    ),
    files: this.formBuilder.nonNullable.array(
      [
        ...(this.data.images?.map((image) => new FormControl(image.link)) ??
          []),
      ],
      [Validators.required, Validators.minLength(1)]
    ),
  });

  tagsState = QueryState.Idle;

  tagsInput = new FormControl('');

  tags?: Observable<Tag[]>;
  groups?: Observable<Group[]>;

  uploadInput: EventEmitter<UploadInput>;
  dragOver: boolean = false;
  options: UploaderOptions;
  files: UploadFile[] = [];

  isEdit = this.data.id !== undefined;

  saveReviewState = QueryState.Idle;

  dragFilesHereOr = $localize`Drag files here or`;
  browse = $localize`browse`;
  toUpload = $localize`to upload.`;

  // @HostListener('window:keyup.Enter', ['$event'])
  // onDialogClick(event: KeyboardEvent) {
  //   if (!this.reviewForm.invalid && !(this.isEdit && !this.reviewForm.dirty)) {
  //     this.onConfirmClick();
  //   }
  // }

  constructor(
    private dialogRef: MatDialogRef<CreateUpdateReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private tagService: TagService,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private reviewService: ReviewService
  ) {
    this.options = {
      concurrency: 1,
      maxUploads: 1,
      allowedContentTypes: [
        'image/bmp',
        'image/jpeg',
        'image/x-png',
        'image/png',
        'image/gif',
      ],
    };
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  ngOnInit() {
    this.getGroups();
    this.getTags();
    this.tagsInputFilters();
  }

  ngAfterViewInit() {
    this.createEditor();
  }

  get QueryState() {
    return QueryState;
  }

  async createEditor() {
    const theme = await this.getEditorTheme();
    this.editor = await Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, this.editorRef?.nativeElement);
        ctx.set(defaultValueCtx, this.data.content ?? '');
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
          this.reviewForm.get('content')?.setValue(markdown);
          this.reviewForm.get('content')?.markAsDirty();
        });
      })
      .use(theme)
      .use(commonmark)
      .use(slash)
      .use(menu)
      .use(gfm)
      .use(listener)
      .create();
  }

  async getEditorTheme() {
    const theme = await firstValueFrom(this.themeService.getTheme());
    const editorTheme = {
      [Theme.Dark]: tokyo,
      [Theme.Light]: nord,
    };
    return editorTheme[theme];
  }

  async groupChange(event: MatSelectChange) {
    this.reviewForm.get('group')?.setValue(event.value);
  }

  async getGroupId(gruopName: string) {
    if (this.groups === undefined) {
      return '';
    }
    const groups = await firstValueFrom(this.groups);
    return groups.find(({ name }) => gruopName === name)?.id ?? '';
  }

  get addedTags() {
    return (this.reviewForm.get('tags')?.value ?? []) as string[];
  }

  tagsInputFilters() {
    this.tagsInput.valueChanges
      .pipe(debounceTime(700), untilDestroyed(this))
      .subscribe((value) => {
        if (value === null) {
          return;
        }
        this.tagsState = QueryState.Loading;
        this.getTags(value);
      });
  }

  addTag({ value, chipInput }: MatChipInputEvent) {
    if (value.trim() === '') {
      return;
    }
    this.addTagInForm(value);
    chipInput.clear();
  }

  selectTag({ option }: MatAutocompleteSelectedEvent) {
    this.addTagInForm(option.value);
    this.tagsInput.setValue(null);
  }

  get selectedTags() {
    return this.reviewForm.get('tags') as FormArray;
  }

  addTagInForm(value: string) {
    this.selectedTags.push(new FormControl(value));
    this.makeTagsAsDirty();
  }

  removeTag(tag: string) {
    const tagIndex = this.selectedTags.value.findIndex(
      (selectedTag: string) => selectedTag === tag
    );
    if (tagIndex === -1) return;
    this.selectedTags.removeAt(tagIndex);
    this.makeTagsAsDirty();
  }

  makeTagsAsDirty() {
    this.reviewForm.get('tags')?.markAsDirty();
  }

  uploadActions: Record<UploadOutput['type'], (output: UploadOutput) => void> =
    {
      dragOver: () => {
        this.dragOver = true;
      },
      dragOut: () => {
        this.dragOver = false;
      },
      drop: () => {
        this.dragOver = false;
      },
      addedToQueue: (output: UploadOutput) => {
        const { file } = output;
        if (file === undefined) return;
        this.files.push(file);
      },
      allAddedToQueue: (output: UploadOutput) => {
        const event: UploadInput = {
          type: 'uploadAll',
          url: 'api/images',
          method: 'POST',
        };
        this.uploadInput.emit(event);
      },
      uploading: (output: UploadOutput) => {
        this.updateFile(output.file);
      },
      start: (output: UploadOutput) => {
        this.updateFile(output.file);
      },
      cancelled: (output: UploadOutput) => {
        const { file } = output;
        if (file === undefined) return;
        this.notifyRemoveFile(file.id);
      },
      done: (output: UploadOutput) => {
        this.updateFile(output.file);
        const { uri } = output.file?.response;
        if (typeof uri !== 'string') {
          return;
        }
        this.addedFiles.push(new FormControl(uri));
        this.makeFilesAsDirty();
      },
      removed: (output: UploadOutput) => {
        this.files = this.files.filter((file) => file.id !== output.file?.id);
        this.removeFileFromForm(output.file?.response.uri);
      },
      rejected: (output: UploadOutput) => {
        this.notificationService.error({
          message: $localize`The specified file ${output.file?.name} could not be uploaded.`,
          description: $localize`Only files with the following extensions are allowed: bmp jpeg x-png png gif.`,
        });
      },
      removedAll: () => {
        // TODO: multiply file upload
      },
    };

  get UploadStatus() {
    return UploadStatus;
  }

  updateFile(file?: UploadFile) {
    if (file === undefined) {
      return;
    }
    const index = this.files.findIndex(({ id }) => id === file.id);
    this.files.splice(index, 1, file);
  }

  removeFile(id: string) {
    this.files = this.files.filter((file) => file.id !== id);
  }

  notifyRemoveFile(id: string) {
    this.uploadInput.emit({ type: 'remove', id });
  }

  onUploadOutput(output: UploadOutput) {
    const action = this.uploadActions[output.type];
    action(output);
  }

  onFileDelete(file: Nullable<string>) {
    if (file === null) return;
    this.removeFileFromForm(file);
  }

  onFileCancel(id: string) {
    this.uploadInput.emit({ type: 'cancel', id });
  }

  removeFileFromForm(uri: unknown) {
    if (typeof uri !== 'string') return;
    const fileIndex = this.addedFiles.value.findIndex(
      (addedUri: string) => addedUri === uri
    );
    if (fileIndex === -1) return;
    this.addedFiles.removeAt(fileIndex);
    this.makeFilesAsDirty();
  }

  get addedFiles() {
    return this.reviewForm.get('files') as FormArray;
  }

  makeFilesAsDirty() {
    this.reviewForm.get('files')?.markAsDirty();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async onConfirmClick() {
    if (this.isEdit) {
      this.updateReview();
      return;
    }
    this.saveNewReview();
  }

  async saveNewReview() {
    const formValues = this.reviewForm.value as Required<
      typeof this.reviewForm.value
    >;
    const groupId = await this.getGroupId(formValues.group);
    const review: SavingReview = {
      ...formValues,
      creatorId: this.data.creatorId,
      files: formValues.files.map((file) => String(file)),
      tags: formValues.tags.map((tag) => String(tag)),
      groupId,
    };
    this.saveReviewState = QueryState.Loading;
    this.reviewService
      .create(review)
      .pipe(untilDestroyed(this))
      .subscribe((review) => {
        this.saveReviewState = QueryState.Success;
        this.dialogRef.close(review);
      });
  }

  updateReview() {
    const changedValues = this.getChangedFormValues();
    const { id } = this.data;
    if (id === undefined) return;
    this.saveReviewState = QueryState.Loading;
    this.reviewService
      .update(id, changedValues)
      .pipe(untilDestroyed(this))
      .subscribe((review) => {
        this.saveReviewState = QueryState.Success;
        this.dialogRef.close(review);
      });
  }

  getChangedFormValues() {
    return Object.entries(this.reviewForm.controls).reduce<
      Record<string, string | number | (string | null)[]>
    >((acc, [controlName, control]) => {
      if (control.dirty) {
        acc[controlName] = control.value;
      }
      return acc;
    }, {});
  }

  getGroups() {
    this.groups = this.groupService.getGroups();
  }

  getTags(searchValue?: string) {
    const params = new HttpParams({
      fromObject: { search: searchValue ?? '' },
    });
    this.tags = this.tagService.getTags(params).pipe(
      map((tags) => {
        this.tagsState = QueryState.Success;
        return tags;
      })
    );
  }
}
