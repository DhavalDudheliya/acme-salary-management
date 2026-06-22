/**
 * Static reference data the seed draws from. Kept in one place so the realistic
 * multi-country spread is easy to read and tune.
 *
 * Base reporting currency is USD (rate_to_base = 1). `rateToBase` converts a
 * local currency to USD (local * rateToBase = USD). Salary bands are expressed
 * in each country's *local* currency — INR/JPY bands are large by design.
 */

export const BASE_CURRENCY = 'USD'

export interface Country {
  name: string
  currency: string
  /** local * rateToBase = USD */
  rateToBase: number
  /** hire-salary band in local currency [min, max] */
  band: [number, number]
}

/** Several countries share a currency (EUR) on purpose — fx_rates is keyed by currency. */
export const COUNTRIES: readonly Country[] = [
  { name: 'United States', currency: 'USD', rateToBase: 1, band: [55_000, 185_000] },
  { name: 'United Kingdom', currency: 'GBP', rateToBase: 1.27, band: [38_000, 130_000] },
  { name: 'Germany', currency: 'EUR', rateToBase: 1.08, band: [45_000, 135_000] },
  { name: 'France', currency: 'EUR', rateToBase: 1.08, band: [40_000, 120_000] },
  { name: 'Canada', currency: 'CAD', rateToBase: 0.73, band: [55_000, 165_000] },
  { name: 'Australia', currency: 'AUD', rateToBase: 0.66, band: [60_000, 175_000] },
  { name: 'India', currency: 'INR', rateToBase: 0.012, band: [600_000, 4_800_000] },
  { name: 'Singapore', currency: 'SGD', rateToBase: 0.74, band: [55_000, 170_000] },
  { name: 'Japan', currency: 'JPY', rateToBase: 0.0067, band: [4_000_000, 16_000_000] },
  { name: 'Brazil', currency: 'BRL', rateToBase: 0.18, band: [60_000, 320_000] },
  { name: 'Poland', currency: 'PLN', rateToBase: 0.25, band: [80_000, 300_000] },
  { name: 'Mexico', currency: 'MXN', rateToBase: 0.058, band: [180_000, 850_000] },
]

export interface Department {
  name: string
  /** multiplier applied to the hire-salary band position */
  payFactor: number
  roles: readonly string[]
}

export const DEPARTMENTS: readonly Department[] = [
  { name: 'Engineering', payFactor: 1.25, roles: ['Software Engineer', 'Platform Engineer', 'QA Engineer', 'Data Engineer'] },
  { name: 'Product', payFactor: 1.2, roles: ['Product Manager', 'Product Analyst', 'UX Designer'] },
  { name: 'Sales', payFactor: 1.1, roles: ['Account Executive', 'Sales Representative', 'Solutions Consultant'] },
  { name: 'Finance', payFactor: 1.1, roles: ['Financial Analyst', 'Accountant', 'Controller'] },
  { name: 'Legal', payFactor: 1.15, roles: ['Counsel', 'Compliance Officer', 'Contracts Manager'] },
  { name: 'Marketing', payFactor: 1.0, roles: ['Marketing Manager', 'Content Strategist', 'Growth Marketer'] },
  { name: 'Operations', payFactor: 0.95, roles: ['Operations Manager', 'Program Coordinator', 'Logistics Analyst'] },
  { name: 'IT', payFactor: 1.05, roles: ['IT Administrator', 'Support Engineer', 'Security Analyst'] },
  { name: 'Customer Support', payFactor: 0.85, roles: ['Support Specialist', 'Customer Success Manager', 'Support Lead'] },
  { name: 'Human Resources', payFactor: 0.95, roles: ['HR Generalist', 'Recruiter', 'People Partner'] },
]

export interface Seniority {
  /** prefix on the job title; '' for the mid baseline */
  prefix: string
  /** position within the hire-salary band [0..1] */
  bandPosition: number
}

export const SENIORITIES: readonly Seniority[] = [
  { prefix: 'Junior', bandPosition: 0.15 },
  { prefix: '', bandPosition: 0.4 },
  { prefix: 'Senior', bandPosition: 0.6 },
  { prefix: 'Lead', bandPosition: 0.8 },
  { prefix: 'Principal', bandPosition: 0.95 },
]

export const SALARY_CHANGE_REASONS: readonly string[] = [
  'merit increase',
  'promotion',
  'market adjustment',
  'annual review',
  'retention',
]

export const FIRST_NAMES: readonly string[] = [
  'Olivia', 'Liam', 'Emma', 'Noah', 'Amara', 'Mateo', 'Sofia', 'Arjun', 'Yuki', 'Lucas',
  'Mia', 'Ethan', 'Aisha', 'Hiro', 'Chloe', 'Diego', 'Priya', 'Henrik', 'Zara', 'Marco',
  'Ingrid', 'Kenji', 'Fatima', 'Tomas', 'Leila', 'Sven', 'Ananya', 'Pablo', 'Nadia', 'Felix',
  'Mei', 'Omar', 'Greta', 'Ravi', 'Camila', 'Jonas', 'Sara', 'Andre', 'Hana', 'Viktor',
]

export const LAST_NAMES: readonly string[] = [
  'Smith', 'Garcia', 'Muller', 'Tanaka', 'Kowalski', 'Silva', 'Nguyen', 'Patel', 'Andersson', 'Rossi',
  'Dubois', 'Schneider', 'Kim', 'Okafor', 'Johansson', 'Costa', 'Sharma', 'Novak', 'Ferreira', 'Larsson',
  'Yamamoto', 'Khan', 'Weber', 'Moreau', 'Reddy', 'Bergmann', 'Santos', 'Petrov', 'Lindqvist', 'Chen',
]
