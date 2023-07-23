import type { Prisma } from "@prisma/client";
import { z } from "zod";

// ///////////////////////////////////////
// HELPER FUNCTIONS
// ///////////////////////////////////////

// DECIMAL
// ------------------------------------------------------

export const DecimalJSLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function().args().returns(z.string())
});

export const DecimalJSLikeListSchema: z.ZodType<Prisma.DecimalJsLike[]> = z
  .object({
    d: z.array(z.number()),
    e: z.number(),
    s: z.number(),
    toFixed: z.function().args().returns(z.string())
  })
  .array();

export const DECIMAL_STRING_REGEX = /^[0-9.,e+-bxffo_cp]+$|Infinity|NaN/;

export const isValidDecimalInput = (
  v?: null | string | number | Prisma.DecimalJsLike
): v is string | number | Prisma.DecimalJsLike => {
  if (v === undefined || v === null) {return false;}
  return (
    (typeof v === "object" && "d" in v && "e" in v && "s" in v && "toFixed" in v)
    || (typeof v === "string" && DECIMAL_STRING_REGEX.test(v))
    || typeof v === "number"
  );
};

// ///////////////////////////////////////
// ENUMS
// ///////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable"
]);

export const GameScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "teamCap",
  "lineupCap",
  "logoUrl",
  "coverUrl",
  "isActive",
  "desc"
]);

export const NotifUserRoomRegistrationScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "roomId",
  "latestMessage",
  "unreadCount",
  "lastSeenAt"
]);

export const NotificationScalarFieldEnumSchema = z.enum([
  "id",
  "collectionId",
  "source",
  "title",
  "message",
  "senderUserId",
  "senderTeamId",
  "seenAt",
  "createdAt"
]);

export const NotificationActionScalarFieldEnumSchema = z.enum([
  "id",
  "notificationId",
  "response",
  "teamPendingId",
  "roomPendingId",
  "appointmentPendingId",
  "updatedAt"
]);

export const NotificationCollectionScalarFieldEnumSchema = z.enum([ "id", "userId" ]);

export const RoomScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "status",
  "option",
  "startAt",
  "endAt",
  "isPrivate",
  "teamCount",
  "note",
  "gameId",
  "hostTeamId",
  "updatedAt",
  "createdAt"
]);

export const RoomSettingsScalarFieldEnumSchema = z.enum([ "id", "roomId" ]);

export const RoomMemberScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "roomId",
  "joinedAt"
]);

export const RoomLineupScalarFieldEnumSchema = z.enum([
  "id",
  "teamLineupId",
  "roomMemberId",
  "roomId"
]);

export const RoomPendingScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "roomId",
  "status",
  "createdAt"
]);

export const RoomPendingLineupScalarFieldEnumSchema = z.enum([
  "id",
  "roomPendingId",
  "teamLineupId"
]);

export const TeamScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "coverUrl",
  "logoUrl",
  "tier",
  "isPrivate",
  "bookBank",
  "gameId",
  "founderId",
  "designatorTeamId",
  "isDeleted",
  "createdAt"
]);

export const TeamSettingsScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "isJoiningEnabled"
]);

export const TeamMemberScalarFieldEnumSchema = z.enum([
  "id",
  "role",
  "teamId",
  "userId",
  "joinedAt"
]);

export const TeamLineupScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "avatarId",
  "inGameId",
  "isDefault",
  "profileUrl",
  "imageUrl",
  "name",
  "note",
  "updatedAt",
  "createdAt"
]);

export const TeamPendingScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "userId",
  "status",
  "createdAt"
]);

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "username",
  "updatedUsernameAt",
  "mobilePhone",
  "updatedMobilePhoneAt",
  "password",
  "displayName",
  "email",
  "updatedEmailAt",
  "bio",
  "portraitUrl",
  "coverUrl",
  "isVerified",
  "isDeactivated",
  "facebookId",
  "googleId",
  "lineId",
  "lineToken",
  "firstLoginAt",
  "lastLoginAt",
  "createdAt",
  "updatedAt"
]);

export const UserSettingsScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "isNotifiedBeforeTrainingMinute",
  "isTeamNotified",
  "isMeNotified",
  "isRoomNotified",
  "lang"
]);

export const PasswordResetSessionScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "token",
  "attemptCount",
  "expiredAt",
  "updatedAt",
  "createdAt"
]);

export const UserAvatarScalarFieldEnumSchema = z.enum([
  "id",
  "inGameId",
  "characterName",
  "rank",
  "ratingScore",
  "gameId",
  "userId"
]);

export const ReviewScalarFieldEnumSchema = z.enum([
  "id",
  "content",
  "ratingScore",
  "reviewerId",
  "revieweeId",
  "gameId",
  "createdAt"
]);

export const AppointmentScalarFieldEnumSchema = z.enum([
  "id",
  "startAt",
  "endAt",
  "deletedBeforeAt",
  "isDeleted",
  "roomId",
  "createdAt"
]);

