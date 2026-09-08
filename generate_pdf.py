import os
import sys

def sanitize(txt):
    replacements = {
        '—': ' - ',
        '–': '-',
        '’': "'",
        '‘': "'",
        '“': '"',
        '”': '"',
        '•': '*',
        '…': '...',
        '→': '->',
        '₹': 'Rs. ',
    }
    for k, v in replacements.items():
        txt = txt.replace(k, v)
    return txt

def create_paimana_summary_pdf(filename):
    W = 595.28
    H = 841.89

    stream_ops = []

    def rgb(r, g, b):
        return f"{r:.3f} {g:.3f} {b:.3f}"

    def set_fill(r, g, b):
        stream_ops.append(f"{rgb(r, g, b)} rg")

    def set_stroke(r, g, b):
        stream_ops.append(f"{rgb(r, g, b)} RG")

    def set_line_width(w):
        stream_ops.append(f"{w:.2f} w")

    def rect(x, y, w, h, fill=True, stroke=False):
        op = "B" if (fill and stroke) else ("f" if fill else "s")
        stream_ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re {op}")

    def text(x, y, txt, font="F1", size=9, r=0, g=0, b=0):
        txt = sanitize(txt)
        esc = txt.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        stream_ops.append(f"BT /{font} {size} Tf {rgb(r,g,b)} rg {x:.2f} {y:.2f} Td ({esc}) Tj ET")

    # ==================== 1. OFFICIAL GOVT HEADER BANNER ====================
    # Deep Sovereign Navy Blue
    set_fill(0.04, 0.15, 0.27) # #0B2545
    rect(24, 768, 547, 54, fill=True, stroke=False)

    # Tricolor gold/amber accent bar at top
    set_fill(0.85, 0.55, 0.10) # Gold
    rect(24, 820, 547, 3, fill=True, stroke=False)

    # National Emblem / Logo Badge Box
    set_fill(1.0, 1.0, 1.0)
    rect(34, 777, 36, 36, fill=True, stroke=False)
    text(44, 786, "GOI", font="F2", size=13, r=0.04, g=0.15, b=0.27)

    # Main Title Header
    text(78, 800, "GOVERNMENT OF INDIA - MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION", font="F2", size=10.5, r=1, g=1, b=1)
    text(78, 788, "Infrastructure & Project Monitoring Division (IPMD) | National Infrastructure Pipeline", font="F1", size=8.5, r=0.82, g=0.88, b=0.95)
    text(78, 776, "EXECUTIVE EARLY WARNING DOSSIER - 1,428 CENTRAL SECTOR MEGA-PROJECTS (>= Rs. 150 Cr)", font="F2", size=7.2, r=1.0, g=0.82, b=0.35)

    # Header Right Badge (Confidential / Official Ref)
    set_fill(0.08, 0.25, 0.45)
    rect(438, 774, 124, 40, fill=True, stroke=False)
    set_stroke(1.0, 1.0, 1.0)
    set_line_width(0.5)
    rect(438, 774, 124, 40, fill=False, stroke=True)
    text(444, 800, "DOC REF: MoSPI/IPMD/2026-Q3", font="F2", size=6.8, r=1.0, g=0.85, b=0.3)
    text(444, 790, "Security: OFFICIAL USE ONLY", font="F1", size=6.5, r=1, g=1, b=1)
    text(444, 780, "Surveillance Cycle: FY24-25 Q3", font="F3", size=6.2, r=0.8, g=0.9, b=1.0)

    # ==================== 2. MACRO KPI RIBBONS ====================
    kpis = [
        ("MONITORED CAPEX", "Rs. 14,82,450 Cr", "1,428 Active Mega Packages", (0.04, 0.15, 0.27)),
        ("SEVERE DELAY RISK", "Rs. 2,18,640 Cr", "14.7% of Portfolio (>180d)", (0.75, 0.11, 0.11)),
        ("AVG FORECAST SLIP", "+118 Days", "National Median vs DPR COD", (0.75, 0.35, 0.05)),
        ("ACTIVE BOTTLENECKS", "184 Critical Holds", "76 Forest | 42 Land | 46 Utility", (0.08, 0.45, 0.22))
    ]
    card_w = 131
    for i, (label, val, sub, col) in enumerate(kpis):
        cx = 24 + i * (card_w + 7.5)
        cy = 724
        set_fill(0.96, 0.97, 0.99)
        rect(cx, cy, card_w, 36, fill=True, stroke=False)
        set_fill(*col)
        rect(cx, cy, 3.5, 36, fill=True, stroke=False)
        set_stroke(0.85, 0.88, 0.92)
        set_line_width(0.5)
        rect(cx, cy, card_w, 36, fill=False, stroke=True)
        text(cx + 8, cy + 26, label, font="F2", size=6.5, r=0.4, g=0.45, b=0.5)
        text(cx + 8, cy + 13, val, font="F2", size=10.5, r=col[0], g=col[1], b=col[2])
        text(cx + 8, cy + 4.5, sub, font="F1", size=6.0, r=0.45, g=0.5, b=0.55)

    # ==================== LAYOUT CONFIG ====================
    col_w = 268
    col1_x = 24
    col2_x = 303

    def draw_box(x, y, w, h, title, title_bg=(0.92, 0.94, 0.97), title_fg=(0.04, 0.15, 0.27)):
        set_fill(1.0, 1.0, 1.0)
        rect(x, y, w, h, fill=True, stroke=False)
        set_fill(*title_bg)
        rect(x, y + h - 16, w, 16, fill=True, stroke=False)
        set_stroke(0.83, 0.86, 0.90)
        set_line_width(0.6)
        rect(x, y, w, h, fill=False, stroke=True)
        text(x + 7, y + h - 12, title, font="F2", size=7.8, r=title_fg[0], g=title_fg[1], b=title_fg[2])

    # =======================================================
    # LEFT COLUMN: Height = 668 pt (y: 48 to 716)
    # Card 1: Sector Vulnerability (y: 505, h: 211)
    # Card 2: Top Corridor Stoppages (y: 275, h: 220)
    # Card 3: Statutory Clearance Deficits (y: 48, h: 217)
    # =======================================================

    # --- CARD 1: Sector Vulnerability Matrix (y: 505, h: 211) ---
    draw_box(col1_x, 505, col_w, 211, "1. SECTOR VULNERABILITY MATRIX & EXPOSURE")
    sectors = [
        ("Highways (MoRTH / NHAI)", "584 Pkgs", "Rs. 6,42,000 Cr", "+94d Avg", "RoW acquisition, tree felling, toll plaza arbitration"),
        ("Freight Rail (DFCCIL / Railways)", "312 Pkgs", "Rs. 4,18,000 Cr", "+142d Avg", "Overhead Electrification & Rail Over Bridge (ROB) holds"),
        ("Power Grid (PGCIL / NTPC)", "244 Pkgs", "Rs. 1,98,000 Cr", "+68d Avg", "Substation land handover & forest transmission corridors"),
        ("Urban Transit & Metros (MoHUA)", "188 Pkgs", "Rs. 1,44,000 Cr", "+112d Avg", "Deep underground utility diversions & depot litigations"),
        ("Water Infra (Jal Jeevan Mission)", "100 Pkgs", "Rs. 80,450 Cr", "+86d Avg", "Intake pumping station ground-water clearance mandates")
    ]
    cur_y = 682
    for sec_name, pkgs, capex, slip, factor in sectors:
        set_fill(0.95, 0.96, 0.98)
        rect(col1_x + 6, cur_y - 1, col_w - 12, 10, fill=True, stroke=False)
        text(col1_x + 9, cur_y + 1.2, sec_name, font="F2", size=6.8, r=0.04, g=0.15, b=0.35)
        text(col1_x + 138, cur_y + 1.2, f"{pkgs} | {capex}", font="F2", size=6.2, r=0.15, g=0.45, b=0.2)
        text(col1_x + 225, cur_y + 1.2, slip, font="F2", size=6.2, r=0.75, g=0.15, b=0.15)
        cur_y -= 10.0
        text(col1_x + 12, cur_y, "Primary Bottleneck: " + factor, font="F1", size=5.8, r=0.32, g=0.35, b=0.40)
        cur_y -= 10.5

    # Summary callout inside Card 1
    set_fill(0.98, 0.94, 0.94)
    rect(col1_x + 6, 511, col_w - 12, 22, fill=True, stroke=False)
    set_stroke(0.95, 0.8, 0.8)
    rect(col1_x + 6, 511, col_w - 12, 22, fill=False, stroke=True)
    text(col1_x + 10, 523, "ALERT: Top 2 Sectors (Highways + Freight Rail) represent 71.5% of all", font="F2", size=5.8, r=0.75, g=0.15, b=0.15)
    text(col1_x + 10, 515, "national milestone slippages and account for Rs. 1,56,400 Cr in cost risk.", font="F1", size=5.8, r=0.6, g=0.15, b=0.15)

    # --- CARD 2: Top Critical Corridor Stoppages (y: 275, h: 220) ---
    draw_box(col1_x, 275, col_w, 220, "2. HIGH-PRIORITY CORRIDOR IMPASSE TRACKER")
    projects = [
        ("Delhi-Mumbai Expressway (Vadodara-Kim)", "NHAI-DEL-MUM-P4", "+145d", "Dilip Buildcon",
         "MoEFCC Stage-II Forest Clearance stalled in Ratlam Division (34.2 Ha).", "Action: Direct PMO PRAGATI Escalation."),
        ("Western DFC: Makarpura-Sachin CTP-11", "DFCCIL-WDFC-11", "+81d", "L&T - Sojitz JV",
         "Track-laying train mobilization deficit & Surat district bridge pier dispute.", "Action: Audit EPC mobilization plan."),
        ("Bundelkhand Surface Water Intake Pkg-8", "JJM-UP-BUND-08", "+60d", "NCC Limited",
         "Aquifer re-survey mandate issued by UP State Ground Water Dept.", "Action: Expedite hydro-geology review."),
        ("Bangalore Suburban Rail Corridor-2", "KRIDE-BSRP-C2", "+190d", "L&T Construction",
         "Defense land parcel transfer pending clearance from Ministry of Defence.", "Action: Inter-Ministerial Cabinet Summit.")
    ]
    cur_y = 477
    for pname, code, slip, contractor, rootcause, directive in projects:
        set_fill(0.97, 0.98, 0.99)
        rect(col1_x + 6, cur_y - 2, col_w - 12, 11, fill=True, stroke=False)
        text(col1_x + 9, cur_y, pname, font="F2", size=6.5, r=0.08, g=0.2, b=0.35)
        text(col1_x + 175, cur_y, f"[{code}]", font="F3", size=5.5, r=0.45, g=0.5, b=0.55)
        text(col1_x + 235, cur_y, slip, font="F2", size=6.5, r=0.8, g=0.1, b=0.1)
        cur_y -= 9.5
        text(col1_x + 12, cur_y, f"Contractor: {contractor} | Bottleneck: {rootcause}", font="F1", size=5.6, r=0.25, g=0.28, b=0.32)
        cur_y -= 8.0
        text(col1_x + 12, cur_y, "-> " + directive, font="F2", size=5.6, r=0.08, g=0.45, b=0.22)
        cur_y -= 10.0

    # --- CARD 3: Statutory Stoppages & Legal Holds (y: 48, h: 217) ---
    draw_box(col1_x, 48, col_w, 217, "3. STATUTORY IMPASSE AUDIT (RFCTLARR & MoEFCC)")
    statutory_items = [
        ("MoEFCC Forest Stage-II Clearances", "76 Critical Holds (Avg 8.5m turnaround)", [
            "- 19 high-density linear forest corridors pending FAC appraisal.",
            "- In-principle Stage-I granted; Stage-II pending compensatory afforestation.",
            "- Immediate mandate: Deploy PARIVESH fast-track green corridor dispensation."
        ]),
        ("RFCTLARR Act Land Acquisition (Sec 3D / 3H)", "42 Stalled Corridors (Avg 6.2m)", [
            "- Rs. 2,400 Cr in compensation awards lying in escrow accounts.",
            "- Heir succession and mutation backlogs blocking physical possession.",
            "- Risk of Section 25 statutory proceeding lapse if unaddressed in 90 days."
        ]),
        ("Jan Vishwas Act 2023 Decriminalization", "35% False Hold Reduction", [
            "- Decriminalization of weighbridge calibration and technical metrology offenses",
            "  eliminated 114 frivolous site holds, releasing Rs. 38,000 Cr in active works."
        ])
    ]
    cur_y = 247
    for st_title, st_stat, st_bullets in statutory_items:
        set_fill(0.95, 0.96, 0.98)
        rect(col1_x + 6, cur_y - 1, col_w - 12, 10, fill=True, stroke=False)
        text(col1_x + 9, cur_y + 1.2, st_title, font="F2", size=6.5, r=0.08, g=0.25, b=0.55)
        text(col1_x + 155, cur_y + 1.2, st_stat, font="F2", size=6.0, r=0.75, g=0.15, b=0.15)
        cur_y -= 9.0
        for b in st_bullets:
            text(col1_x + 12, cur_y, b, font="F1", size=5.7, r=0.25, g=0.28, b=0.32)
            cur_y -= 7.5
        cur_y -= 2.5

    # =======================================================
    # RIGHT COLUMN: Height = 668 pt (y: 48 to 716)
    # Card 4: Sovereign ML Engine & Loss Rigor (y: 505, h: 211)
    # Card 5: MoRD & Land Governance (SIH25017) (y: 275, h: 220)
    # Card 6: Mandated Cabinet Directives (y: 48, h: 217)
    # =======================================================

    # --- CARD 4: Sovereign ML Engine & Loss Rigor (y: 505, h: 211) ---
    draw_box(col2_x, 505, col_w, 211, "4. PREDICTIVE ML ENGINE & METHODOLOGICAL RIGOR")
    ml_specs = [
        ("Hybrid Loss Optimization", [
            "L_hybrid = alpha * L_CE + (1 - alpha) * L_Focal(gamma=2.0, alpha_t)",
            "- Cross-Entropy preserves general calibration across all 1,428 packages.",
            "- Focal Loss forces gradient descent on rare catastrophic delays (>180d)."
        ]),
        ("Leak-Free Purged Walk-Forward Splitting", [
            "- Strict chronological walk-forward training eliminates look-ahead bias.",
            "- 90-day post-training embargo prevents multi-year parcel timeline leakage.",
            "- Verifiable 0.00% data leakage across historic mega-project evaluations."
        ]),
        ("SHAP Factor Waterfall Decomposition", [
            "- Mathematical model loss decomposed into plain-language civil factors.",
            "- Top drivers: Land Possession % (38%), Forest Stage-II (26%), Contractor",
            "  Mobilization Rate (18%), Material Inflation (12%), Monsoon Exposure (6%)."
        ]),
        ("Model Accuracy Benchmarks", [
            "- Overall Accuracy: 91.8% | Severe Delay Recall: 92.3% | Precision: 96.8%."
        ])
    ]
    cur_y = 684
    for m_title, m_pts in ml_specs:
        text(col2_x + 8, cur_y, m_title, font="F2", size=6.8, r=0.04, g=0.25, b=0.6)
        cur_y -= 8.5
        for pt in m_pts:
            text(col2_x + 14, cur_y, pt, font="F1", size=5.8, r=0.25, g=0.28, b=0.32)
            cur_y -= 7.5
        cur_y -= 2.5

    # --- CARD 5: MoRD Land Governance & Policy Integration (y: 275, h: 220) ---
    draw_box(col2_x, 275, col_w, 220, "5. MoRD LAND GOVERNANCE ENGINE (SIH25017-26019)")
    mord_pillars = [
        ("SIH25017: Predictive Land Delays", "AI Risk Matrix evaluating compensation dispute probability & title mutation backlogs 120 days prior to RFCTLARR Section 19/25 statutory lapsing."),
        ("SIH26015: Geo-Watershed Satellite Analysis", "Direct integration with SRISHTI-DRISHTI 30m resolution multispectral layers to monitor drainage disruptions and soil moisture along construction corridors."),
        ("SIH26016: National Land Acquisition Tracker", "End-to-end digital lifecycle tracker mapped to project critical paths: Proposal -> Notification -> Award -> Compensation -> Physical Possession."),
        ("SIH26018: Intelligent Cadastral OCR", "Automated computer-vision extraction of Khasra / Khata numbers from legacy scanned and handwritten land registers to resolve heir succession claims."),
        ("SIH26019: Evidence-Based Policy Sandbox", "Simulation environment for IAS officers to project delay mitigation from local land reforms, direct negotiation incentives, and fast-track compensation.")
    ]
    cur_y = 478
    for p_id, p_desc in mord_pillars:
        set_fill(0.95, 0.98, 0.95)
        rect(col2_x + 6, cur_y - 1, col_w - 12, 9.5, fill=True, stroke=False)
        text(col2_x + 9, cur_y + 1.2, p_id, font="F2", size=6.5, r=0.08, g=0.45, b=0.2)
        cur_y -= 9.0
        text(col2_x + 12, cur_y, p_desc, font="F1", size=5.7, r=0.28, g=0.32, b=0.36)
        cur_y -= 14.5

    # --- CARD 6: Mandated Cabinet Action Directives (y: 48, h: 217) ---
    draw_box(col2_x, 48, col_w, 217, "6. MANDATED CABINET COMMITTEE DIRECTIVES (CCI)")
    directives = [
        ("Directive 1 (Immediate / 7 Days): PARIVESH Fast-Track",
         "MoEFCC to grant deemed in-principle approval for 19 linear infrastructure packages with Stage-I clearance where compensatory afforestation funds have been deposited."),
        ("Directive 2 (14 Days): State Land Escrow Liquidity Release",
         "Chief Secretaries of UP, Maharashtra, Karnataka, and Bihar to release Rs. 2,400 Cr in compensation awards from Section 3H(1) escrow to clear RoW disputes."),
        ("Directive 3 (21 Days): Concessionaire Paving Acceleration",
         "NHAI and RVNL Project Directors to invoke Contract Clause 14.3, enforcing 24x7 double-shift slipform paving mobilization on stalled packages."),
        ("Directive 4 (30 Days): Vivad se Vishwas II Conciliation",
         "Ministry of Finance dispute resolution mechanism to be initiated for 28 pending liquidated damages arbitrations, releasing Rs. 8,400 Cr in contractor liquidity.")
    ]
    cur_y = 247
    for d_title, d_text in directives:
        set_fill(0.98, 0.96, 0.92)
        rect(col2_x + 6, cur_y - 1, col_w - 12, 10, fill=True, stroke=False)
        text(col2_x + 9, cur_y + 1.2, d_title, font="F2", size=6.5, r=0.75, g=0.35, b=0.05)
        cur_y -= 9.0
        text(col2_x + 12, cur_y, d_text, font="F1", size=5.7, r=0.25, g=0.28, b=0.32)
        cur_y -= 14.0

    # ==================== 8. FOOTER BAR ====================
    set_fill(0.94, 0.95, 0.97)
    rect(24, 25, 547, 18, fill=True, stroke=False)
    set_stroke(0.82, 0.85, 0.88)
    set_line_width(0.5)
    rect(24, 25, 547, 18, fill=False, stroke=True)

    text(32, 31, "Published by Infrastructure & Project Monitoring Division (IPMD), MoSPI, New Delhi | Generated via PAIMANA AI Suite", font="F2", size=6.5, r=0.2, g=0.25, b=0.35)
    text(485, 31, "Official Dossier - Page 1 of 1", font="F2", size=6.5, r=0.04, g=0.15, b=0.35)

    # --- SERIALIZE PDF ---
    content_stream = "\n".join(stream_ops)
    stream_bytes = content_stream.encode('latin1')

    objects = []
    def add_obj(body):
        objects.append(body)
        return len(objects)

    add_obj("<< /Type /Catalog /Pages 2 0 R >>")
    add_obj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    add_obj(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {W:.2f} {H:.2f}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>")
    add_obj(f"<< /Length {len(stream_bytes)} >>\nstream\n{content_stream}\nendstream")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>")

    out = ["%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"]
    offsets = []
    for i, obj in enumerate(objects, 1):
        offsets.append(sum(len(x.encode('latin1')) for x in out))
        out.append(f"{i} 0 obj\n{obj}\nendobj\n")

    xref_pos = sum(len(x.encode('latin1')) for x in out)
    out.append(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n")
    for off in offsets:
        out.append(f"{off:010d} 00000 n \n")

    out.append(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n")

    full_pdf_bytes = "".join(out).encode('latin1')
    with open(filename, 'wb') as f:
        f.write(full_pdf_bytes)

    print(f"Successfully generated official MoSPI Dossier: {filename} ({len(full_pdf_bytes)} bytes)")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "MoSPI_Flash_Report_PAIMANA.pdf"
    create_paimana_summary_pdf(target)
