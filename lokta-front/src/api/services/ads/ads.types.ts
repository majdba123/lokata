export type AdsElement = {
  status: "pending" | "completed" | "rejected";
  id: number;
  img: string;
  link: string;
  type: AdsType;
};

export type AdsType = "internal" | "external";

export type AdsPlanElement = {
  title: string;
  level: number;
  discription: string;
  count_month: number;
  price: number;
  updated_at: string;
  created_at: string;
  id: number;
};
