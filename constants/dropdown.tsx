type IndustryRoles = {
  [key: string]: string[];
};
export const IndustryChoicesOptions = [
  { key: "1", value: "Textile Industry" },
  { key: "2", value: "CNC (Computer Numerical Control)" },
  { key: "3", value: "Packaging Industry" },
  { key: "4", value: "Auto Parts Industry" },
  { key: "5", value: "Printing Industry" },
];

export const PreferredLocationOptions = [
  { key: "1", value: "Delhi NCR" },
  { key: "2", value: "Haryana" },
  { key: "3", value: "Rajasthan" },
  { key: "4", value: "Uttar Pradesh (UP)" },
  { key: "5", value: "Uttarakhand" },
];

export const rolesByIndustry: IndustryRoles = {
  "Textile Industry": [
    "Spinner",
    "Weaver",
    "Knitter",
    "Dyer",
    "Cutter",
    "Sewer/Stitcher",
    "Quality Control Inspector",
    "Machine Operator",
    "Textile Technician",
    "Pattern Maker",
  ],
  "CNC (Computer Numerical Control)": [
    "CNC Operator",
    "CNC Programmer",
    "CNC Setter",
    "CNC Machinist",
    "CNC Lathe Operator",
    "CNC Maintenance Technician",
  ],
  "Packaging Industry": [
    "Packaging Machine Operator",
    "Production Line Leader",
    "Quality Control Inspector",
    "Inventory Clerk",
    "Maintenance Technician",
    "Order Picker",
    "Blister Pack Technician",
    "Packaging Designer",
    "Production Supervisor",
    "Process Engineer",
  ],
  "Auto Parts Industry": [
    "Assembly Line Worker",
    "Machine Operator",
    "Quality Control Inspector",
    "Welder",
    "CNC Machinist",
    "Injection Molding Technician",
    "Press Operator",
    "Fabricator",
    "Paint Technician",
    "Maintenance Technician",
  ],
  "Printing Industry": [
    "Press Operator",
    "Prepress Technician",
    "Bindery Worker",
    "Digital Printer Operator",
    "Screen Printer",
    "Flexographic Printer",
    "Lithographic Printer",
    "Gravure Printer",
    "Finishing Technician",
    "Quality Control Inspector",
  ],
};
