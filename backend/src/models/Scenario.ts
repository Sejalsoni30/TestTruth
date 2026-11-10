import mongoose, { Document, Schema } from 'mongoose';

export type ScenarioType =
  | 'normal'
  | 'boundary'
  | 'negative'
  | 'exception'
  | 'edge'
  | 'regression';

export interface IScenario extends Document {
  runId?: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  targetFunction: string;
  scenarioType: ScenarioType;
  name: string;
  inputDescription: string;
  inputData: any;
  expectedResult: any;
  reasoning: string;
  testCode: string;
  isUserStated: boolean; // true = from user requirement; false = AI inferred
  inferredAssumptions?: string[];
  clarificationNeeded?: string;
  counterexampleInput?: string;
  createdAt: Date;
}

const ScenarioSchema = new Schema<IScenario>(
  {
    runId: {
      type: Schema.Types.ObjectId,
      ref: 'AnalysisRun',
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    targetFunction: {
      type: String,
      required: true,
    },
    scenarioType: {
      type: String,
      enum: ['normal', 'boundary', 'negative', 'exception', 'edge', 'regression'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    inputDescription: {
      type: String,
      required: true,
    },
    inputData: {
      type: Schema.Types.Mixed,
    },
    expectedResult: {
      type: Schema.Types.Mixed,
    },
    reasoning: {
      type: String,
      required: true,
    },
    testCode: {
      type: String,
      required: true,
    },
    isUserStated: {
      type: Boolean,
      default: false,
    },
    inferredAssumptions: {
      type: [String],
      default: [],
    },
    clarificationNeeded: {
      type: String,
    },
    counterexampleInput: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Scenario = mongoose.model<IScenario>('Scenario', ScenarioSchema);

