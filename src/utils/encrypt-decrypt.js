import { hash, compare } from "bcrypt";

export class Crypto {
  async encrypt(data) {
    return hash(data, 7);
  }
  async  compare(data, hashedData) {
    return compare(data, hashedData);
  }
}
