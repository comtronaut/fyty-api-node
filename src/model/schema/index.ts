import { z } from "zod";
import type { Prisma } from "@prisma/client";

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

export const AdminScalarFieldEnumSchema = z.enum([
  "id",
  "email",
  "password",
  "role",
  "createdAt",
  "updateAt"
]);

export const AppointmentMemberScalarFieldEnumSchema = z.enum([
  "id",
  "appointmentId",
  "teamId",
  "isLeft",
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

export const ChatScalarFieldEnumSchema = z.enum([ "id", "roomId" ]);

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

export const PasswordResetSessionScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "token",
  "attemptCount",
  "expiredAt",
  "updatedAt",
  "createdAt"
]);

export const QueryModeSchema = z.enum([ "default", "insensitive" ]);

export const ReviewScalarFieldEnumSchema = z.enum([
  "id",
  "content",
  "ratingScore",
  "reviewerId",
  "revieweeId",
  "gameId",
  "createdAt"
]);

export const RoomLineupScalarFieldEnumSchema = z.enum([
  "id",
  "teamLineupId",
  "roomMemberId",
  "roomId"
]);

export const RoomMemberScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "roomId",
  "joinedAt"
]);

export const RoomPendingLineupScalarFieldEnumSchema = z.enum([
  "id",
  "roomPendingId",
  "teamLineupId"
]);

export const RoomPendingScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "roomId",
  "status",
  "createdAt"
]);

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

export const SortOrderSchema = z.enum([ "asc", "desc" ]);

export const TeamLineupScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "avatarId",
  "inGameId",
  "isDefault",
  "profileUrl",
  "imageUrl",
  "name",
  "note"
]);

export const TeamMemberScalarFieldEnumSchema = z.enum([
  "id",
  "role",
  "teamId",
  "userId",
  "joinedAt"
]);

export const TeamPendingScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "userId",
  "status",
  "createdAt"
]);

export const TeamScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "coverUrl",
  "logoUrl",
  "tier",
  "isPrivate",
  "gameId",
  "founderId",
  "isDeleted",
  "createdAt"
]);

export const TeamSettingsScalarFieldEnumSchema = z.enum([
  "id",
  "teamId",
  "isJoiningEnabled"
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

export const TrainingScalarFieldEnumSchema = z.enum([
  "id",
  "appointmentId",
  "hostId",
  "guestId",
  "hostWinCount",
  "hostLoseCount",
  "note",
  "status",
  "imageUrls",
  "isSubmitted",
  "updatedAt",
  "createdAt"
]);

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable"
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
  "UNREVIEWED"
]);

export type TrainingStatusType = `${z.infer<typeof TrainingStatusSchema>}`;

export const PendingStatusSchema = z.enum([ "INCOMING", "OUTGOING" ]);

export type PendingStatusType = `${z.infer<typeof PendingStatusSchema>}`;

export const AdminRoleSchema = z.enum([ "MANAGEMENT" ]);

export type AdminRoleType = `${z.infer<typeof AdminRoleSchema>}`;

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

// ///////////////////////////////////////
// ROOM SCHEMA
// ///////////////////////////////////////

