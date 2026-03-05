import fs from "fs";
import path from "path";
import Papa from "papaparse";

export interface SoldComp {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  sold_price: number;
  sqft: number;
  beds: number;
  full_baths: number;
  last_sold_date: string;
  latitude: number;
  longitude: number;
}

export interface MarketVelocity {
  zip_code: string;
  price_band: string;
  median_dom: number;
  p75_dom: number;
}

export interface ArvSummary {
  zip_code: string;
  arv_p50: number;
}

export interface AttomAvm {
  address: string;
  sqft: number;
  avm_value: number;
  avm_low: number;
  avm_high: number;
}

export interface ZHVIData {
  zip_code: string;
  current_value: number;
  yoy_growth: number;
  monthly_history: Record<string, number>;
}

export interface FHFA_HPI {
  county: string;
  year: number;
  annual_change: number;
  hpi: number;
}

export interface MarketForecast {
  phase: "hot" | "warm" | "stable" | "cooling";
  growth_12mo: number;
  confidence: number;
}

class KnowledgeBundleService {
  private data: any[] = [];
  private isLoaded: boolean = false;
  private zhviData: Map<string, ZHVIData> = new Map();
  private fhfaData: Map<string, FHFA_HPI[]> = new Map();
  private isZhviLoaded: boolean = false;

  private loadData() {
    if (this.isLoaded) return;

    const bundlePath = path.join(
      process.cwd(),
      "processed",
      "gem_knowledge_bundle.csv",
    );
    if (!fs.existsSync(bundlePath)) {
      console.error(`Knowledge bundle not found at ${bundlePath}`);
      return;
    }

    const csvData = fs.readFileSync(bundlePath, "utf-8");
    const result = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    this.data = result.data;
    this.isLoaded = true;
    console.log(`Knowledge bundle loaded: ${this.data.length} rows`);

    this.loadZhviData();
  }

  private loadZhviData() {
    if (this.isZhviLoaded) return;

    try {
      const zhviPath = path.join(
        process.cwd(),
        "processed",
        "east_texas_filtered",
        "Zip_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv",
      );

      if (fs.existsSync(zhviPath)) {
        const csvData = fs.readFileSync(zhviPath, "utf-8");
        const result = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });

        for (const row of result.data as any[]) {
          if (!row.RegionName) continue;

          const zipCode = String(row.RegionName).trim();
          const monthlyHistory: Record<string, number> = {};
          const monthColumns: string[] = [];

          for (const key of Object.keys(row)) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(key) || /^\d{4}-\d{2}$/.test(key)) {
              monthColumns.push(key);
              if (row[key] !== null && row[key] !== undefined && !isNaN(row[key])) {
                monthlyHistory[key] = parseFloat(row[key]);
              }
            }
          }

          monthColumns.sort();

          const currentValue = this.getLatestMonthValue(row);
          let yoyGrowth = 0;

          if (monthColumns.length >= 13) {
            const currentMonth = monthColumns[monthColumns.length - 1];
            const yearAgoMonth = monthColumns[monthColumns.length - 13];
            const current = monthlyHistory[currentMonth];
            const yearAgo = monthlyHistory[yearAgoMonth];

            if (current && yearAgo && yearAgo !== 0) {
              yoyGrowth = ((current - yearAgo) / yearAgo) * 100;
            }
          }

