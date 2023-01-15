import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserAvatar } from './interfaces/user.avatar';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class UserAvatarSubDocument implements UserAvatar {
  @Prop()
  original: string;

  @Prop()
  thumbnail: string;
}

const userAvatarSchema = SchemaFactory.createForClass(UserAvatarSubDocument);

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: userAvatarSchema })
  avatar: UserAvatar;

  /**
   * Check is decrypted password match to encrypted password at a model.
   * See an implementation method below.
   */
  isPasswordValid: (decryptedPassword: string) => Promise<boolean>;
}

export const UsersSchema = SchemaFactory.createForClass(User);

/**
 * Encrypt password during save model.
 */
UsersSchema.pre<UserDocument>('save', async function (next) {
  const user = this as UserDocument;
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

/**
 * Check is decrypted password match to encrypted password at a model.
 * Here is an implementation of the method.
 */
UsersSchema.methods.isPasswordValid = async function (
  decryptedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(decryptedPassword, this.password);
};
