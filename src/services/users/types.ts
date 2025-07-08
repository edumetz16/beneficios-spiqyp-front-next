import { generateId } from "@/shared/shared.service";

export type UserCreateRequest = {
  email?: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  govId: string;
  phoneNumber?: string;
  affiliateNumber?: string;
  password?: string;
  confirmPassword?: string;
  roles?: string[];
}

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
  govId: string;
  phoneNumber?: string;
  affiliateNumber?: string;
  roles?: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    data: UserCreateRequest,
    id?: string,
  ) {
    if (id) {
      this.id = id;
    } else {
      this.id = generateId();
    }
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.email = data.email || "";
    this.photoURL = data.photoURL || "";
    this.govId = data.govId || "";
    this.phoneNumber = data.phoneNumber || "";
    this.affiliateNumber = data.affiliateNumber || "";
    this.roles = data.roles || [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}