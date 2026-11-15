import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Sentry from "@sentry/node";
import { reportError } from "../utils/reportError.js";

vi.mock("@sentry/node", () => ({
    setTag: vi.fn(),
    captureException: vi.fn(),
}));

describe("reportError", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sets the feature tag and captures the exception when feature is provided", () => {
        const error = new Error("Database failed");

        reportError(error, "books");

        expect(Sentry.setTag).toHaveBeenCalledWith("feature", "books");
        expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it("captures the exception without setting a feature tag when feature is omitted", () => {
        const error = new Error("Unexpected error");

        reportError(error);

        expect(Sentry.setTag).not.toHaveBeenCalled();
        expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });
});
