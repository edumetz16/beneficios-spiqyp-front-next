import { NextResponse } from "next/server";
import { db } from "@/services/firestore/firestore";
import sheetsDatabase from "@/services/firestore/sheetsDatabase";
import { User, UserCreateRequest } from "@/services/users/types";
import { mapCustomerUserData } from "@/services/users/users";
import { generateId } from "@/shared/shared.service";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  try {
    // const dbService = new sheetsDatabase();
    // const allRows: any[][] = await dbService.getAllUsers();
    // const headers = allRows[0];
    // const rows = allRows.slice(1);
    // let createdCount = 0;
    // let batchWrites: any[] = [];
    // for (const row of rows) {
    //   const govId = row[3];
    //   if (!govId || /^0+$/.test(govId)) continue;
    //   // Check if user with this govId exists
    //   const existing = await db.collection("users").where("govId", "==", govId).get();
    //   if (!existing.empty && existing.docs[0].data().email !== "") continue;
    //   // Map row to user data
    //   const rowData: any = {};
    //   headers.forEach((header: string, idx: number) => {
    //     rowData[header] = row[idx];
    //   });
    //   const mappedData = await mapCustomerUserData(rowData);
    //   // Parse dob to Date object if present
    //   let dobDate = null;
    //   if (mappedData.dob) {
    //     const [day, month, year] = mappedData.dob.split("/");
    //     if (day && month && year) {
    //       dobDate = new Date(Number(year), Number(month) - 1, Number(day));
    //     }
    //   }
    //   // Set roles based on category
    //   mappedData.roles = ["affiliate"];
    //   if (mappedData.category === "Afiliado") {
    //     mappedData.roles = ["holder", "affiliate"];
    //   }
    //   // Parse active to boolean
    //   let activeBool = false;
    //   if (typeof mappedData.active === "string" && mappedData.active.trim().toLowerCase() === "si") {
    //     activeBool = true;
    //   }
      
    //   const user = new User(mappedData, generateId());
    //   batchWrites.push({
    //     id: user.id,
    //     data: {
    //       ...user,
    //       dob: dobDate,
    //       active: activeBool,
    //       hasAccount: false,
    //     },
    //   });
    //   createdCount++;
    //   // If batch is full, commit and wait
    //   if (batchWrites.length === 500) {
    //     const batch = db.batch();
    //     batchWrites.forEach((w) => {
    //       batch.set(db.collection("users").doc(w.id), w.data);
    //     });
    //     await batch.commit();
    //     batchWrites = [];
    //     console.log(`Committed ${createdCount} users`);
    //   }
    // }
    // // Commit any remaining writes
    // if (batchWrites.length > 0) {
    //   const batch = db.batch();
    //   batchWrites.forEach((w) => {
    //     batch.set(db.collection("users").doc(w.id), w.data);
    //   });
    //   await batch.commit();
    // }
    return NextResponse.json({ success: true, created: 0 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
} 