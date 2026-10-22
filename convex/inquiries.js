import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addInquiry = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const inquiryId = await ctx.db.insert("inquiries", {
      ...args,
      createdAt: Date.now(),
    });
    return inquiryId;
  },
});

export const listInquiries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("inquiries").order("desc").collect();
  },
});

export const deleteInquiry = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const clearAllInquiries = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("inquiries").collect();
    for (const item of all) {
      await ctx.db.delete(item._id);
    }
  },
});