export const AppointmentPendingScalarFieldEnumSchema = z.enum([
  "id",
  "appointmentId",
  "inviterTeamId",
  "inviteeTeamId",
  "createdAt"
]);

export const AppointmentMemberScalarFieldEnumSchema = z.enum([
  "id",
  "appointmentId",
  "teamId",
  "isLeft",
  "createdAt"
]);

export const ChatScalarFieldEnumSchema = z.enum([ "id", "roomId" ]);

export const MessageScalarFieldEnumSchema = z.enum([
  "id",
  "chatId",
  "replyId",
  "imageUrls",
  "teamId",
  "senderId",
  "message",
  "createdAt"
]);

export const TeamStatsScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "leftWhileTrainingCount",
  "completedTrainingCount",
  "trainingMinute",
  "trainingCount",
  "winCount",
  "loseCount",
  "tieCount",
  "perGameWinCount",
  "perGameLoseCount",
  "updateAt"
]);

export const TrainingScalarFieldEnumSchema = z.enum([
  "id",
  "appointmentId",
  "hostId",
  "guestId",
  "hostWinCount",
  "hostLoseCount",
  "note",
  "status",
  "source",
  "imageUrls",
  "isSubmitted",
  "updatedAt",
  "createdAt"
]);

export const TrainingLineupScalarFieldEnumSchema = z.enum([ "id", "trainingId", "lineupId" ]);

export const TrainingReportScalarFieldEnumSchema = z.enum([
  "id",
  "reporterUserId",
  "reporterTeamId",
  "trainingId",
  "isAdminReviewed",
  "heading",
  "content",
  "imageUrls",
  "createdAt"
]);

export const AdminScalarFieldEnumSchema = z.enum([
  "id",
  "email",
  "password",
  "role",
  "createdAt",
  "updateAt"
]);

export const SortOrderSchema = z.enum([ "asc", "desc" ]);

export const QueryModeSchema = z.enum([ "default", "insensitive" ]);

export const NullsOrderSchema = z.enum([ "first", "last" ]);

export const LangSchema = z.enum([ "TH", "EN" ]);

export type LangType = `${z.infer<typeof LangSchema>}`;

export const RoomStatusSchema = z.enum([ "AVAILABLE", "UNAVAILABLE", "CONFIRMED", "FULL" ]);

export type RoomStatusType = `${z.infer<typeof RoomStatusSchema>}`;

export const MemberRoleSchema = z.enum([ "HEAD_COACH", "LEADER", "MANAGER", "MEMBER" ]);

export type MemberRoleType = `${z.infer<typeof MemberRoleSchema>}`;

export const TrainingStatusSchema = z.enum([
  "ACCEPTED",
  "DENIED",
  "INEFFECTIVE",
  "EXPIRED",
  "UNREVIEWED"
]);

export type TrainingStatusType = `${z.infer<typeof TrainingStatusSchema>}`;

export const TrainingSourceSchema = z.enum([ "SYSTEM", "ADMIN", "USER" ]);

export type TrainingSourceType = `${z.infer<typeof TrainingSourceSchema>}`;

export const PendingStatusSchema = z.enum([ "INCOMING", "OUTGOING" ]);

export type PendingStatusType = `${z.infer<typeof PendingStatusSchema>}`;

export const AdminRoleSchema = z.enum([ "MANAGEMENT" ]);

export type AdminRoleType = `${z.infer<typeof AdminRoleSchema>}`;

export const NotificationSourceSchema = z.enum([ "SYSTEM", "USER" ]);

export type NotificationSourceType = `${z.infer<typeof NotificationSourceSchema>}`;

export const NotificationActionResponseSchema = z.enum([ "ACCEPTED", "DENIED" ]);

export type NotificationActionResponseType = `${z.infer<
  typeof NotificationActionResponseSchema
>}`;

// ///////////////////////////////////////
// MODELS
// ///////////////////////////////////////

// ///////////////////////////////////////
// GAME SCHEMA
// ///////////////////////////////////////

export const GameSchema = z.object({
  id: z.string(),
  name: z.string(),
  teamCap: z.number().int(),
  lineupCap: z.number().int(),
  logoUrl: z.string(),
  coverUrl: z.string(),
  isActive: z.boolean(),
  desc: z.string()
});

export type Game = z.infer<typeof GameSchema>;

// ///////////////////////////////////////
// GAME PARTIAL SCHEMA
// ///////////////////////////////////////

export const GamePartialSchema = GameSchema.partial();

export type GamePartial = z.infer<typeof GamePartialSchema>;

// GAME OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const GameOptionalDefaultsSchema = GameSchema.merge(
  z.object({
    isActive: z.boolean().optional(),
    desc: z.string().optional()
  })
);

export type GameOptionalDefaults = z.infer<typeof GameOptionalDefaultsSchema>;

// ///////////////////////////////////////
// NOTIF USER ROOM REGISTRATION SCHEMA
// ///////////////////////////////////////

export const NotifUserRoomRegistrationSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  roomId: z.string(),
  latestMessage: z.string(),
  unreadCount: z.number().int(),
  lastSeenAt: z.coerce.date()
});

