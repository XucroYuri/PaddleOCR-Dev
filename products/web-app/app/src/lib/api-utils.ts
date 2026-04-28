import { NextResponse } from "next/server";

/**
 * Standard API error response shape (P5.2)
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Creates a standardized JSON error response.
 */
export function apiError(
  code: string,
  message: string,
  status: number,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    error: { code, message },
  };
  if (details !== undefined) {
    body.error.details = details;
  }
  return NextResponse.json(body, { status });
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Session errors
  SESSION_REQUIRED: "SESSION_REQUIRED",
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",

  // Payment errors
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",

  // Task errors
  TASK_NOT_FOUND: "TASK_NOT_FOUND",
  TASK_ACCESS_DENIED: "TASK_ACCESS_DENIED",
  INVALID_STATUS_TRANSITION: "INVALID_STATUS_TRANSITION",

  // Storage errors
  UPLOAD_FAILED: "UPLOAD_FAILED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",

  // OCR errors
  OCR_FAILED: "OCR_FAILED",
  OCR_TIMEOUT: "OCR_TIMEOUT",

  // Server errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
