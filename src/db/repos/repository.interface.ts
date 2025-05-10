export interface Repository {
  exists(id: string): Promise<boolean>;
}
