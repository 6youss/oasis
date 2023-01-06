import { ResourcesRepository } from "./resources.repository";

export class ResourcesService {
  constructor(private resourcesRepo: ResourcesRepository) {}
  async getAll() {
    return this.resourcesRepo.getAll();
  }
}
