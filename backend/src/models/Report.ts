import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  runId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  title: string;
  projectInfo: {
    name: string;
    framework: string;
    language: string;
    totalFiles: number;
  };
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    mutationKillRate: number;
    weakAssertionsCount: number;
    runOnlyTestsCount: number;
    missingScenariosCount: number;
    totalFindings: number;
  };
  honestyDisclosures: string[];
  findingsSummary: {
    verifiedMismatches: number;
    survivingMutations: number;
    weakAssertions: number;
    missingScenarios: number;
    inconclusive: number;
  };
  recommendations: Array<{
    title: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  limitations: string[];
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
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
    title: {
      type: String,
      required: true,
    },
    projectInfo: {
      type: Schema.Types.Mixed,
      required: true,
    },
    summary: {
      type: Schema.Types.Mixed,
      required: true,
    },
    honestyDisclosures: {
      type: [String],
      default: [],
    },
    findingsSummary: {
      type: Schema.Types.Mixed,
      required: true,
    },
    recommendations: [
      {
        title: { type: String, required: true },
        action: { type: String, required: true },
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
      },
    ],
    limitations: {
      type: [String],
      default: [
        'Mutation testing evaluates test suite sensitivity against synthetic syntax modifications; it does not replace functional specification review.',
        'Deterministic and AI scenario generators suggest potential test cases based on syntax and prompt context; human domain review is necessary.',
        'No test suite can mathematically prove the total absence of bugs.'
      ],
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
