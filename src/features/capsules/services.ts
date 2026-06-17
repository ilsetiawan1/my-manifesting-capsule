import { generateAccessKey as generateKey } from "@/lib/nanoid";
import { ClientCapsule, Manifest } from "@/types";

export type VibeCategory = "Career & Study" | "Love & Self" | "Random";

export function generateAccessKey(): string {
  return generateKey();
}

export function sanitizeCapsuleForClient(
  capsule: Omit<Manifest, "messageContent" | "isPrivate" | "isAnonymousTarget"> & {
    messageContent?: string | null;
    ifNotAchieved?: string | null;
    ifAchieved?: string | null;
    isPrivate?: boolean;
    isAnonymousTarget?: boolean;
  }
): ClientCapsule {
  const now = new Date();
  const unlockAt = new Date(capsule.unlockAt);
  const createdAt = new Date(capsule.createdAt);
  const isLocked = now < unlockAt;

  const totalDuration = unlockAt.getTime() - createdAt.getTime();
  const elapsed = now.getTime() - createdAt.getTime();
  
  let progressPercent = 100;
  if (isLocked) {
    if (totalDuration > 0) {
      progressPercent = Math.min(Math.floor((elapsed / totalDuration) * 100), 99);
      if (progressPercent < 0) progressPercent = 0;
    } else {
      progressPercent = 0;
    }
  }

  const daysLeft = isLocked
    ? Math.ceil((unlockAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const vibe = (capsule.vibe as VibeCategory) || "Random";

  return {
    ...capsule,
    messageContent: isLocked ? null : (capsule.messageContent ?? null), // Double protection
    ifNotAchieved: isLocked ? null : (capsule.ifNotAchieved ?? null),
    ifAchieved: isLocked ? null : (capsule.ifAchieved ?? null),
    isPrivate: capsule.isPrivate ?? false,
    isAnonymousTarget: capsule.isAnonymousTarget ?? true,
    isLocked,
    progressPercent,
    daysLeft,
    vibe,
  };
}
