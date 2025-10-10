export type RootStackParamList = {
  bottom: undefined;
  Home: undefined;
  ProductDetail: undefined;
  Subscribe: { product: Product };
  Subscribepage: { product: Product };
  CalendarBill: undefined;
  Profile: undefined;
  BuyNow: { product: Product; initialQuantity?: string; subscriptionInfo?: { fromDate: Date; toDate: Date; deliveryTime: string } };
};

export type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string | { uri: string };
  type: string;
  category?: string;
  rating?: number;
};