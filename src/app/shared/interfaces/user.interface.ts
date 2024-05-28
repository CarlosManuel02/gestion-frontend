export interface User{
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  image?:    Image;
}

export interface Image {
  image_id:        string;
  user_id:   string;
  data:      Data;
  mime_type: string;
}

export interface Data {
  type: string;
  data: number[];
}

