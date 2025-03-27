import { Repository } from 'typeorm';

export abstract class VocaBaseRepository<T> {
  constructor(private readonly repo: Repository<T>) {}
}
