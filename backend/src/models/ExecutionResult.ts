import mongoose, { Document, Schema } from 'mongoose';

export interface IExecutionResult extends Document {
  runId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  sandboxType: 'docker' | 'process_isolated';
  command: string;
  exitCode: number;
  durationMs: number;
  stdout: string;
  stderr: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  timedOut: boolean;
  securityChecksPassed: boolean;
  isolationMetadata: {
    memoryLimitMb: number;
    timeoutLimitMs: number;
    networkIsolated: boolean;
    environmentSanitized: boolean;
  };
  createdAt: Date;
}

const ExecutionResultSchema = new Schema<IExecutionResult>(
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
    sandboxType: {
      type: String,
      enum: ['docker', 'process_isolated'],
      required: true,
    },
    command: {
      type: String,
      required: true,
    },
    exitCode: {
      type: Number,
      required: true,
    },
    durationMs: {
      type: Number,
      required: true,
    },
    stdout: {
      type: String,
      default: '',
    },
    stderr: {
      type: String,
      default: '',
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    failedTests: {
      type: Number,
      default: 0,
    },
    timedOut: {
      type: Boolean,
      default: false,
    },
    securityChecksPassed: {
      type: Boolean,
      default: true,
    },
    isolationMetadata: {
      memoryLimitMb: { type: Number, default: 512 },
      timeoutLimitMs: { type: Number, default: 10000 },
      networkIsolated: { type: Boolean, default: true },
      environmentSanitized: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const ExecutionResult = mongoose.model<IExecutionResult>('ExecutionResult', ExecutionResultSchema);

