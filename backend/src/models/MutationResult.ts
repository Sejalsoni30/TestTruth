import mongoose, { Document, Schema } from 'mongoose';

export type MutationCategory =
  | 'operator'
  | 'boolean'
  | 'condition'
  | 'return_value'
  | 'boundary';

export type MutationStatus = 'killed' | 'survived' | 'timeout' | 'error';

export interface IMutationResult extends Document {
  runId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  filePath: string;
  line: number;
  category: MutationCategory;
  description: string;
  originalCodeSnippet: string;
  mutatedCodeSnippet: string;
  diff: string;
  status: MutationStatus;
  killingTestName?: string;
  testOutput?: string;
  executionDurationMs?: number;
  createdAt: Date;
}

const MutationResultSchema = new Schema<IMutationResult>(
  {
    runId: {
      type: Schema.Types.ObjectId,
      ref: 'AnalysisRun',
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    line: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['operator', 'boolean', 'condition', 'return_value', 'boundary'],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalCodeSnippet: {
      type: String,
      required: true,
    },
    mutatedCodeSnippet: {
      type: String,
      required: true,
    },
    diff: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['killed', 'survived', 'timeout', 'error'],
      required: true,
      index: true,
    },
    killingTestName: {
      type: String,
    },
    testOutput: {
      type: String,
    },
    executionDurationMs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const MutationResult = mongoose.model<IMutationResult>('MutationResult', MutationResultSchema);