export type NotifUserRoomRegistration = z.infer<typeof NotifUserRoomRegistrationSchema>;

// ///////////////////////////////////////
// NOTIF USER ROOM REGISTRATION PARTIAL SCHEMA
// ///////////////////////////////////////

export const NotifUserRoomRegistrationPartialSchema
  = NotifUserRoomRegistrationSchema.partial();

export type NotifUserRoomRegistrationPartial = z.infer<
  typeof NotifUserRoomRegistrationPartialSchema
>;

// NOTIF USER ROOM REGISTRATION OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const NotifUserRoomRegistrationOptionalDefaultsSchema
  = NotifUserRoomRegistrationSchema.merge(
    z.object({
      id: z.string().cuid().optional(),
      latestMessage: z.string().optional(),
      unreadCount: z.number().int().optional(),
      lastSeenAt: z.coerce.date().optional()
    })
  );

export type NotifUserRoomRegistrationOptionalDefaults = z.infer<
  typeof NotifUserRoomRegistrationOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// NOTIFICATION SCHEMA
// ///////////////////////////////////////

export const NotificationSchema = z.object({
  source: NotificationSourceSchema,
  id: z.string().cuid(),
  collectionId: z.string(),
  title: z.string(),
  message: z.string(),
  senderUserId: z.string().nullish(),
  senderTeamId: z.string().nullish(),
  seenAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date()
});

export type Notification = z.infer<typeof NotificationSchema>;

// ///////////////////////////////////////
// NOTIFICATION PARTIAL SCHEMA
// ///////////////////////////////////////

export const NotificationPartialSchema = NotificationSchema.partial();

export type NotificationPartial = z.infer<typeof NotificationPartialSchema>;

// NOTIFICATION OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const NotificationOptionalDefaultsSchema = NotificationSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type NotificationOptionalDefaults = z.infer<
  typeof NotificationOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// NOTIFICATION ACTION SCHEMA
// ///////////////////////////////////////

export const NotificationActionSchema = z.object({
  response: NotificationActionResponseSchema.nullish(),
  id: z.string().cuid(),
  notificationId: z.string(),
  teamPendingId: z.string().nullish(),
  roomPendingId: z.string().nullish(),
  appointmentPendingId: z.string().nullish(),
  updatedAt: z.coerce.date()
});

export type NotificationAction = z.infer<typeof NotificationActionSchema>;

// ///////////////////////////////////////
// NOTIFICATION ACTION PARTIAL SCHEMA
// ///////////////////////////////////////

export const NotificationActionPartialSchema = NotificationActionSchema.partial();

export type NotificationActionPartial = z.infer<typeof NotificationActionPartialSchema>;

// NOTIFICATION ACTION OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const NotificationActionOptionalDefaultsSchema = NotificationActionSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    updatedAt: z.coerce.date().optional()
  })
);

export type NotificationActionOptionalDefaults = z.infer<
  typeof NotificationActionOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// NOTIFICATION COLLECTION SCHEMA
// ///////////////////////////////////////

export const NotificationCollectionSchema = z.object({
  id: z.string().cuid(),
  userId: z.string()
});

export type NotificationCollection = z.infer<typeof NotificationCollectionSchema>;

// ///////////////////////////////////////
// NOTIFICATION COLLECTION PARTIAL SCHEMA
// ///////////////////////////////////////

export const NotificationCollectionPartialSchema = NotificationCollectionSchema.partial();

export type NotificationCollectionPartial = z.infer<
  typeof NotificationCollectionPartialSchema
>;

// NOTIFICATION COLLECTION OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const NotificationCollectionOptionalDefaultsSchema
  = NotificationCollectionSchema.merge(
    z.object({
      id: z.string().cuid().optional()
    })
  );

export type NotificationCollectionOptionalDefaults = z.infer<
  typeof NotificationCollectionOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// ROOM SCHEMA
// ///////////////////////////////////////