          this.zhviData.set(zipCode, {
            zip_code: zipCode,
            current_value: currentValue,
            yoy_growth: parseFloat(yoyGrowth.toFixed(2)),
            monthly_history: monthlyHistory,
          });
        }

        console.log(`ZHVI data loaded: ${this.zhviData.size} zip codes`);
      } else {
        console.warn(`ZHVI file not found at ${zhviPath}`);
      }

      const fhfaPath = path.join(
        process.cwd(),
        "processed",
        "east_texas_filtered",
        "FHFA_County_east_tx.csv",
      );

      if (fs.existsSync(fhfaPath)) {
        const csvData = fs.readFileSync(fhfaPath, "utf-8");
        const result = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });

        for (const row of result.data as any[]) {
          if (!row.county && !row.County) continue;

          const county = String(row.county || row.County).trim();
          const year = parseInt(row.year || row.Year || row.YEAR);
          const annualChange = parseFloat(row.annual_change || row.AnnualChange || row.change || 0);
          const hpi = parseFloat(row.hpi || row.HPI || row.index || 0);

          if (isNaN(year)) continue;

          const hpiData: FHFA_HPI = {
            county,
            year,
            annual_change: annualChange,
            hpi,
          };

          if (!this.fhfaData.has(county)) {
            this.fhfaData.set(county, []);
          }
          this.fhfaData.get(county)!.push(hpiData);
        }

        for (const [county, data] of this.fhfaData.entries()) {
          data.sort((a, b) => b.year - a.year);
        }

        console.log(`FHFA data loaded: ${this.fhfaData.size} counties`);
      } else {
        console.warn(`FHFA file not found at ${fhfaPath}`);
      }

      this.isZhviLoaded = true;
    } catch (error) {
      console.error("Error loading ZHVI/FHFA data:", error);
    }
  }

  public getLatestMonthValue(record: any): number {
    if (!record || typeof record !== "object") return 0;

    const monthColumns: string[] = [];

    for (const key of Object.keys(record)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) || /^\d{4}-\d{2}$/.test(key)) {
        monthColumns.push(key);
      }
    }

    if (monthColumns.length === 0) return 0;

    monthColumns.sort();
    const latestMonth = monthColumns[monthColumns.length - 1];
    const value = record[latestMonth];

    return value !== null && value !== undefined && !isNaN(value)
      ? parseFloat(value)
      : 0;
  }

  public getZHVI(zip: string): ZHVIData | null {
    this.loadData();
    const cleanZip = String(zip).trim();
    return this.zhviData.get(cleanZip) || null;
  }

  public getFHFA_HPI(county: string): FHFA_HPI | null {
    this.loadData();
    const cleanCounty = String(county).trim();
    const countyData = this.fhfaData.get(cleanCounty);

    if (!countyData || countyData.length === 0) return null;

    return countyData[0];
  }

  public getMarketPhase(zip: string): MarketForecast {
    this.loadData();
    const zhvi = this.getZHVI(zip);

    if (!zhvi) {
      return {
        phase: "stable",
        growth_12mo: 0,
        confidence: 0,
      };
    }

    const yoyGrowth = zhvi.yoy_growth;
    const currentValue = zhvi.current_value;
    let confidence = 0.7;

    const monthCount = Object.keys(zhvi.monthly_history).length;
    if (monthCount >= 24) {
      confidence = 0.9;
    } else if (monthCount >= 12) {
      confidence = 0.8;
    } else if (monthCount >= 6) {
      confidence = 0.6;
    } else {
      confidence = 0.4;
    }

    let phase: "hot" | "warm" | "stable" | "cooling";
    let projectedGrowth: number;

    if (yoyGrowth > 10) {
      phase = "hot";
      projectedGrowth = yoyGrowth * 0.8;
    } else if (yoyGrowth > 5) {
      phase = "warm";
      projectedGrowth = yoyGrowth * 0.9;
    } else if (yoyGrowth > 0) {
      phase = "stable";
      projectedGrowth = yoyGrowth;
    } else {
      phase = "cooling";
      projectedGrowth = yoyGrowth * 0.5;
    }

    return {
      phase,
      growth_12mo: parseFloat(projectedGrowth.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(2)),
    };
  }

  /**
   * getSoldComps(zip, sqft): Queries SOLD_COMPS for last 6 mos, +/- 200 sqft.
   * Includes fallback expansion logic (to +/- 400 sqft, then 12 mos).
   */
  public getSoldComps(zip: string, targetSqft: number): SoldComp[] {
    this.loadData();
    const today = new Date("2026-02-28");

    const filterComps = (months: number, sqftBuffer: number) => {
      const cutoffDate = new Date(today);
      cutoffDate.setMonth(cutoffDate.getMonth() - months);

      return this.data.filter((row) => {
        if (row._section !== "SOLD_COMPS") return false;

        // Match zip (handle numeric/string)
        const rowZip = String(row.zip_code || row.source_zip || "").split(
          ".",
        )[0];
        if (rowZip !== String(zip)) return false;

        // Match sqft
        const rowSqft = parseFloat(row.sqft);
        if (isNaN(rowSqft) || Math.abs(rowSqft - targetSqft) > sqftBuffer)
          return false;

        // Match date
        const soldDate = new Date(row.last_sold_date);
        if (isNaN(soldDate.getTime()) || soldDate < cutoffDate) return false;

        return true;
      });
    };

    // Primary: 6 mos, +/- 200 sqft
    let comps = filterComps(6, 200);

    // Fallback 1: +/- 400 sqft
    if (comps.length < 3) {
      comps = filterComps(6, 400);
    }

    // Fallback 2: 12 mos, +/- 400 sqft
    if (comps.length < 3) {
      comps = filterComps(12, 400);
    }

    return comps.map((c) => {
      // HYBRID APPROACH: Use sold_price if available, otherwise estimate from list_price
      let effectiveSoldPrice = parseFloat(c.sold_price);
      
      // If no sold_price, use list_price * 0.90 (assuming 10% negotiation)
      if (!effectiveSoldPrice || isNaN(effectiveSoldPrice)) {
        const listPrice = parseFloat(c.list_price);
        if (listPrice && !isNaN(listPrice)) {
          effectiveSoldPrice = Math.round(listPrice * 0.90);
        }
      }
      
      return {
        street: c.street,
        city: c.city,
        state: c.state,
        zip_code: String(c.zip_code),
        sold_price: effectiveSoldPrice,
        sqft: parseFloat(c.sqft),
        beds: parseFloat(c.beds),
        full_baths: parseFloat(c.full_baths),
        last_sold_date: c.last_sold_date,
        latitude: parseFloat(c.latitude),
        longitude: parseFloat(c.longitude),
      };
    });
  }

  /**
   * getMarketVelocity(zip, priceBand): Queries MARKET_VELOCITY for median_dom and p75_dom.
   */
  public getMarketVelocity(
    zip: string,
    priceBand: string,
  ): MarketVelocity | null {
    this.loadData();
    const velocity = this.data.find((row) => {
      if (row._section !== "MARKET_VELOCITY") return false;
      const rowZip = String(row.zip_code || row.zip || "").split(".")[0];
      return rowZip === String(zip) && row.price_band === priceBand;
    });

    if (!velocity) return null;

    return {
      zip_code: String(velocity.zip_code || zip),
      price_band: velocity.price_band,
      median_dom: parseFloat(velocity.median_dom),
      p75_dom: parseFloat(velocity.p75_dom),
    };
  }

  /**
   * getArvSummary(zip): Queries ARV_SUMMARY for arv_p50.
   */
  public getArvSummary(zip: string): ArvSummary | null {
    this.loadData();
    const summary = this.data.find((row) => {
      if (row._section !== "ARV_SUMMARY") return false;
      const rowZip = String(row.zip_code || row.zip || "").split(".")[0];
      return rowZip === String(zip);
    });

    if (!summary) return null;

    return {
      zip_code: String(summary.zip_code || zip),
      arv_p50: parseFloat(summary.arv_p50),
    };
  }

  /**
   * getAttomAvm(zip, sqft): Queries ATTOM_PROPERTY_DETAILS for +/- 150 sqft cross-check.
   */
  public getAttomAvm(zip: string, targetSqft: number): AttomAvm[] {
    this.loadData();
    return this.data
      .filter((row) => {
        if (row._section !== "ATTOM_PROPERTY_DETAILS") return false;
        const rowZip = String(row.zip_code || row.zip || "").split(".")[0];
        if (rowZip !== String(zip)) return false;

        const rowSqft = parseFloat(row.sqft);
        return !isNaN(rowSqft) && Math.abs(rowSqft - targetSqft) <= 150;
      })
      .map((row) => ({
        address: row.address || row.street,
        sqft: parseFloat(row.sqft),
        avm_value: parseFloat(row.avm_value),
        avm_low: parseFloat(row.avm_low),
        avm_high: parseFloat(row.avm_high),
      }));
  }

  /**
   * getRehabCatalog(): Extracts rehab_unit_cost_catalog_east_tx.json from POLICY_JSON.
   */
  public getRehabCatalog(): any | null {
    this.loadData();
    const policy = this.data.find((row) => row._section === "POLICY_JSON");
    if (!policy || !policy.json_content) return null;

    try {
      const content = JSON.parse(policy.json_content);
      return content.rehab_unit_cost_catalog_east_tx || content;
    } catch (e) {
      console.error("Failed to parse POLICY_JSON content", e);
      return null;
    }
  }
}

export const KnowledgeBundle = new KnowledgeBundleService();
