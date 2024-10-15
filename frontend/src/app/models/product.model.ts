export interface Product {
    created_at: string | number | Date;
    category_name: any;
    image: any;
    id?: number;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id?: number;
  }