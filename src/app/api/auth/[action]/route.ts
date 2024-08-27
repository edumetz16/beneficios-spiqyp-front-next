import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createSessionCookie, createUserWithValidation, revokeAllSessions } from "@/services/auth/auth.service";
import { ApiResponse } from "@/shared/types.server";
import { UserRecord } from "firebase-admin/auth";

export type CreateUserRequest = {
  name: string,
  email: string,
  password: string,
  role: string,
}
export interface CreateUserResponse extends ApiResponse {
  data?: UserRecord,
}
export interface CreateUserRequestAdditionalValidation extends CreateUserRequest {
  document: string,
  affiliateNumber: string,
}

export async function POST(request: NextRequest,
  { params: {action} }: { params: { action: string }}): Promise<NextResponse<CreateUserResponse>> {
  try {
    
    if (action === 'sign-in') {
      
    }
  
    else if (action === 'create') {
      const createUserRequest = (await request.json()) as CreateUserRequestAdditionalValidation;
      const user = await Create(createUserRequest);
      return NextResponse.json({ success: true, data: user });
    } else {
      
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.cause.code }, {status: 400});
  }
  return NextResponse.json({ success: false, error: "auth/unhandled-error" }, {status: 400});

}

export async function GET(request: NextRequest,
  { params: {action} }: { params: { action: string }}) {
  
}

const Create = async (createUserRequest: CreateUserRequestAdditionalValidation) => {
  
  const user = await createUserWithValidation(createUserRequest);
  if (!user) {
    throw new Error("Error creating user.", {cause: {code: "auth/user-creation-error"}});
  }
  return user;
}

const Read = () => {

}

const Update = () => {

}

const Delete = () => {

}