export const RoomSchema = z.object({
  status: RoomStatusSchema,
  id: z.string().cuid(),
  name: z.string(),
  option: z.string(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  isPrivate: z.boolean(),
  teamCount: z.number().int(),
  note: z.string(),
  gameId: z.string(),
  hostTeamId: z.string(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export type Room = z.infer<typeof RoomSchema>;

// ///////////////////////////////////////
// ROOM PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomPartialSchema = RoomSchema.partial();

export type RoomPartial = z.infer<typeof RoomPartialSchema>;

// ROOM OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const RoomOptionalDefaultsSchema = RoomSchema.merge(
  z.object({
    status: RoomStatusSchema.optional(),
    id: z.string().cuid().optional(),
    option: z.string().optional(),
    isPrivate: z.boolean().optional(),
    teamCount: z.number().int().optional(),
    note: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type RoomOptionalDefaults = z.infer<typeof RoomOptionalDefaultsSchema>;

// ///////////////////////////////////////
// ROOM SETTINGS SCHEMA
// ///////////////////////////////////////

export const RoomSettingsSchema = z.object({
  id: z.string().cuid(),
  roomId: z.string()
});

export type RoomSettings = z.infer<typeof RoomSettingsSchema>;

// ///////////////////////////////////////
// ROOM SETTINGS PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomSettingsPartialSchema = RoomSettingsSchema.partial();

export type RoomSettingsPartial = z.infer<typeof RoomSettingsPartialSchema>;

// ROOM SETTINGS OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const RoomSettingsOptionalDefaultsSchema = RoomSettingsSchema.merge(
  z.object({
    id: z.string().cuid().optional()
  })
);

export type RoomSettingsOptionalDefaults = z.infer<
  typeof RoomSettingsOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// ROOM MEMBER SCHEMA
// ///////////////////////////////////////

export const RoomMemberSchema = z.object({
  id: z.string().cuid(),
  teamId: z.string(),
  roomId: z.string(),
  joinedAt: z.coerce.date()
});

export type RoomMember = z.infer<typeof RoomMemberSchema>;

// ///////////////////////////////////////
// ROOM MEMBER PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomMemberPartialSchema = RoomMemberSchema.partial();

export type RoomMemberPartial = z.infer<typeof RoomMemberPartialSchema>;

// ROOM MEMBER OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const RoomMemberOptionalDefaultsSchema = RoomMemberSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    joinedAt: z.coerce.date().optional()
  })
);

export type RoomMemberOptionalDefaults = z.infer<typeof RoomMemberOptionalDefaultsSchema>;

// ///////////////////////////////////////
// ROOM LINEUP SCHEMA
// ///////////////////////////////////////

export const RoomLineupSchema = z.object({
  id: z.string().cuid(),
  teamLineupId: z.string(),
  roomMemberId: z.string(),
  roomId: z.string()
});

export type RoomLineup = z.infer<typeof RoomLineupSchema>;

// ///////////////////////////////////////
// ROOM LINEUP PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomLineupPartialSchema = RoomLineupSchema.partial();

export type RoomLineupPartial = z.infer<typeof RoomLineupPartialSchema>;

// ROOM LINEUP OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const RoomLineupOptionalDefaultsSchema = RoomLineupSchema.merge(
  z.object({
    id: z.string().cuid().optional()
  })
);

export type RoomLineupOptionalDefaults = z.infer<typeof RoomLineupOptionalDefaultsSchema>;

// ///////////////////////////////////////
// ROOM PENDING SCHEMA
// ///////////////////////////////////////

export const RoomPendingSchema = z.object({
  status: PendingStatusSchema,
  id: z.string().cuid(),
  teamId: z.string(),
  roomId: z.string(),
  createdAt: z.coerce.date()
});

export type RoomPending = z.infer<typeof RoomPendingSchema>;

// ///////////////////////////////////////
// ROOM PENDING PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomPendingPartialSchema = RoomPendingSchema.partial();

export type RoomPendingPartial = z.infer<typeof RoomPendingPartialSchema>;

// ROOM PENDING OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const RoomPendingOptionalDefaultsSchema = RoomPendingSchema.merge(
  z.object({
    status: PendingStatusSchema.optional(),
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type RoomPendingOptionalDefaults = z.infer<typeof RoomPendingOptionalDefaultsSchema>;

// ///////////////////////////////////////
// ROOM PENDING LINEUP SCHEMA
// ///////////////////////////////////////

export const RoomPendingLineupSchema = z.object({
  id: z.string().cuid(),
  roomPendingId: z.string(),
  teamLineupId: z.string()
});

export type RoomPendingLineup = z.infer<typeof RoomPendingLineupSchema>;

// ///////////////////////////////////////
// ROOM PENDING LINEUP PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomPendingLineupPartialSchema = RoomPendingLineupSchema.partial();

export type RoomPendingLineupPartial = z.infer<typeof RoomPendingLineupPartialSchema>;

// ROOM PENDING LINEUP OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const RoomPendingLineupOptionalDefaultsSchema = RoomPendingLineupSchema.merge(
  z.object({
    id: z.string().cuid().optional()
  })
);

export type RoomPendingLineupOptionalDefaults = z.infer<
  typeof RoomPendingLineupOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// TEAM SCHEMA
// ///////////////////////////////////////

export const TeamSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  coverUrl: z.string(),
  logoUrl: z.string(),
  tier: z.string(),
  isPrivate: z.boolean(),
  bookBank: z.string(),
  gameId: z.string(),
  founderId: z.string().nullish(),
  designatorTeamId: z.string().nullish(),
  isDeleted: z.boolean(),
  createdAt: z.coerce.date()
});

export type Team = z.infer<typeof TeamSchema>;

// ///////////////////////////////////////
// TEAM PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamPartialSchema = TeamSchema.partial();

export type TeamPartial = z.infer<typeof TeamPartialSchema>;

// TEAM OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TeamOptionalDefaultsSchema = TeamSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    coverUrl: z.string().optional(),
    logoUrl: z.string().optional(),
    tier: z.string().optional(),
    isPrivate: z.boolean().optional(),
    bookBank: z.string().optional(),
    isDeleted: z.boolean().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type TeamOptionalDefaults = z.infer<typeof TeamOptionalDefaultsSchema>;

