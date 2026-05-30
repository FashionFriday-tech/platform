export const ProductQuality = {
  footwear: [
    {
      id: 'og',
      name: 'OG / Retail',
      tier: 'Level 01 · Retail',
      accuracy: 'Authentic',
      detail:
        'Official brand-distributed retail pairs sold through authorized channels. Materials, tooling, cushioning, packaging, and QC strictly follow brand specifications.',
      tech: ['Brand QC', 'Retail Materials', 'Official Packaging'],
    },

    {
      id: 'surplus',
      name: 'Surplus / Factory Excess',
      tier: 'Level 02 · Factory Excess',
      accuracy: '95–99%',
      detail:
        'Genuine factory-produced pairs released due to overproduction, cancelled export orders, or old production cycles. Structurally retail with possible minor cosmetic variance.',
      tech: ['Original Tooling', 'Retail Materials', 'Minor Cosmetic Variance'],
    },

    {
      id: 'ua',
      name: 'UA (Unauthorized Authentic)',
      tier: 'Level 03 · Parallel Production',
      accuracy: '92–96%',
      detail:
        'Produced using original or near-original factory molds and measurements, but outside brand authorization. Shape, weight, and finish are extremely close to retail.',
      tech: ['Factory Molds', 'Correct Geometry', 'Near-Retail Weight'],
    },

    {
      id: 'semi-ua',
      name: 'Semi-UA',
      tier: 'Level 04 · Mixed Spec',
      accuracy: '85–90%',
      detail:
        'Retail-accurate silhouette with selective material substitutions. External appearance closely matches retail, while internal cushioning or compounds are simplified.',
      tech: ['Retail Silhouette', 'Alternate Cushioning', 'Comfort Focused'],
    },

    {
      id: '10a',
      name: '10A Grade',
      tier: 'Level 05 · High Replica',
      accuracy: '80–85%',
      detail:
        'High-grade replica tier focused on shape accuracy and overall finish. Materials are good quality but differ from retail upon close inspection.',
      tech: ['Accurate Shape', 'Good Stitching', 'Premium Synthetic Upper'],
    },

    {
      id: '7a',
      name: '7A Grade',
      tier: 'Level 06 · Mid Replica',
      accuracy: '75–80%',
      detail:
        'Balanced quality tier for daily use. Visual similarity is acceptable, but materials and cushioning are standard market grade.',
      tech: ['Market Materials', 'Decent Durability'],
    },

    {
      id: '6a',
      name: '6A Grade',
      tier: 'Level 07 · Standard',
      accuracy: '60–70%',
      detail:
        'Noticeable differences in material feel, weight, and comfort. Suitable for budget-conscious everyday wear.',
      tech: ['Basic Construction'],
    },

    {
      id: '5a',
      name: '5A Grade',
      tier: 'Level 08 · Entry',
      accuracy: '50–60%',
      detail:
        'Entry-level build focused on price. Shape is approximate and long-term durability is limited.',
      tech: ['Entry Materials'],
    },
  ],

  apparel: [
    {
      id: 'og',
      name: 'OG / Retail',
      tier: 'Level 01 · Retail',
      accuracy: '100%',
      detail: 'Brand-manufactured garments with verified fabric, GSM, stitches, and labeling.',
      tech: ['Official Fabric', 'Brand QC', 'Exact Fit'],
    },
    {
      id: 'super-rep',
      name: 'Super Rep / High Replica',
      tier: 'Level 02 · Top Replica',
      accuracy: '88–94%',
      detail:
        'Closely mimics retail apparel in cut, fabric weight, and detail. Soft garment handfeel with strong stitching and accurate branding.',
      tech: ['High GSM Fabric', 'Precise Pattern'],
    },
    {
      id: '7a',
      name: '7A Grade',
      tier: 'Level 03 · Mid Replica',
      accuracy: '75–83%',
      detail:
        'Good visual match with lighter fabric weight. Branding and fit are good but may deviate slightly from exact retail specifications.',
      tech: ['Comfort Fabric', 'Visual Accuracy'],
    },
    {
      id: '6a',
      name: '6A Grade',
      tier: 'Level 04 · Standard Replica',
      accuracy: '65–75%',
      detail:
        'Material feels generic and construction is basic. Works for everyday wear but lacks premium feel.',
      tech: ['Blended Fabric', 'Standard Stitching'],
    },
    {
      id: '5a',
      name: '5A Grade',
      tier: 'Level 05 · Budget Replica',
      accuracy: '55–65%',
      detail:
        'Basic garments with obvious differences from retail fabrics and fit. Budget tier for casual use.',
      tech: ['Entry Materials', 'Basic Build'],
    },
  ],

  watches: [
    {
      id: 'superclone',
      name: 'Super Clone / Swiss 1:1',
      tier: 'Level 01 · Top Replica',
      accuracy: '90–98%',
      detail:
        'Highest tier replica watches with high-grade cloned movements and accurate materials matching visual retail specs. Often discussed as ‘super clone’ in replica communities.  ',
      tech: ['Clone Movement (High Beat)', 'Sapphire Crystal', 'Close Weight Match'],
    },
    {
      id: 'aaa',
      name: 'AAA Grade',
      tier: 'Level 02 · Premium Replica',
      accuracy: '80–88%',
      detail:
        'Strong visual accuracy with good stainless steel finishes and decent movements. Crystal and case materials are mid-high grade but not as precise as super clone builds.  ',
      tech: ['316L Steel', 'Mineral or Sapphire Glass'],
    },
    {
      id: 'midrep',
      name: 'Mid Replica',
      tier: 'Level 03 · Standard Replica',
      accuracy: '65–78%',
      detail:
        'Affordable replica with visible differences in finishing and movement quality. Acceptable for fashion use but not precision timekeeping.',
      tech: ['Standard Movement', 'Basic Materials'],
    },
    {
      id: 'budget',
      name: 'Budget Replica',
      tier: 'Level 04 · Low Replica',
      accuracy: 'Below 65%',
      detail:
        'Low-cost replicas with poor movement, weak materials, and obvious details that differ from retail watches.',
      tech: ['Quartz/Budget Movement', 'Basic Finishes'],
    },
  ],
};
