export interface DecoratorOptions {
  lean?: boolean;
  select?: string;
  populate?: { path: string; select: string };
  orFail?: boolean;
}
