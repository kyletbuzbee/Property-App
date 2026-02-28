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

class KnowledgeBundleService {
  private data: any[] = [];
  private isLoaded: boolean = false;

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

    return comps.map((c) => ({
      street: c.street,
      city: c.city,
      state: c.state,
      zip_code: String(c.zip_code),
      sold_price: parseFloat(c.sold_price),
      sqft: parseFloat(c.sqft),
      beds: parseFloat(c.beds),
      full_baths: parseFloat(c.full_baths),
      last_sold_date: c.last_sold_date,
      latitude: parseFloat(c.latitude),
      longitude: parseFloat(c.longitude),
    }));
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
