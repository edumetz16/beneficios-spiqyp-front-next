export type Benefit = {
  id:string;
  title:string;
  description:string;
  startDate:Date;
  endDate:Date;
  termsAndConditions:string;
  redemptionType?: 'link' | 'descriptive' | 'static_code' | 'dynamic_code';
  redemptionValue?:string;
}