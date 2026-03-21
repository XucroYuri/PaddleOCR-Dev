import { describe, expect, test } from "vitest";

import { primaryNavigation } from "@/lib/navigation";

describe("primary navigation", () => {
  test("exposes the four v0 pages from the PRD", () => {
    expect(primaryNavigation).toEqual([
      { href: "/", label: "首页" },
      { href: "/upload", label: "上传资料" },
      { href: "/wallet", label: "充值付款" },
      { href: "/tasks", label: "任务中心" },
    ]);
  });
});
