// lib/auth.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import UserRole from "@/lib/prisma";

/**
 * Returns the full user from the database using the session email.
 * This is safe to use in server components and route handlers.
 */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      company: true,
    },
  });

  return user;
}

/**
 * EMS superusers — isGlobalAdmin === true
 */
export function isEmsAdmin(user: any): boolean {
  return user?.isGlobalAdmin === true;
}

/**
 * Company admins — assigned COMPANY_ADMIN role within their company
 */
export function isCompanyAdmin(user: any): boolean {
  return (
    user?.role === UserRole.COMPANY_ADMIN && !!user?.companyId && !user?.isGlobalAdmin
  );
}

/**
 * Regular company user — default role within a company
 */
export function isCompanyUser(user: any): boolean {
  return (
    user?.role === UserRole.COMPANY_USER && !!user?.companyId && !user?.isGlobalAdmin
  );
}

/**
 * Check if user belongs to a specific company
 */
export function isUserInCompany(user: any, companyId: string): boolean {
  return user?.companyId === companyId;
}