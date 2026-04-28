import {
  pgTable,
  text,
  timestamp,
  decimal,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Enums

export const sessionStatusEnum = pgEnum("session_status", [
  "active",
  "expired",
  "locked",
]);

export const paymentOrderStatusEnum = pgEnum("payment_order_status", [
  "created",
  "pending_payment",
  "paid",
  "credited",
  "failed",
  "expired",
  "refunded",
]);

export const paymentOrderTypeEnum = pgEnum("payment_order_type", [
  "topup",
  "task_charge",
]);

export const ledgerDirectionEnum = pgEnum("ledger_direction", [
  "credit",
  "debit",
  "refund",
]);

export const ledgerReasonEnum = pgEnum("ledger_reason", [
  "topup",
  "task_run",
  "compensation",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "created",
  "awaiting_payment",
  "paid",
  "queued",
  "ocr_processing",
  "word_rendering",
  "completed",
  "failed",
  "expired",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "exam",
  "handout",
  "homework",
]);

// Tables

export const anonymousSessions = pgTable(
  "anonymous_sessions",
  {
    anonymousSessionId: text("anonymous_session_id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    walletBalance: decimal("wallet_balance", { precision: 12, scale: 2 })
      .notNull()
      .default("0.00"),
    status: sessionStatusEnum("status").notNull().default("active"),
  },
  (table) => [index("idx_anonymous_sessions_expires_at").on(table.expiresAt)]
);

export const paymentOrders = pgTable(
  "payment_orders",
  {
    paymentOrderId: text("payment_order_id").primaryKey(),
    anonymousSessionId: text("anonymous_session_id")
      .notNull()
      .references(() => anonymousSessions.anonymousSessionId, {
        onDelete: "cascade",
      }),
    orderType: paymentOrderTypeEnum("order_type").notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    status: paymentOrderStatusEnum("status").notNull().default("created"),
    idempotencyKey: text("idempotency_key"),
    providerTxnId: text("provider_txn_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => [
    uniqueIndex("idx_payment_orders_idempotency_key").on(table.idempotencyKey),
    index("idx_payment_orders_session_id").on(table.anonymousSessionId),
    index("idx_payment_orders_provider_txn_id").on(table.providerTxnId),
  ]
);

export const walletLedgers = pgTable(
  "wallet_ledgers",
  {
    ledgerId: text("ledger_id").primaryKey(),
    anonymousSessionId: text("anonymous_session_id")
      .notNull()
      .references(() => anonymousSessions.anonymousSessionId, {
        onDelete: "cascade",
      }),
    paymentOrderId: text("payment_order_id").references(
      () => paymentOrders.paymentOrderId,
      { onDelete: "set null" }
    ),
    direction: ledgerDirectionEnum("direction").notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    reason: ledgerReasonEnum("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_wallet_ledgers_session_id").on(table.anonymousSessionId),
    uniqueIndex("idx_wallet_ledgers_unique_entry").on(
      table.paymentOrderId,
      table.direction,
      table.reason
    ),
  ]
);

export const processingTasks = pgTable(
  "processing_tasks",
  {
    taskId: text("task_id").primaryKey(),
    anonymousSessionId: text("anonymous_session_id")
      .notNull()
      .references(() => anonymousSessions.anonymousSessionId, {
        onDelete: "cascade",
      }),
    paymentOrderId: text("payment_order_id").references(
      () => paymentOrders.paymentOrderId,
      { onDelete: "set null" }
    ),
    sourceFileKey: text("source_file_key").notNull(),
    documentType: documentTypeEnum("document_type").notNull(),
    templateId: text("template_id"),
    status: taskStatusEnum("status").notNull().default("created"),
    ocrJobId: text("ocr_job_id"),
    outputDocxKey: text("output_docx_key"),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => [
    index("idx_processing_tasks_session_created").on(
      table.anonymousSessionId,
      table.createdAt
    ),
    index("idx_processing_tasks_status_created").on(
      table.status,
      table.createdAt
    ),
  ]
);

export const ocrArtifacts = pgTable(
  "ocr_artifacts",
  {
    artifactId: text("artifact_id").primaryKey(),
    taskId: text("task_id")
      .notNull()
      .references(() => processingTasks.taskId, { onDelete: "cascade" }),
    markdownText: text("markdown_text"),
    structuredJsonKey: text("structured_json_key"),
    assetManifestKey: text("asset_manifest_key"),
    ttlExpiresAt: timestamp("ttl_expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_ocr_artifacts_task_id").on(table.taskId)]
);

export const downloadGrants = pgTable(
  "download_grants",
  {
    grantId: text("grant_id").primaryKey(),
    anonymousSessionId: text("anonymous_session_id")
      .notNull()
      .references(() => anonymousSessions.anonymousSessionId, {
        onDelete: "cascade",
      }),
    taskId: text("task_id")
      .notNull()
      .references(() => processingTasks.taskId, { onDelete: "cascade" }),
    fileKey: text("file_key").notNull(),
    signedUrl: text("signed_url"),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_download_grants_session_id").on(table.anonymousSessionId),
    index("idx_download_grants_task_id").on(table.taskId),
  ]
);

// Type exports
export type AnonymousSession = typeof anonymousSessions.$inferSelect;
export type NewAnonymousSession = typeof anonymousSessions.$inferInsert;
export type PaymentOrder = typeof paymentOrders.$inferSelect;
export type NewPaymentOrder = typeof paymentOrders.$inferInsert;
export type WalletLedger = typeof walletLedgers.$inferSelect;
export type NewWalletLedger = typeof walletLedgers.$inferInsert;
export type ProcessingTask = typeof processingTasks.$inferSelect;
export type NewProcessingTask = typeof processingTasks.$inferInsert;
export type OcrArtifact = typeof ocrArtifacts.$inferSelect;
export type NewOcrArtifact = typeof ocrArtifacts.$inferInsert;
export type DownloadGrant = typeof downloadGrants.$inferSelect;
export type NewDownloadGrant = typeof downloadGrants.$inferInsert;
