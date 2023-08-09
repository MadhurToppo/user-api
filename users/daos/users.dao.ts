import shortid from "shortid";
import debug from "debug";
import {CreateUserDto} from "../dto/create.user.dto";
import {PutUserDto} from "../dto/put.user.dto";
import {PatchUserDto} from "../dto/patch.user.dto";
import mongooseService from "../../common/services/mongoose.service";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema({
    _id: String,
    email: String,
    password: {type: String, select: false},
    firstName: String,
    lastName: String,
    permissionFlags: Number,
  }, {id: false});

  User = mongooseService.getMongoose().model('Users', this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUserDto): Promise<string> {
    const userId: string = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return userId;
  }

  async getUsers(limit = 25, page = 0): Promise<any> {
    return this.User.find().limit(limit).skip(limit * page).exec();
  }

  async getUserById(userId: string): Promise<any> {
    return this.User.findOne({_id: userId}).exec();
  }

  async updateUserById(userId: string, userFields: PutUserDto | PatchUserDto): Promise<any> {
    return await this.User.findOneAndUpdate(
      {_id: userId},
      {$set: userFields},
      {new: true}
    ).exec();
  }

  async removeUserById(userId: string): Promise<any> {
    return this.User.deleteOne({_id: userId}).exec();
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.User.findOne({email: email}).exec();
  }
}

export default new UsersDao();
