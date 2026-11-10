import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  framework: 'jest' | 'vitest' | 'custom' | 'unknown';
  language: 'javascript' | 'typescript' | 'mixed';
  stats: {
    totalFiles: number;
    sourceFilesCount: number;
    testFilesCount: number;
    lastRunAt?: Date;
    lastFindingsCount?: number;
    lastMutationKillRate?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    framework: {
      type: String,
      enum: ['jest', 'vitest', 'custom', 'unknown'],
      default: 'jest',
    },
    language: {
      type: String,
      enum: ['javascript', 'typescript', 'mixed'],
      default: 'javascript',
    },
    stats: {
      totalFiles: { type: Number, default: 0 },
      sourceFilesCount: { type: Number, default: 0 },
      testFilesCount: { type: Number, default: 0 },
      lastRunAt: { type: Date },
      lastFindingsCount: { type: Number, default: 0 },
      lastMutationKillRate: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

