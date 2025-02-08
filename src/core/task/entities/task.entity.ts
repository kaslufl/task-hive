export class Task {
  public readonly id: number;
  public readonly title: string;
  public readonly description: string;
  public readonly status: TaskStatus;

  constructor(
    id: number,
    title: string,
    description: string,
    status: TaskStatus,
  ) {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
