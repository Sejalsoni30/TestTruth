import mongoose, { Document, Schema } from 'mongoose';

export type FindingClassification =
  | 'Verified mismatch'
  | 'Surviving mutation'
  | 'Weak assertion'
  | 'Missing scenario'
  | 'Inconclusive';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface IFinding extends Document {
  runId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  classification: FindingClassification;
  severity: FindingSeverity;
  title: string;
  filePath: string;
  line: number;
  column?: number;
  whyUnreliable: string;
  suggestedFix: string;
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number; // 0.0 - 1.0
  evidence: {
    snippet?: string;
    actualAssertion?: string;
    counterExampleInput?: string;
    mutatedCodeDiff?: string;
    details?: string;
  };
  ruleId: string;
  status: 'active' | 'resolved' | 'ignored';
  createdAt: Date;
  updatedAt: Date;
}

const FindingSchema = new Schema<IFinding>(
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
    classification: {
      type: String,
      enum: [
        'Verified mismatch',
        'Surviving mutation',
        'Weak assertion',
        'Missing scenario',
        'Inconclusive',
      ],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    line: {
      type: Number,
      required: true,
    },
    column: {
      type: Number,
      default: 1,
    },
    whyUnreliable: {
      type: String,
      required: true,
    },
    suggestedFix: {
      type: String,
      required: true,
    },
    confidence: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'high',
    },
    confidenceScore: {
      type: Number,
      default: 0.9,
    },
    evidence: {
      snippet: { type: String },
      actualAssertion: { type: String },
      counterExampleInput: { type: String },
      mutatedCodeDiff: { type: String },
      details: { type: String },
    },
    ruleId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'ignored'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Finding = mongoose.model<IFinding>('Finding', FindingSchema);

