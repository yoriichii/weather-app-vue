export interface weatherType {
  name?: string;
  sys?: {
    country?: string;
  };
  main?: {
    temp?: number;
    humidity?: number;
  };
  weather?: Array<{
    description?: string;
    main: string;
  }>;
}
