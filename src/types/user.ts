export type UserType = 'ordinary' | 'pro'

export type User = {
  name: string;
  email: string;
  profilePicture?: string;
  password: string;
  type: UserType;
}

export type WithUserId = {
  userId: string;
}