export const RoomSchema = z.object({
  status: RoomStatusSchema,
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// ROOM SETTINGS SCHEMA
// ///////////////////////////////////////

export const RoomSettingsSchema = z.object({
  id: z.string().uuid(),
  roomId: z.string()
});

export type RoomSettings = z.infer<typeof RoomSettingsSchema>;

// ///////////////////////////////////////
// ROOM SETTINGS PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomSettingsPartialSchema = RoomSettingsSchema.partial();

export type RoomSettingsPartial = z.infer<typeof RoomSettingsPartialSchema>;

// ///////////////////////////////////////
// ROOM MEMBER SCHEMA
// ///////////////////////////////////////

export const RoomMemberSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// ROOM LINEUP SCHEMA
// ///////////////////////////////////////

export const RoomLineupSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// ROOM PENDING SCHEMA
// ///////////////////////////////////////

export const RoomPendingSchema = z.object({
  status: PendingStatusSchema,
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// ROOM PENDING LINEUP SCHEMA
// ///////////////////////////////////////

export const RoomPendingLineupSchema = z.object({
  id: z.string().uuid(),
  roomPendingId: z.string(),
  teamLineupId: z.string()
});

export type RoomPendingLineup = z.infer<typeof RoomPendingLineupSchema>;

// ///////////////////////////////////////
// ROOM PENDING LINEUP PARTIAL SCHEMA
// ///////////////////////////////////////

export const RoomPendingLineupPartialSchema = RoomPendingLineupSchema.partial();

export type RoomPendingLineupPartial = z.infer<typeof RoomPendingLineupPartialSchema>;

// ///////////////////////////////////////
// TEAM SCHEMA
// ///////////////////////////////////////

export const TeamSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  coverUrl: z.string(),
  logoUrl: z.string(),
  tier: z.string(),
  isPrivate: z.boolean(),
  gameId: z.string(),
  founderId: z.string().nullish(),
  isDeleted: z.boolean(),
  createdAt: z.coerce.date()
});

export type Team = z.infer<typeof TeamSchema>;

// ///////////////////////////////////////
// TEAM PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamPartialSchema = TeamSchema.partial();

export type TeamPartial = z.infer<typeof TeamPartialSchema>;

// ///////////////////////////////////////
// TEAM SETTINGS SCHEMA
// ///////////////////////////////////////

export const TeamSettingsSchema = z.object({
  id: z.string().uuid(),
  teamId: z.string(),
  isJoiningEnabled: z.boolean()
});

export type TeamSettings = z.infer<typeof TeamSettingsSchema>;

// ///////////////////////////////////////
// TEAM SETTINGS PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamSettingsPartialSchema = TeamSettingsSchema.partial();

export type TeamSettingsPartial = z.infer<typeof TeamSettingsPartialSchema>;

// ///////////////////////////////////////
// TEAM MEMBER SCHEMA
// ///////////////////////////////////////

export const TeamMemberSchema = z.object({
  role: MemberRoleSchema,
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// TEAM LINEUP SCHEMA
// ///////////////////////////////////////

export const TeamLineupSchema = z.object({
  id: z.string().uuid(),
  teamId: z.string(),
  avatarId: z.string().nullish(),
  inGameId: z.string().nullish(),
  isDefault: z.boolean(),
  profileUrl: z.string(),
  imageUrl: z.string(),
  name: z.string(),
  note: z.string()
});

export type TeamLineup = z.infer<typeof TeamLineupSchema>;

// ///////////////////////////////////////
// TEAM LINEUP PARTIAL SCHEMA
// ///////////////////////////////////////

export const TeamLineupPartialSchema = TeamLineupSchema.partial();

export type TeamLineupPartial = z.infer<typeof TeamLineupPartialSchema>;

// ///////////////////////////////////////
// TEAM PENDING SCHEMA
// ///////////////////////////////////////

export const TeamPendingSchema = z.object({
  status: PendingStatusSchema,
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// USER SCHEMA
// ///////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  updatedUsernameAt: z.coerce.date().nullish(),
  mobilePhone: z.string(),
  updatedMobilePhoneAt: z.coerce.date().nullish(),
  password: z.string(),
  displayName: z.string(),
  email: z.string().nullish(),
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

// ///////////////////////////////////////
// USER SETTINGS SCHEMA
// ///////////////////////////////////////

export const UserSettingsSchema = z.object({
  lang: LangSchema,
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// PASSWORD RESET SESSION SCHEMA
// ///////////////////////////////////////

export const PasswordResetSessionSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// USER AVATAR SCHEMA
// ///////////////////////////////////////

export const UserAvatarSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// REVIEW SCHEMA
// ///////////////////////////////////////

export const ReviewSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// APPOINTMENT SCHEMA
// ///////////////////////////////////////

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// APPOINTMENT MEMBER SCHEMA
// ///////////////////////////////////////

export const AppointmentMemberSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// CHAT SCHEMA
// ///////////////////////////////////////

export const ChatSchema = z.object({
  id: z.string().uuid(),
  roomId: z.string()
});

export type Chat = z.infer<typeof ChatSchema>;

// ///////////////////////////////////////
// CHAT PARTIAL SCHEMA
// ///////////////////////////////////////

export const ChatPartialSchema = ChatSchema.partial();

export type ChatPartial = z.infer<typeof ChatPartialSchema>;

// ///////////////////////////////////////
// MESSAGE SCHEMA
// ///////////////////////////////////////

export const MessageSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// TEAM STATS SCHEMA
// ///////////////////////////////////////

export const TeamStatsSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// TRAINING SCHEMA
// ///////////////////////////////////////

export const TrainingSchema = z.object({
  status: TrainingStatusSchema,
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// TRAINING REPORT SCHEMA
// ///////////////////////////////////////

export const TrainingReportSchema = z.object({
  id: z.string().uuid(),
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

// ///////////////////////////////////////
// ADMIN SCHEMA
// ///////////////////////////////////////

export const AdminSchema = z.object({
  role: AdminRoleSchema,
  id: z.string().uuid(),
  email: z.string(),
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
