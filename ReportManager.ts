import { ReportAdapter } from "./ReportAdapter";
import { JsonReportAdapter } from "./JsonReportAdapter";
import { CsvReportAdapter } from "./CsvReportAdapter";
import { XmlReportAdapter } from "./XmlReportAdapter";
import { AnalyzerFacade } from "./AnalyzerFacade";
import * as fs from "fs";
import * as path from "path";

export class ReportManager {
  private static readonly REPORTS_DIR = "reports";
  private adapter: ReportAdapter;
  private fileExtension: string;
  private facade: AnalyzerFacade;

  constructor(format: string = "json") {
    this.initReportsDirectory();
    [this.adapter, this.fileExtension] = this.getAdapter(format);
    this.facade = new AnalyzerFacade(this.adapter);
  }

  private initReportsDirectory(): void {
    const dir = path.resolve(ReportManager.REPORTS_DIR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private getAdapter(format: string): [ReportAdapter, string] {
    const fmt = format.toLowerCase();
    switch (fmt) {
      case "csv":
        return [new CsvReportAdapter(), "csv"];
      case "xml":
        return [new XmlReportAdapter(), "xml"];
      case "json":
      default:
        return [new JsonReportAdapter(), "json"];
    }
  }

  public generateReport(targetPath: string): void {
    try {
      const content = this.facade.generateReport(targetPath);
      const timestamp = new Date().toISOString().split(":").join("-");
      const fileName = `report-${timestamp}.${this.fileExtension}`;
      const filePath = path.join(ReportManager.REPORTS_DIR, fileName);

      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`Report generated successfully: ${filePath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error generating report: ${message}`);
    }
  }
}