// ///////////////////////////////////////
// TEAM SETTINGS SCHEMA
// ///////////////////////////////////////

export const TeamSettingsSchema = z.object({
  id: z.string().cuid(),
  teamId: z.string(),
  isJoiningEnabled: z.boolean()
});

export type TeamSettings = z.infer<typeof TeamSettingsSchema>;

// ///////////////////////////////////////
// TEAM SETTINGS PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamSettingsPartialSchema = TeamSettingsSchema.partial();

export type TeamSettingsPartial = z.infer<typeof TeamSettingsPartialSchema>;

// TEAM SETTINGS OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TeamSettingsOptionalDefaultsSchema = TeamSettingsSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    isJoiningEnabled: z.boolean().optional()
  })
);

export type TeamSettingsOptionalDefaults = z.infer<
  typeof TeamSettingsOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// TEAM MEMBER SCHEMA
// ///////////////////////////////////////

export const TeamMemberSchema = z.object({
  role: MemberRoleSchema,
  id: z.string().cuid(),
  teamId: z.string(),
  userId: z.string(),
  joinedAt: z.coerce.date()
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

// ///////////////////////////////////////
// TEAM MEMBER PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamMemberPartialSchema = TeamMemberSchema.partial();

export type TeamMemberPartial = z.infer<typeof TeamMemberPartialSchema>;

// TEAM MEMBER OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TeamMemberOptionalDefaultsSchema = TeamMemberSchema.merge(
  z.object({
    role: MemberRoleSchema.optional(),
    id: z.string().cuid().optional(),
    joinedAt: z.coerce.date().optional()
  })
);

export type TeamMemberOptionalDefaults = z.infer<typeof TeamMemberOptionalDefaultsSchema>;

// ///////////////////////////////////////
// TEAM LINEUP SCHEMA
// ///////////////////////////////////////

export const TeamLineupSchema = z.object({
  id: z.string().cuid(),
  teamId: z.string(),
  avatarId: z.string().nullish(),
  inGameId: z.string().nullish(),
  isDefault: z.boolean(),
  profileUrl: z.string(),
  imageUrl: z.string(),
  name: z.string(),
  note: z.string(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export type TeamLineup = z.infer<typeof TeamLineupSchema>;

// ///////////////////////////////////////
// TEAM LINEUP PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamLineupPartialSchema = TeamLineupSchema.partial();

export type TeamLineupPartial = z.infer<typeof TeamLineupPartialSchema>;

// TEAM LINEUP OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TeamLineupOptionalDefaultsSchema = TeamLineupSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    isDefault: z.boolean().optional(),
    profileUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    name: z.string().optional(),
    note: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type TeamLineupOptionalDefaults = z.infer<typeof TeamLineupOptionalDefaultsSchema>;

// ///////////////////////////////////////
// TEAM PENDING SCHEMA
// ///////////////////////////////////////

export const TeamPendingSchema = z.object({
  status: PendingStatusSchema,
  id: z.string().cuid(),
  teamId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date()
});

export type TeamPending = z.infer<typeof TeamPendingSchema>;

// ///////////////////////////////////////
// TEAM PENDING PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamPendingPartialSchema = TeamPendingSchema.partial();

export type TeamPendingPartial = z.infer<typeof TeamPendingPartialSchema>;

// TEAM PENDING OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TeamPendingOptionalDefaultsSchema = TeamPendingSchema.merge(
  z.object({
    status: PendingStatusSchema.optional(),
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type TeamPendingOptionalDefaults = z.infer<typeof TeamPendingOptionalDefaultsSchema>;

// ///////////////////////////////////////
// USER SCHEMA
// ///////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  username: z.string(),
  updatedUsernameAt: z.coerce.date().nullish(),
  mobilePhone: z.string(),
  updatedMobilePhoneAt: z.coerce.date().nullish(),
  password: z.string(),
  displayName: z.string(),
  email: z.string().email().nullish(),
  updatedEmailAt: z.coerce.date().nullish(),
  bio: z.string(),
  portraitUrl: z.string(),
  coverUrl: z.string(),
  isVerified: z.boolean(),
  isDeactivated: z.boolean(),
  facebookId: z.string().nullish(),
  googleId: z.string().nullish(),
  lineId: z.string().nullish(),
  lineToken: z.string().nullish(),
  firstLoginAt: z.coerce.date().nullish(),
  lastLoginAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export type User = z.infer<typeof UserSchema>;

// ///////////////////////////////////////
// USER PARTIAL SCHEMA
// ///////////////////////////////////////

export const UserPartialSchema = UserSchema.partial();

export type UserPartial = z.infer<typeof UserPartialSchema>;

// USER OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    bio: z.string().optional(),
    portraitUrl: z.string().optional(),
    coverUrl: z.string().optional(),
    isVerified: z.boolean().optional(),
    isDeactivated: z.boolean().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional()
  })
);

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>;

// ///////////////////////////////////////
// USER SETTINGS SCHEMA
// ///////////////////////////////////////

export const UserSettingsSchema = z.object({
  lang: LangSchema,
  id: z.string().cuid(),
  userId: z.string(),
  isNotifiedBeforeTrainingMinute: z.number().int(),
  isTeamNotified: z.boolean(),
  isMeNotified: z.boolean(),
  isRoomNotified: z.boolean()
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

// ///////////////////////////////////////
// USER SETTINGS PARTIAL SCHEMA
// ///////////////////////////////////////

export const UserSettingsPartialSchema = UserSettingsSchema.partial();

export type UserSettingsPartial = z.infer<typeof UserSettingsPartialSchema>;

// USER SETTINGS OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const UserSettingsOptionalDefaultsSchema = UserSettingsSchema.merge(
  z.object({
    lang: LangSchema.optional(),
    id: z.string().cuid().optional(),
    isNotifiedBeforeTrainingMinute: z.number().int().optional(),
    isTeamNotified: z.boolean().optional(),
    isMeNotified: z.boolean().optional(),
    isRoomNotified: z.boolean().optional()
  })
);

export type UserSettingsOptionalDefaults = z.infer<
  typeof UserSettingsOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// PASSWORD RESET SESSION SCHEMA
// ///////////////////////////////////////

export const PasswordResetSessionSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  token: z.string(),
  attemptCount: z.number().int(),
  expiredAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export type PasswordResetSession = z.infer<typeof PasswordResetSessionSchema>;

// ///////////////////////////////////////
// PASSWORD RESET SESSION PARTIAL SCHEMA
// ///////////////////////////////////////

export const PasswordResetSessionPartialSchema = PasswordResetSessionSchema.partial();

export type PasswordResetSessionPartial = z.infer<typeof PasswordResetSessionPartialSchema>;

// PASSWORD RESET SESSION OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const PasswordResetSessionOptionalDefaultsSchema = PasswordResetSessionSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    attemptCount: z.number().int().optional(),
    updatedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type PasswordResetSessionOptionalDefaults = z.infer<
  typeof PasswordResetSessionOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// USER AVATAR SCHEMA
// ///////////////////////////////////////

export const UserAvatarSchema = z.object({
  id: z.string().cuid(),
  inGameId: z.string(),
  characterName: z.string(),
  rank: z.string(),
  ratingScore: z
    .union([ z.number(), z.string(), DecimalJSLikeSchema ])
    .refine((v) => isValidDecimalInput(v), {
      message: "Field 'ratingScore' must be a Decimal. Location: ['Models', 'UserAvatar']"
    }),
  gameId: z.string(),
  userId: z.string()
});

export type UserAvatar = z.infer<typeof UserAvatarSchema>;

// ///////////////////////////////////////
// USER AVATAR PARTIAL SCHEMA
// ///////////////////////////////////////

export const UserAvatarPartialSchema = UserAvatarSchema.partial();

export type UserAvatarPartial = z.infer<typeof UserAvatarPartialSchema>;

// USER AVATAR OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const UserAvatarOptionalDefaultsSchema = UserAvatarSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    characterName: z.string().optional(),
    ratingScore: z
      .union([ z.number(), z.string(), DecimalJSLikeSchema ])
      .refine((v) => isValidDecimalInput(v), {
        message: "Field 'ratingScore' must be a Decimal. Location: ['Models', 'UserAvatar']"
      })
      .optional()
  })
);

export type UserAvatarOptionalDefaults = z.infer<typeof UserAvatarOptionalDefaultsSchema>;

// ///////////////////////////////////////
// REVIEW SCHEMA
// ///////////////////////////////////////

export const ReviewSchema = z.object({
  id: z.string().cuid(),
  content: z.string(),
  ratingScore: z
    .union([ z.number(), z.string(), DecimalJSLikeSchema ])
    .refine((v) => isValidDecimalInput(v), {
      message: "Field 'ratingScore' must be a Decimal. Location: ['Models', 'Review']"
    }),
  reviewerId: z.string().nullish(),
  revieweeId: z.string(),
  gameId: z.string(),
  createdAt: z.coerce.date()
});

export type Review = z.infer<typeof ReviewSchema>;

// ///////////////////////////////////////
// REVIEW PARTIAL SCHEMA
// ///////////////////////////////////////

export const ReviewPartialSchema = ReviewSchema.partial();

export type ReviewPartial = z.infer<typeof ReviewPartialSchema>;

// REVIEW OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const ReviewOptionalDefaultsSchema = ReviewSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    ratingScore: z
      .union([ z.number(), z.string(), DecimalJSLikeSchema ])
      .refine((v) => isValidDecimalInput(v), {
        message: "Field 'ratingScore' must be a Decimal. Location: ['Models', 'Review']"
      })
      .optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type ReviewOptionalDefaults = z.infer<typeof ReviewOptionalDefaultsSchema>;

// ///////////////////////////////////////
// APPOINTMENT SCHEMA
// ///////////////////////////////////////

export const AppointmentSchema = z.object({
  id: z.string().cuid(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  deletedBeforeAt: z.coerce.date().nullish(),
  isDeleted: z.boolean(),
  roomId: z.string().nullish(),
  createdAt: z.coerce.date()
});

export type Appointment = z.infer<typeof AppointmentSchema>;

// ///////////////////////////////////////
// APPOINTMENT PARTIAL SCHEMA
// ///////////////////////////////////////

export const AppointmentPartialSchema = AppointmentSchema.partial();

export type AppointmentPartial = z.infer<typeof AppointmentPartialSchema>;

// APPOINTMENT OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const AppointmentOptionalDefaultsSchema = AppointmentSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    isDeleted: z.boolean().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type AppointmentOptionalDefaults = z.infer<typeof AppointmentOptionalDefaultsSchema>;

// ///////////////////////////////////////
// APPOINTMENT PENDING SCHEMA
// ///////////////////////////////////////

export const AppointmentPendingSchema = z.object({
  id: z.string().cuid(),
  appointmentId: z.string(),
  inviterTeamId: z.string(),
  inviteeTeamId: z.string(),
  createdAt: z.coerce.date()
});

export type AppointmentPending = z.infer<typeof AppointmentPendingSchema>;

// ///////////////////////////////////////
// APPOINTMENT PENDING PARTIAL SCHEMA
// ///////////////////////////////////////

export const AppointmentPendingPartialSchema = AppointmentPendingSchema.partial();

export type AppointmentPendingPartial = z.infer<typeof AppointmentPendingPartialSchema>;

// APPOINTMENT PENDING OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const AppointmentPendingOptionalDefaultsSchema = AppointmentPendingSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type AppointmentPendingOptionalDefaults = z.infer<
  typeof AppointmentPendingOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// APPOINTMENT MEMBER SCHEMA
// ///////////////////////////////////////

export const AppointmentMemberSchema = z.object({
  id: z.string().cuid(),
  appointmentId: z.string(),
  teamId: z.string(),
  isLeft: z.boolean(),
  createdAt: z.coerce.date()
});

export type AppointmentMember = z.infer<typeof AppointmentMemberSchema>;

// ///////////////////////////////////////
// APPOINTMENT MEMBER PARTIAL SCHEMA
// ///////////////////////////////////////

export const AppointmentMemberPartialSchema = AppointmentMemberSchema.partial();

export type AppointmentMemberPartial = z.infer<typeof AppointmentMemberPartialSchema>;

// APPOINTMENT MEMBER OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const AppointmentMemberOptionalDefaultsSchema = AppointmentMemberSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    isLeft: z.boolean().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type AppointmentMemberOptionalDefaults = z.infer<
  typeof AppointmentMemberOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// CHAT SCHEMA
// ///////////////////////////////////////

export const ChatSchema = z.object({
  id: z.string().cuid(),
  roomId: z.string()
});

export type Chat = z.infer<typeof ChatSchema>;

// ///////////////////////////////////////
// CHAT PARTIAL SCHEMA
// ///////////////////////////////////////

export const ChatPartialSchema = ChatSchema.partial();

export type ChatPartial = z.infer<typeof ChatPartialSchema>;

// CHAT OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const ChatOptionalDefaultsSchema = ChatSchema.merge(
  z.object({
    id: z.string().cuid().optional()
  })
);

export type ChatOptionalDefaults = z.infer<typeof ChatOptionalDefaultsSchema>;

// ///////////////////////////////////////
// MESSAGE SCHEMA
// ///////////////////////////////////////

export const MessageSchema = z.object({
  id: z.string().cuid(),
  chatId: z.string(),
  replyId: z.string().nullish(),
  imageUrls: z.string().array(),
  teamId: z.string().nullish(),
  senderId: z.string().nullish(),
  message: z.string(),
  createdAt: z.coerce.date()
});

export type Message = z.infer<typeof MessageSchema>;

// ///////////////////////////////////////
// MESSAGE PARTIAL SCHEMA
// ///////////////////////////////////////

export const MessagePartialSchema = MessageSchema.partial();

export type MessagePartial = z.infer<typeof MessagePartialSchema>;

// MESSAGE OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const MessageOptionalDefaultsSchema = MessageSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    imageUrls: z.string().array().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type MessageOptionalDefaults = z.infer<typeof MessageOptionalDefaultsSchema>;

// ///////////////////////////////////////
// TEAM STATS SCHEMA
// ///////////////////////////////////////

export const TeamStatsSchema = z.object({
  id: z.string().cuid(),
  teamId: z.string(),
  leftWhileTrainingCount: z.number().int(),
  completedTrainingCount: z.number().int(),
  trainingMinute: z.number().int(),
  trainingCount: z.number().int(),
  winCount: z.number().int(),
  loseCount: z.number().int(),
  tieCount: z.number().int(),
  perGameWinCount: z.number().int(),
  perGameLoseCount: z.number().int(),
  updateAt: z.coerce.date()
});

export type TeamStats = z.infer<typeof TeamStatsSchema>;

// ///////////////////////////////////////
// TEAM STATS PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamStatsPartialSchema = TeamStatsSchema.partial();

export type TeamStatsPartial = z.infer<typeof TeamStatsPartialSchema>;

// TEAM STATS OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TeamStatsOptionalDefaultsSchema = TeamStatsSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    leftWhileTrainingCount: z.number().int().optional(),
    completedTrainingCount: z.number().int().optional(),
    trainingMinute: z.number().int().optional(),
    trainingCount: z.number().int().optional(),
    winCount: z.number().int().optional(),
    loseCount: z.number().int().optional(),
    tieCount: z.number().int().optional(),
    perGameWinCount: z.number().int().optional(),
    perGameLoseCount: z.number().int().optional(),
    updateAt: z.coerce.date().optional()
  })
);

