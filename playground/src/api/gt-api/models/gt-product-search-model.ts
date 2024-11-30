export interface GtProductSearchItem {
  ai_score: string;
  brand_name: string;
  cart_qty: string;
  class_name: string;
  current_price: string;
  min_qty: string;
  my_no: string;
  oe: string;
  pic: string;
  product_id: string;
  product_name: string;
  search: string[];
  specification_en: string;
  tag_names: string;
  tags: {
    tag_name: string;
    tag_state: string;
  }[];
  title: string;
  url_txt: string;
  years: string;
}
export interface GtProductSearchModel {
  data: {
    current_page: number;
    last_page: number;
    list: GtProductSearchItem[];
    meta_info: {
      description: string;
      keywords: string;
      title: string;
    };
    per_page: number;
    search_id: number;
    seo_description: string;
    seo_keywords: string;
    seo_title: string;
    total: number;
  };
  msg: string;
  status: number;
}
