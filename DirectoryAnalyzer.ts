import * as fs from 'fs';
import * as path from 'path';
import { DirectoryReport } from './DirectoryReport';

export class DirectoryAnalyzer {
  public analyze(dirPath: string): DirectoryReport {
    const report: DirectoryReport = {
      files: 0,
      directories: 0,
      totalSize: 0,
      extensions: {},
    };

    const scan = (currentPath: string) => {
      const items = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(currentPath, item.name);

        if (item.isDirectory()) {
          report.directories++;
          scan(fullPath);
        } else if (item.isFile()) {
          report.files++;

          const stats = fs.statSync(fullPath);
          report.totalSize += stats.size;

          const ext = path.extname(item.name) || 'no-extension';
          report.extensions[ext] = (report.extensions[ext] || 0) + 1;
        }
      }
    };

    scan(dirPath);
    return report;
  }
}
