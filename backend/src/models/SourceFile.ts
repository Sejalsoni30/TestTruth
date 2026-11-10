import mongoose, { Document, Schema } from 'mongoose';

export interface ISourceFile extends Document {
  projectId: mongoose.Types.ObjectId;
  relativePath: string;
  fileType: 'source' | 'test' | 'config' | 'other';
  language: 'javascript' | 'typescript';
  content: string;
  contentHash: string;
  sizeBytes: number;
  astSummary?: {
    functions: Array<{
      name: string;
      line: number;
      endLine: number;
      params: string[];
      cyclomaticComplexity: number;
      branchesCount: number;
      hasErrorHandling: boolean;
    }>;
    branches: number;
    errorHandlersCount: number;
    imports: string[];
    associatedTests?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const SourceFileSchema = new Schema<ISourceFile>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    relativePath: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['source', 'test', 'config', 'other'],
      required: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'typescript'],
      default: 'javascript',
    },
    content: {
      type: String,
      required: true,
    },
    contentHash: {
      type: String,
      default: '',
      index: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
    astSummary: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

SourceFileSchema.index({ projectId: 1, relativePath: 1 }, { unique: true });

export const SourceFile = mongoose.model<ISourceFile>('SourceFile', SourceFileSchema);

