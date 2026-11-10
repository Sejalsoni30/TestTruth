import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysisRun extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: 'queued' | 'running' | 'completed' | 'failed';
  triggerType: 'manual' | 'ci' | 'upload';
  summaryMetrics: {
    totalTests: number;
    passedExecution: number;
    failedExecution: number;
    totalMutants: number;
    killedMutants: number;
    survivedMutants: number;
    mutationKillRate: number; // percentage killed, e.g. 75.5
    weakAssertionsCount: number;
    runOnlyTestsCount: number;
    missingScenariosCount: number;
    totalFindings: number;
  };
  honestyDisclosures: string[];
  executionSandbox: {
    type: 'docker' | 'process_isolated';
    durationMs: number;
    exitCode: number;
    timedOut: boolean;
  };
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisRunSchema = new Schema<IAnalysisRun>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['queued', 'running', 'completed', 'failed'],
      default: 'queued',
      index: true,
    },
    triggerType: {
      type: String,
      enum: ['manual', 'ci', 'upload'],
      default: 'manual',
    },
    summaryMetrics: {
      totalTests: { type: Number, default: 0 },
      passedExecution: { type: Number, default: 0 },
      failedExecution: { type: Number, default: 0 },
      totalMutants: { type: Number, default: 0 },
      killedMutants: { type: Number, default: 0 },
      survivedMutants: { type: Number, default: 0 },
      mutationKillRate: { type: Number, default: 0 },
      weakAssertionsCount: { type: Number, default: 0 },
      runOnlyTestsCount: { type: Number, default: 0 },
      missingScenariosCount: { type: Number, default: 0 },
      totalFindings: { type: Number, default: 0 },
    },
    honestyDisclosures: {
      type: [String],
      default: [
        'Mutation kill rate indicates test suite sensitivity to code edits, not 100% bug detection guarantee.',
        'A surviving mutant indicates potential test suite blind spots; domain-specific equivalence can occur.',
        'Passing tests with weak assertions provide execution coverage without verifying postconditions.'
      ],
    },
    executionSandbox: {
      type: {
        type: String,
        enum: ['docker', 'process_isolated'],
        default: 'process_isolated',
      },
      durationMs: { type: Number, default: 0 },
      exitCode: { type: Number, default: 0 },
      timedOut: { type: Boolean, default: false },
    },
    errorMessage: { type: String },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const AnalysisRun = mongoose.model<IAnalysisRun>('AnalysisRun', AnalysisRunSchema);

