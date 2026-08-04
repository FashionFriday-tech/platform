export class CreateBrandDto {
  name = '';
  slug = '';
  logo?: string;
  color = '';
  categories: string[] = [];
  isActive?: boolean = true;
}
