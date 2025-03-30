import { AggregateRoot } from '@nestjs/cqrs';

export abstract class BaseAggregate extends AggregateRoot {
  private id: number;
  private createdAt: Date;
  constructor({ id, createdAt }: { id: number; createdAt: Date }) {
    super();
    this.id = id;
    this.createdAt = createdAt;
  }

  getId(): number {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
