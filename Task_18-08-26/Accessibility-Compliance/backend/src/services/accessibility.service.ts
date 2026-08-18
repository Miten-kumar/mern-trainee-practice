import { prisma } from "../config/database.js";
import type { AccessibilityPreferences } from "../types/accessibility.types.js";

class AccessibilityService {
  async getPreferences(): Promise<AccessibilityPreferences> {
    let preferences =
      await prisma.accessibilityPreference.findFirst();

    // Create default preferences if none exist
    if (!preferences) {
      preferences = await prisma.accessibilityPreference.create({
        data: {
          highContrast: false,
          reducedMotion: false,
          screenReaderAnnouncements: true,
        },
      });
    }

    return {
      highContrast: preferences.highContrast,
      reducedMotion: preferences.reducedMotion,
      screenReaderAnnouncements:
        preferences.screenReaderAnnouncements,
    };
  }

  async updatePreferences(
    data: AccessibilityPreferences
  ): Promise<AccessibilityPreferences> {
    let preferences =
      await prisma.accessibilityPreference.findFirst();

    if (!preferences) {
      preferences = await prisma.accessibilityPreference.create({
        data,
      });
    } else {
      preferences =
        await prisma.accessibilityPreference.update({
          where: {
            id: preferences.id,
          },
          data,
        });
    }

    return {
      highContrast: preferences.highContrast,
      reducedMotion: preferences.reducedMotion,
      screenReaderAnnouncements:
        preferences.screenReaderAnnouncements,
    };
  }
}

export const accessibilityService =
  new AccessibilityService();