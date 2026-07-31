export interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface LikeHistory {
  id: string;
  name: string;
  createdAt: string;
}

export type FeedItem =
  | (Comment & { type: "comment" })
  | (LikeHistory & { type: "like" });