export type TeamStatsOptionalDefaults = z.infer<typeof TeamStatsOptionalDefaultsSchema>;

// ///////////////////////////////////////
// TRAINING SCHEMA
// ///////////////////////////////////////

export const TrainingSchema = z.object({
  status: TrainingStatusSchema,
  source: TrainingSourceSchema,
  id: z.string().cuid(),
  appointmentId: z.string(),
  hostId: z.string().nullish(),
  guestId: z.string().nullish(),
  hostWinCount: z.number().int().nullish(),
  hostLoseCount: z.number().int().nullish(),
  note: z.string(),
  imageUrls: z.string().array(),
  isSubmitted: z.boolean(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export type Training = z.infer<typeof TrainingSchema>;

// ///////////////////////////////////////
// TRAINING PARTIAL SCHEMA
// ///////////////////////////////////////

export const TrainingPartialSchema = TrainingSchema.partial();

export type TrainingPartial = z.infer<typeof TrainingPartialSchema>;

// TRAINING OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TrainingOptionalDefaultsSchema = TrainingSchema.merge(
  z.object({
    status: TrainingStatusSchema.optional(),
    source: TrainingSourceSchema.optional(),
    id: z.string().cuid().optional(),
    note: z.string().optional(),
    imageUrls: z.string().array().optional(),
    isSubmitted: z.boolean().optional(),
    updatedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type TrainingOptionalDefaults = z.infer<typeof TrainingOptionalDefaultsSchema>;

// ///////////////////////////////////////
// TRAINING LINEUP SCHEMA
// ///////////////////////////////////////

export const TrainingLineupSchema = z.object({
  id: z.string().cuid(),
  trainingId: z.string(),
  lineupId: z.string()
});

export type TrainingLineup = z.infer<typeof TrainingLineupSchema>;

// ///////////////////////////////////////
// TRAINING LINEUP PARTIAL SCHEMA
// ///////////////////////////////////////

export const TrainingLineupPartialSchema = TrainingLineupSchema.partial();

export type TrainingLineupPartial = z.infer<typeof TrainingLineupPartialSchema>;

// TRAINING LINEUP OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TrainingLineupOptionalDefaultsSchema = TrainingLineupSchema.merge(
  z.object({
    id: z.string().cuid().optional()
  })
);

export type TrainingLineupOptionalDefaults = z.infer<
  typeof TrainingLineupOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// TRAINING REPORT SCHEMA
// ///////////////////////////////////////

export const TrainingReportSchema = z.object({
  id: z.string().cuid(),
  reporterUserId: z.string().nullish(),
  reporterTeamId: z.string().nullish(),
  trainingId: z.string(),
  isAdminReviewed: z.boolean(),
  heading: z.string(),
  content: z.string(),
  imageUrls: z.string().array(),
  createdAt: z.coerce.date()
});

export type TrainingReport = z.infer<typeof TrainingReportSchema>;

// ///////////////////////////////////////
// TRAINING REPORT PARTIAL SCHEMA
// ///////////////////////////////////////

export const TrainingReportPartialSchema = TrainingReportSchema.partial();

export type TrainingReportPartial = z.infer<typeof TrainingReportPartialSchema>;

// TRAINING REPORT OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const TrainingReportOptionalDefaultsSchema = TrainingReportSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    isAdminReviewed: z.boolean().optional(),
    imageUrls: z.string().array().optional(),
    createdAt: z.coerce.date().optional()
  })
);

export type TrainingReportOptionalDefaults = z.infer<
  typeof TrainingReportOptionalDefaultsSchema
>;

// ///////////////////////////////////////
// ADMIN SCHEMA
// ///////////////////////////////////////

export const AdminSchema = z.object({
  role: AdminRoleSchema,
  id: z.string().cuid(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.coerce.date(),
  updateAt: z.coerce.date()
});

export type Admin = z.infer<typeof AdminSchema>;

// ///////////////////////////////////////
// ADMIN PARTIAL SCHEMA
// ///////////////////////////////////////

export const AdminPartialSchema = AdminSchema.partial();

export type AdminPartial = z.infer<typeof AdminPartialSchema>;

// ADMIN OPTIONAL DEFAULTS SCHEMA
// ------------------------------------------------------

export const AdminOptionalDefaultsSchema = AdminSchema.merge(
  z.object({
    role: AdminRoleSchema.optional(),
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional(),
    updateAt: z.coerce.date().optional()
  })
);

export type AdminOptionalDefaults = z.infer<typeof AdminOptionalDefaultsSchema>;
