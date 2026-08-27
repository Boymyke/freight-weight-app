export type LoadStatus = 'Ready to invoice' | 'Blocked' | 'Review' | 'Invoiced';

export type Accessorial = {
  label: string;
  carrier: number;
  customer: number;
  evidence: boolean;
  approved?: boolean;
};

export type FreightLoad = {
  id: string;
  customer: string;
  lane: string;
  deliveredAt: string;
  ageHours: number;
  amount: number;
  status: LoadStatus;
  issue?: string;
  risk: number;
  owner: string;
  note?: string;
  pod: boolean;
  rateCon: boolean;
  carrierInvoice: boolean;
  customerRequirements: boolean;
  accessorials: Accessorial[];
};

export const loads: FreightLoad[] = [
  { id: 'LD-98431', customer: 'Northstar Foods', lane: 'Dallas, TX → Atlanta, GA', deliveredAt: 'Aug 26 · 08:14', ageHours: 8, amount: 4850, status: 'Blocked', issue: 'Missing signed POD', risk: 4850, owner: 'Sarah M.', pod: false, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [] },
  { id: 'LD-98453', customer: 'Mason Retail', lane: 'Chicago, IL → Columbus, OH', deliveredAt: 'Aug 26 · 07:42', ageHours: 10, amount: 3120, status: 'Review', issue: 'Lumper receipt missing', risk: 185, owner: 'Mark D.', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [{ label: 'Lumper', carrier: 185, customer: 0, evidence: false }] },
  { id: 'LD-98491', customer: 'Pinnacle Packaging', lane: 'Memphis, TN → Nashville, TN', deliveredAt: 'Aug 25 · 18:06', ageHours: 21, amount: 2760, status: 'Review', issue: 'Detention not rebilled', risk: 300, owner: 'Sarah M.', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [{ label: 'Detention', carrier: 300, customer: 0, evidence: true }] },
  { id: 'LD-98502', customer: 'Everline Home', lane: 'Phoenix, AZ → Las Vegas, NV', deliveredAt: 'Aug 25 · 16:48', ageHours: 24, amount: 5240, status: 'Blocked', issue: 'Rate mismatch', risk: 475, owner: 'Finance', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [] },
  { id: 'LD-98511', customer: 'Atlas Components', lane: 'Detroit, MI → Indianapolis, IN', deliveredAt: 'Aug 25 · 14:22', ageHours: 29, amount: 3930, status: 'Blocked', issue: 'Customer packet incomplete', risk: 3930, owner: 'James R.', pod: true, rateCon: false, carrierInvoice: true, customerRequirements: false, accessorials: [] },
  { id: 'LD-98529', customer: 'Blue Ridge Supply', lane: 'Charlotte, NC → Richmond, VA', deliveredAt: 'Aug 25 · 12:05', ageHours: 31, amount: 2180, status: 'Ready to invoice', risk: 0, owner: 'Automated', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [] },
  { id: 'LD-98542', customer: 'Metro Appliances', lane: 'Houston, TX → New Orleans, LA', deliveredAt: 'Aug 25 · 09:53', ageHours: 34, amount: 4490, status: 'Review', issue: 'Layover requires approval', risk: 250, owner: 'Mark D.', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [{ label: 'Layover', carrier: 250, customer: 0, evidence: true }] },
  { id: 'LD-98561', customer: 'Summit Building Co.', lane: 'Denver, CO → Salt Lake City, UT', deliveredAt: 'Aug 24 · 20:41', ageHours: 48, amount: 6080, status: 'Invoiced', risk: 0, owner: 'Automated', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [] },
  { id: 'LD-98576', customer: 'Redwood Produce', lane: 'Fresno, CA → Reno, NV', deliveredAt: 'Aug 24 · 18:12', ageHours: 51, amount: 3710, status: 'Review', issue: 'Detention evidence review', risk: 420, owner: 'Sarah M.', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [{ label: 'Detention', carrier: 420, customer: 0, evidence: true }] },
  { id: 'LD-98588', customer: 'Hearth & Home', lane: 'Louisville, KY → Cincinnati, OH', deliveredAt: 'Aug 24 · 16:35', ageHours: 54, amount: 2940, status: 'Ready to invoice', risk: 0, owner: 'Automated', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [] },
  { id: 'LD-98593', customer: 'Continental Paper', lane: 'Savannah, GA → Orlando, FL', deliveredAt: 'Aug 24 · 15:03', ageHours: 56, amount: 5580, status: 'Review', issue: 'TONU not customer-approved', risk: 375, owner: 'Finance', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [{ label: 'TONU', carrier: 375, customer: 0, evidence: true }] },
  { id: 'LD-98604', customer: 'Keystone Foods', lane: 'Philadelphia, PA → Baltimore, MD', deliveredAt: 'Aug 24 · 12:18', ageHours: 59, amount: 3475, status: 'Invoiced', risk: 0, owner: 'Automated', pod: true, rateCon: true, carrierInvoice: true, customerRequirements: true, accessorials: [] },
];

export const formatMoney = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(value);

export const statusClass = (status: LoadStatus) => status.toLowerCase().replaceAll(' ', '-');
