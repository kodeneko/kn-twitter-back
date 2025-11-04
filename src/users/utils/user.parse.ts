import { UserSkipRes } from '../model/user-skip-res.model';
import { UserDocument } from '../schemas/user.schema';

function userDocuToUserSkipParser(user: UserDocument): UserSkipRes {
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    twitterId: user.twitter.id,
  };
}

export { userDocuToUserSkipParser };
