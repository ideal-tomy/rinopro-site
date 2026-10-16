import type { IndustryDataset } from "../types";
import { careDataset } from "./care";
import { clinicOpsDataset } from "./clinic-ops";
import { constructionDataset } from "./construction";
import { financeInsuranceDataset } from "./finance-insurance";
import { itHelpdeskDataset } from "./it-helpdesk";
import { logisticsDataset } from "./logistics";
import { manufacturingDataset } from "./manufacturing";
import { publicBpoDataset } from "./public-bpo";
import { realEstateDataset } from "./real-estate";
import { retailEcDataset } from "./retail-ec";

export const allIndustryDatasets: IndustryDataset[] = [
  constructionDataset,
  clinicOpsDataset,
  careDataset,
  manufacturingDataset,
  retailEcDataset,
  realEstateDataset,
  financeInsuranceDataset,
  itHelpdeskDataset,
  logisticsDataset,
  publicBpoDataset,
];
