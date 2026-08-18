import { z } from "zod";

export const accessibilityPreferencesSchema = z
  .object({
    highContrast: z.boolean(),
    reducedMotion: z.boolean(),
    screenReaderAnnouncements: z.boolean(),
  })
  .strict();