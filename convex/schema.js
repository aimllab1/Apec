import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  inquiries: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    cutoff: v.optional(v.union(v.string(), v.number())),
    department: v.optional(v.string()),
    schoolName: v.optional(v.string()),
    board: v.optional(v.string()),
    yearOfPassing: v.optional(v.string()),
    community: v.optional(v.string()),
    marks: v.optional(v.any()),
    eligibleBranches: v.optional(v.any()),
    source: v.optional(v.string()),
    date: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }),

  system_settings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.optional(v.number()),
  }).index("by_key", ["key"]),

  knowledge_base: defineTable({
    docId: v.string(),
    category: v.optional(v.string()),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    updatedAt: v.optional(v.number()),
  }).index("by_docId", ["docId"]),

  tour_config: defineTable({
    key: v.string(),
    mapPoints: v.any(),
    scenes: v.any(),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.string()),
  }).index("by_key", ["key"]),

  users: defineTable({
    username: v.string(),
    email: v.optional(v.string()),
    passwordHash: v.string(),
    role: v.string(),
    createdAt: v.optional(v.number()),
    lastLogin: v.optional(v.number()),
  }).index("by_username", ["username"]),

  files: defineTable({
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    uploadedAt: v.number(),
  }),
});
